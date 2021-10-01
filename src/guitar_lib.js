/*
  //♭ &flat; alt+?
  
  GuitarJoe's guitar logic
  by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  
   Note:
    - note refers to what we usually call a note: C#
    - note object: { strgnum:int, fret:int, note:'C#', semis:49, ... }
    - note.semis is unique
    - fret is an integer
    - fobj is a fret object: frets.obj() => { strg:{}, fret:int, tab:'e12' }
    - ivl is an interval object: intervals.list[n]
    - assume: exception handling performed by caller

  Todo:
    - check for code consistency
    - (when needed) update notes.calc() for ##/bb -- see comments in function
  
 */

var q = {

  chords: {
    //verified against: https://www.omnicalculator.com/other/chord
    list:[
      {
        name:'Major triad', abr:'maj',
        intervals:[ 'P1', 'M3', 'P5' ]
      },{
        name:'Minor triad', abr:'min',
        intervals:[ 'P1', 'm3', 'P5' ]
      },{
        name:'Augmented triad', abr:'aug',
        intervals:[ 'P1', 'M3', 'A5' ]
      },{
        name:'Diminished triad', abr:'dim',
        intervals:[ 'P1', 'm3', 'd5' ]
      },{
        name:'Dominant seventh', abr:'7',
        intervals:[ 'P1', 'M3', 'P5', 'm7' ]
      },{
        name:'Major seventh', abr:'maj7',
        intervals:[ 'P1', 'M3', 'P5', 'M7' ]
      },{
        name:'Minor seventh', abr:'min7',
        intervals:[ 'P1', 'm3', 'P5', 'm7' ]
      },{
        name:'Major sixth', abr:'maj6',
        intervals:[ 'P1', 'M3', 'P5', 'M6' ]
      },{
        name:'Minor sixth', abr:'min6',
        intervals:[ 'P1', 'm3', 'P5', 'M6' ]
      },{
        name:'Suspended second', abr:'sus2',
        intervals:[ 'P1', 'M2', 'P5' ]
      },{
        name:'Suspended fourth', abr:'sus4',
        intervals:[ 'P1', 'P4', 'P5' ]
      }
    ],
    byName( str ){
      for(let chord of q.chords.list){
        if(chord.abr === str || chord.name === str)
          return Object.assign({}, chord )
      }
      return null
    },
    obj( root, chordName ){  //return chord with notes based on root
      let ivls = [],
        chord = q.chords.byName( chordName )
      if(chord === null) return null

      if(typeof root === 'string')
        root = q.intervals.byName( root )   //object returned to caller
      if(root === null) return null

      let preferFlats = ( 
          chord.name.indexOf('Minor') >= 0  
        ||chord.name.indexOf('Diminished') >= 0 
        || root.note.indexOf('♭') >= 0)
      for(let iname of chord.intervals){
        let ivl = q.intervals.byName( iname )
        let note = q.notes.calc( root, ivl, preferFlats )
        ivls.push( Object.assign({}, ivl, { note:note } ))
      }

      let obj = Object.assign({}, chord, {
        type:'chord',
        fullName: root.note +' '+chord.name,
        fullAbbrev: root.note +chord.abr,
        root: Object.assign({}, root),
        ivls:ivls
       })

      return obj
    },
    inversions( note, octave = 0, maxinversions = 3 ){   // return an inversion object for given note in major scale
      //assume: inversions are for Major triad or Maj7
      note = note.toUpperCase()
      let result = { root:note, octave:octave, max:maxinversions, positions:{} }
      let rootobj = null
      for( let cnt = 1; cnt <= maxinversions; cnt++){
        let letter = ['Root','First','Second','Third'][cnt -1]    //use letter notation: root position = a, first inversion = b
        result.positions[ letter ] = {}
        let obj = result.positions[ letter ]
        if( rootobj === null){
          for(let ii = 0; ii < maxinversions; ii++){
            let inv = String( ii +1)
            let ivl = q.intervals.byNote( q.notes.alpha[ ((ii *3) -ii) %7 ] )
            obj[inv] = ivl
            obj[inv].note =  q.notes.calc( note, ivl )
            obj[inv].octave = octave
            obj[inv].semis = ivl.semis +(octave *12)
          }
          rootobj = obj
        }
        else { //rootob !=== null
          for(let ii = 0; ii < maxinversions; ii++){
            let inv = String( ii +1 )
            let offset = (ii +2  +(cnt-2) <= maxinversions ?ii +2 +(cnt-2) : ii +2 +(cnt-2) -maxinversions)
            let rinv = String( offset )
            offset = ii +2 +(cnt-2) -maxinversions  //clunky but works
            obj[inv] = {}
            obj[inv].name =  rootobj[rinv].name
            obj[inv].abr =  rootobj[rinv].abr
            obj[inv].note =  rootobj[rinv].note
            obj[inv].octave = (offset < 1 ?rootobj[rinv].octave :rootobj[rinv].octave +1)
            obj[inv].semis = q.semis.calc(obj[inv].note, obj[inv].octave )
            // console.log(cnt, ii, rinv, offset, '\nobj:', obj, '\nrobj:', rootobj[rinv] )
          }
        }
      }
      //
      return result
    },
    inversionNotes( invrObj, invrPos ){ //return note objects for all fretboard locations of given inversion

      function local_invrToNobj( invr, strgn, parent = null, rootfret = null ){
        let nobj = null
        let strg = q.fretboard.strg( strgn )
        let note = invr.note
        let fret = ( q.intervals.byNote( note ).semis  -q.intervals.byNote( strg.note ).semis )
        if(fret < 0) fret += 12
        
        if(rootfret != null) fret = rootfret +12  //for root position: find multiple notes on string
        
        while( fret <= q.fretboard.fretMax ){
          //  console.log('fret'+fret+':', {strg:strg.note, invr:note, fret:fret} )
          if(fret <= q.fretboard.fretMax){
            nobj = q.notes.obj( strg.num, fret, note )
            // console.log('  search:', {iOctave:invr.octave, nOctave:nobj.octave, nobjFret:nobj.fret, parentFret:parentFret })
            if( parent === null || (nobj.fret >= parent.fret-3 && nobj.fret <= parent.fret+3 ))  //verify proximity of frets
            //don't verify octaves, leave it for the user to inspect
            // && ( [0,1].indexOf(invr.octave) >= 0 || nobj.octave === invr.octave ))  //octave == 0||1 means note selected from QueryPnl.selNote
              break;
            else{   //keep searching string
              fret += 12
              nobj = null
            }
          }
        }
        return nobj
      }

      let chord = invrObj.root +'Maj'
      let maxInversions = invrObj.max 
      let inversions = invrObj.positions[invrPos]

      let tmp = []  //temporary store for notes found
      let list = []     //returned with all notes found
      for(let strgn = 6; strgn >= maxInversions; strgn--){   //because of inversion logic, rootnote can never be on upper strings

        let rootfret = null
        while( rootfret === null || rootfret < q.fretboard.fretMax){  //allow searching for root note multiple times
          //calc fret position of root note
          let invr = inversions[1]
          let nobj = local_invrToNobj( invr, strgn, null, rootfret )
          if(nobj === null) break
          tmp[0] = nobj
          tmp[0].invr = {chord:chord, inversion:invrPos, abr:invr.abr, num:1}
          rootfret = nobj.fret    //

          //calc note 2
          let parent = nobj
          invr = inversions[2]
          nobj = local_invrToNobj( invr, strgn -1, parent, null )
          if(nobj === null) continue
          tmp[1] = nobj
          tmp[1].invr = {chord:chord, inversion:invrPos, abr:invr.abr, num:2}

          //calc note 3
          parent = nobj
          invr = inversions[3]
          nobj = local_invrToNobj( invr, strgn -2, parent, null)
          if(nobj === null) continue
          tmp[2] = nobj
          tmp[2].invr = {chord:chord, inversion:invrPos, abr:invr.abr, num:3}

          tmp.forEach( nobj => list.push( nobj ) )
          //add code to allow each string to be searched again
          // if(tmp[0].fret < q.fretboard.fretMax )
        }
      }
      if(list.length === 0) return null
      return list
    }

  },

  fretboard: {
    strings: [
      {num:1, note:'E', octave:4, semis:0, tabLetter:'e' },
      {num:2, note:'B', octave:3, semis:0, tabLetter:'B' },
      {num:3, note:'G', octave:3, semis:0, tabLetter:'G' },
      {num:4, note:'D', octave:3, semis:0, tabLetter:'D' },
      {num:5, note:'A', octave:2, semis:0, tabLetter:'A' },
      {num:6, note:'E', octave:2, semis:0, tabLetter:'E' }
    ],

    fretMin:1,
    fretMax:14,
    fretMinSet( nn ){   //not used as yet
      q.fretboard.fretMin = nn
      q.fretboard.init()
    },
    fretMaxSet( nn ){   //not used as yet
      q.fretboard.fretMax = nn
      q.fretboard.init()
    },

    init(){
      for(let ii = 0; ii <= q.fretboard.strings.length -1; ii++){
        let strg = q.fretboard.strings[ii]
        q.fretboard.strings[ii].semis = q.semis.calc(strg.note, strg.octave)
      }
    },
    strg( strgN ){  
      return Object.assign({}, q.fretboard.strings[ strgN -1 ])
    },
    fretInRange(nobj, root, num = 3){
      //assume: root is a notes.obj()
      let max = (num <= 5 ?5 :num)
      if((root.fret <= 1 && nobj.fret <= max)
      || (root.fret > 1 && nobj.fret >= (root.fret -num)
         && nobj.fret <= (root.fret +num)) )
        return true
      return null
    },
    obj( strg, fret ){
      if( typeof strg === 'number')
        strg = q.fretboard.strg( strg )
      let semis = strg.semis +Number(fret)
      return {
        fret:fret, 
        // strg:Object.assign( {}, strg ), 
        strgnum:strg.num, 
        tab:(strg.tabLetter +fret),
        semis: semis,
        notes: q.notes.bySemis(semis)
      }
    },
    objBySemis( semis ){
      let fret = null,
        fretMax = q.fretboard.fretMax
      for(let strg of q.fretboard.strings){
        if(semis >= strg.semis && semis <= (strg.semis +fretMax)){
          fret = ( semis -strg.semis )
          return q.fretboard.obj( strg, fret )
        }
      }
      return null
    },
    objByTab( tab ){
      let ltr = tab.substr(0,1),
        fret = Number(tab.substr(1))
      for( let strg of q.fretboard.strings ){
        if(strg.tabLetter === ltr){
          return q.fretboard.obj( strg, fret )
        }
      }
      return null
    },
    tabByFret( strN, fret ){  // return example: 'e12'
      strN = Number( strN )
      for( let strg of q.fretboard.strings ){
        if(strg.num === strN){
          return ( strg.tabLetter +fret )
        }
      }
      return null
    },
  },

  intervals:{
    list:[
      //rules:
      // 1. order by semitones
      // 2. prefer perfect, major, minor first
      // 3. prefer minor over diminished
      // 4. prefer augmented last
      // 5. removed (♭♭, TT) because added complexity not relevant to most uses
      // 
      {name:'Perfect unison', abr:'P1',  semis:0, note:'C' },
      //{name:'Diminished second', abr:'d2', semis:0, note:'D♭♭' },
      
      {name:'Minor second', abr:'m2', semis:1, note:'D♭' },
      {name:'Augmented unison', abr:'A1', semis:1, note:'C#' },
      
      {name:'Major second', abr:'M2', semis:2, note:'D' },
      // {name:'Diminished third', abr:'d3', semis:2, note:'E♭♭' },
      
      {name:'Minor third', abr:'m3', semis:3, note:'E♭' },
      {name:'Augmented second', abr:'A2', semis:3, note:'D#' },
      
      {name:'Major third', abr:'M3', semis:4, note:'E' },
      {name:'Diminished fourth', abr:'d4', semis:4, note:'F♭' },

      {name:'Perfect fourth', abr:'P4', semis:5, note:'F'},
      {name:'Augmented third', abr:'A3', semis:5, note:'E#'},
      
      {name:'Diminished fifth', abr:'d5', semis:6, note:'G♭' },
      {name:'Augmented fourth', abr:'A4', semis:6, note:'F#' },
      // {name:'Tritone', abr:'TT', semis:6, note:'TT' },
      
      {name:'Perfect fifth', abr:'P5', semis:7, note:'G' },
      // {name:'Diminished sixth', abr:'d6', semis:7, note:'A♭♭' },
      
      {name:'Minor sixth', abr:'m6', semis:8, note:'A♭' },
      {name:'Augmented fifth', abr:'A5', semis:8, note:'G#' },
      
      {name:'Major sixth', abr:'M6', semis:9, note:'A' },
      // {name:'Diminished seventh', abr:'d7', semis:9, note:'B♭♭' },
      
      {name:'Minor seventh', abr:'m7', semis:10, note:'B♭' },
      {name:'Augmented sixth', abr:'A6', semis:10, note:'A#' },
      
      {name:'Major seventh', abr:'M7', semis:11, note:'B' },
      {name:'Diminished octave', abr:'d8', semis:11, note:'C♭' },
      
      {name:'Perfect octave', abr:'P8', semis:12, note:'C' },
      {name:'Augmented seventh', abr:'A7', semis:12, note:'B#' },
    ],
  
    byNote( note ){
      note = note.toUpperCase()
      for(let ivl of q.intervals.list){
        if(ivl.note === note)
          return Object.assign({}, ivl)
      }
      return null
    },
    byName( nm ){
      let note = nm.toUpperCase()
      for(let ivl of q.intervals.list){
        if(ivl.abr === nm || ivl.note === note || ivl.name === nm)
          return Object.assign({}, ivl)
      }
      return null
    },
    bySemis( semis, returnFirst = false ){   //return intervals where semis match
      semis = semis % 12
      let list = []
      for(let ivl of q.intervals.list){
        if(ivl.semis > semis) break    //shortcircuit, intervals ordered by semis
        if(ivl.semis === semis){
          let obj = Object.assign({}, ivl)
          if(returnFirst === true) return obj
          list.push( obj )
        }
      }
      return list
    }
  },

  notes:{
    list:['C','C#','D♭','D','D#','E♭','E','F','F#','G♭','G','G#','A♭','A','A#','B♭','B'],
    alpha:['C','D','E','F','G','A','B'],

    bySemis( semis, returnFirst = false ){
      let list = []
      semis = Number(semis) % 12
      for(let ivl of q.intervals.list ){
        if(ivl.semis === semis){
          if(returnFirst === true) return ivl.note
          list.push( ivl.note )
        }
        if(ivl.semis > semis) break //intervals ordered by semis
      }
      return list
    },
    calc( root, ivlOrName, preferFlats = false){  //iterate by semitones to get new note with correct #/b
      // assume: preferFlats === true: return only flats

      // to handle ##/bb:
      // 1. pre-loop: resolve to standard note, get new root interval, proceed as normal: C## => D
      // 2. post loop(???): if ivl requires ##/bb, manually resolve based on new note: D => C##

      if(typeof root === 'object') root = root.note
      let rprefix = root.substr(0,1)
      let rsuffix = root.substr(1,2)
      // console.log('root='+root, 'rprefix='+rprefix, 'rsuffix='+rsuffix)

      let ivl = (typeof ivlOrName === 'object' ?ivlOrName : q.intervals.byName(ivlOrName))
      let iprefix = ivl.abr.substr(0,1)    // A as in A1
      // console.log('ivl.abr='+ivl.abr, 'iprefix='+iprefix )

      // test: display matching intervals
      // let rivl = q.intervals.byName( root )
      // let list = q.intervals.bySemis( rivl.semis +ivl.semis )
      // console.log( 'ivl.semis='+ivl.semis, '\nlist=', list  )

      //assume: no ## or bb used
      let max = ivl.semis, idx = 0    //idx = q.notes.alpha.indexOf( ltr ) ::: test
      let newlet = rprefix, newsfx = rsuffix
      function local_inc( ltr ){
        idx = q.notes.alpha.indexOf( ltr ) // this can probably be refactored out: notes.alpha[idx % 7] always === newlet; lookup not required
        idx++
        return q.notes.alpha[ idx % 7]
      }
      for(let ii = 0; ii < max; ii++){
        // console.log('root='+root, 'newlet='+newlet+newsfx)
        if(newlet === 'B' && newsfx === ''){ 
          newlet = 'C'; 
        }else
        if(newlet === 'E' && newsfx === ''){ 
           newlet = 'F'; 
        }else
        if(newsfx === '♭'){
          newsfx = ''
        }else
        if(newsfx === '#'){
          newsfx = ''
          newlet = local_inc( newlet )
        } 
        else  //newsfx === ''
        if(iprefix === 'm' || iprefix === 'd'  || preferFlats === true){
          newsfx = '♭'
          newlet = local_inc( newlet )
        }
        else
          newsfx = '#'
      }
      // console.log('root='+root, 'newlet='+newlet+newsfx)
      return newlet+newsfx
    },

    find( strgN, note ){ //return null or list of note objects on string
      let result = []
      let strg = q.fretboard.strg( strgN )
      let max = strg.semis +q.fretboard.fretMax
      let semis = strg.semis
      while(semis <= max){
        let notes = q.notes.bySemis( semis )
        if(notes.indexOf( note) >= 0){
          let nobj = q.notes.obj(strg, semis -strg.semis, note)
          result.push( nobj )
          semis += 12
        }
        else
          ++semis
      }

      if(result.length === 0) return null
      return result
    },
    obj( strg, fret, note = null  ){
      // console.log(111, fret, strg.num)
      if(typeof strg === 'number')
        strg = q.fretboard.strg( strg )
      if(fret < 0) return null
      let semis = strg.semis +fret
      if(semis > (strg.semis +q.fretboard.fretMax)) return null

      let octave = q.octave(semis),
          list = q.notes.bySemis( semis )
      return {
        fret: fret,
        note: (note === null ?list[0] :note),
        notes: list,
        octave: octave,
        semis: semis,
        // strg: strg, 
        strgnum: strg.num, 
        tab: strg.tabLetter +fret
      }
    },
    objByNote( note /*, octave = 0 */ ){
      let ivl = q.intervals.byNote( note ),
          semis = ivl.semis /* +(octave * 12) */,
          list = q.notes.bySemis( semis )
          //, fobj = q.fretboard.objBySemis( semis )
      return {
        fret: null, // fobj.fret,    //null because input is not specific to a fret
        note:note,
        notes:list,
        octave:null,  //octave,
        semis:semis,
        // strg: null, // fobj.strg,
        strgnum: null, // fobj.strg.num,
        tab: null // fobj.tab,
      }
    },
    objByTab( tab ){
      let fobj = q.fretboard.objByTab( tab )
      return q.notes.obj( fobj.strg, fobj.fret )
    },

    match( ivls, nobjList ){    //return true/false if notes in nobjList contained within ivls
      //used to match scales and chords to user selected frets
      //assume: ivls is a list of intervals.list[n]
      //assume: nobjList is a list of notes.obj()
      //assume: no duplicate items allowed
      //assume: ivls.length > nobjList.length 
      //assume: there may be ivls[n] between matched items: c,e matches c,d,e
      //assume: matches may occur across head/tail boundaries: e,c matches c,d,e
      //generally this is a pattern matching algorithm between two lists
      if(nobjList.length > ivls.length) return false

      let list = nobjList.slice()   //to support rotating list
      let fnd, nidx

      //break on first match of all items in nobjList
      for(let comparisons = 1; comparisons <= list.length; comparisons++){ //max comparisons = original pattern +(list.length -1) rotations 

        fnd = false; nidx = 0    //reset search params
        for(let iidx = 0; iidx < ivls.length; iidx++){    //iterate ivls
          if(list[nidx].notes.indexOf( ivls[iidx].note ) >= 0){ //increment when list item found; allows for gaps in range
            if(++nidx === list.length){   //point to next list item
              // console.log( 'found:', comparisons, list, ivls )
              fnd = true; break   
            } 
          }
        }

        if(fnd === true) break
        list.push( list.splice(0,1)[0] ) //rotate list by moving head to tail
      }

      return fnd
    },

    toAbc( nobj, noteLength = 8 ){
      let result = ''
      
      let acc = nobj.note.substr(1)
      if(acc === '#') result = '^'
      else
      if(acc === '♭') result = '_'
      else
      if(acc === '##') result = '^^'
      else
      if(acc === '♭♭') result = '__'

      result += nobj.note.substr(0,1)
       
      if(nobj.octave === 1) result += ',,'
      else
      if(nobj.octave === 2) result += ','
      else
      //if(nobj.octave === 3) result = result
      //else
      if(nobj.octave === 4) result += "'"
      else
      if(nobj.octave === 5) result += "''"
      else
      if(nobj.octave === 6) result += "''"
      else
      if(nobj.octave === 7) result += "'''"

      return result +noteLength
    }
  },

  octave( semis ){
    return Math.floor( semis / 12 )
  },

  scales:{
    list:[
      // tested with: https://www.omnicalculator.com/other/music-scale
      //            https://www.scales-chords.com/scalenav.php
      // rules:
      //   keep accidentals of the same type -- all flat or sharp
      { name:'Major', abr:'M', short:'Major',
        // list:[ 'C', 'D', 'E', 'F', 'G', 'A', 'B'],
        intervals:['P1','M2','M3','P4','P5','M6','M7']
      },
      { name:'Natural minor', abr:'m', short:'Minor', 
        // list:[ 'C', 'D', 'D#', 'F', 'G', 'A', 'A#'],
        intervals:['P1','M2','m3','P4','P5','m6','m7']
      },
      { name:'Pentatonic major', abr:'P', short:'Pen.Maj', 
        // list:[ 'C', 'D', 'E', 'G', 'A'],
        intervals:['P1','M2','M3','P5','M6']
      },
      { name:'Pentatonic minor', abr:'p', short:'Pen.min',
        // list:[ 'C', 'D#', 'F', 'G', 'A#'],
        intervals:['P1','m3','P4','P5','m7']
      },
      { name:'Blues heptatonic', abr:'B7', short:'Blues7',
        intervals:['P1','M2','m3','P4','d5','M6','m7']
      },
      { name:'Blues hexatonic', abr:'B6', short:'Blues6',
        // 1, ♭3, 4, ♭5, 5, ♭7
        intervals:['P1','m3','P4','d5','P5','m7']
      },
      { name:'Akebono I', abr:'Ak1', short:'Akebono1',
        intervals:['P1','M2','m3','P5','M6']   // https://ianring.com/musictheory/scales/653 {0,2,3,7,9}
      },
      { name:'Akebono II', abr:'Ak2', short:'Akebono2',
        intervals:['P1','m2','M3','P5','m6']
        // https://pianoencyclopedia.com/scales/akebono-ii/C-akebono-ii.html:  C, bD, E, G, bA 
        // also: https://ianring.com/musictheory/scales/419
        // also: https://www.flutopedia.com/csc_5tone_12tet.htm
      },
      // { name:'Chromatic', abr:'Ch', short:'Chromatic',
      //   intervals:['P1','m2','M2','m3','M3','P4','d5','P5','m6','M6','m7','M7']
      // },
      { name:'Double harmonic', abr:'DH', short:'Dbl.Hrm',
        // minor second, major third, perfect fourth and fifth, minor sixth, major seventh -- https://en.wikipedia.org/wiki/Double_harmonic_scale
        intervals:['P1','m2','M3','P4','P5','m6','M7']
      },
      { name:'Gypsy minor', abr:'Gm', short:'Gypsy',
        // step pattern is W, H, +, H, H, +, H -- https://en.wikipedia.org/wiki/Hungarian_minor_scale
        intervals:['P1','M2','m3','d5','P5','m6','M7']
      },
      { name:'Hungarian major', abr:'HM', short:'Hungarian',
        // semitones: 3, 1, 2, 1, 2, 1, 2 -- https://en.wikipedia.org/wiki/Hungarian_major_scale
        intervals:['P1','m3','M3','d5','P5','M6','m7']
      },
      { name:'Phrygian dominant', abr:'Pd', short:'Phrygian',
        //1 – ♭2 – 3 – 4 – 5 – ♭6 – ♭7 – 1  https://en.wikipedia.org/wiki/Phrygian_dominant_scale
        intervals:['P1','m2','M3','P4','P5','m6','m7']
      },
      { name:'Pygmy', abr:'Py', short:'Pygmy',
        intervals:['P1','M2','m3','P5','m7']
        // https://ianring.com/musictheory/scales/397  {0,2,3,7,8}
        // also: https://alchetron.com/Pygmy-music#Pygmy-scale
      }
    ],
    byName( scaleName ){
      for(let scale of q.scales.list){
        if(scale.name === scaleName || scale.short === scaleName || scale.abr === scaleName)
          return Object.assign({}, scale)
      }
      return null
    },
    obj( root, scaleName ){  //return scale, root and scale intervals
      let ivls = []

      if(typeof root === 'string')        //else interval object
        root = q.intervals.byName( root )
      if(root === null) return null

      let scale = q.scales.byName( scaleName )
      if(scale === null) return null

      let preferFlats = ( scaleName.indexOf('minor') >= 0 || root.note.indexOf('♭') >= 0 )

      for(let ivlAbr of scale.intervals){   //generate intervals for scale built on root
        let ivl = q.intervals.byName( ivlAbr )
        let note = q.notes.calc( root, ivl, preferFlats )
        ivl = Object.assign( {}, ivl, {
          abr: ivlAbr,    //abbreviation may differ from one assigned to scale
          note:note,
        })
        ivls.push( ivl )
      }

      let obj = Object.assign( {}, scale, {
        type:'scale',
        fullName: root.note +' '+scale.name,
        shortName: root.note +' '+scale.short,
        abbrevName: root.note +scale.abr,
        root: Object.assign({}, root),
        ivls: ivls 
      })
      return obj
    }
  },

  semis:{
    calc(note, octaveNum){   //return number of semitones
        //assume: ocatveNum range: 0 to infinity
        //assume: Middle C (C4) == (C,4) == (48 +0) == 48
        //assume:            C0 == (C,0) == ( 0 +0) ==  0
        //assume: A440     (A4) == (A,4) == (48 +9) == 57
        let semis = (octaveNum *12)
        semis += q.intervals.byName( note ).semis
        return semis
    },
  },
}


q.fretboard.init()
export default q