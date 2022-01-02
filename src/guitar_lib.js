/*
  ♭ &flat; alt+?

  GuitarJoe's guitar theory logic
  by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  
   Note:
    - all objects returned are newly constructed, so they may by modified by the caller
    - note refers to what we usually call a note: C#
    - note object, nobj: { strgnum:int, fret:int, note:'C#', semis:49, ... }
    - note.semis is unique: number of semitones, Middle C = 48
    - fret is an integer
    - fret object, fobj: { strg:{}, fret:int, tab:'e12' }
    - ivl is an interval object: intervals.list[n]
    - ivls is a list of interval objects
    - chord is an object: chords.list[n]
    - assume: exception handling performed by caller

  Todo:
    - (when needed) update notes.calc() for ##/bb -- see comments in function
*/
var q = {

  chords: {
    list:[   //verified against: https://www.omnicalculator.com/other/chord
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
          return { ...chord }
      }
      return null
    },
    findByIvls( ivls ){    //find a chord by matching interval.abr
      // return null or one of q.chords.list[]
      for( let chord of q.chords.list ){
        if(chord.intervals.length !== ivls.length) 
          continue

        let fnd = true
        for( let ii = 0; ii < chord.intervals.length; ii++ ){
           if(ivls[ii].abr !== chord.intervals[ii]){
             fnd = false
             break
           }
        }
        if( fnd === true )    // all ivls match
          return { ...chord }
      }
      return null
    },
    inversions( note, chordName, octave = 0 ){   // return an inversion object for given note and scale
      let robj = null
      if( typeof note === 'object' ){
        robj = note
        note = robj.note
      }else{
        note = note.toUpperCase()
        robj = q.notes.byNote( note )
      }
      if(octave === null) octave = 0
      robj.octave = Number(octave)
      let cobj = null
      if( typeof chordName === 'object' ){
        cobj = chordName
        chordName = cobj.abr
      }else
        cobj = q.chords.obj(note, chordName)

      let maxinversions = cobj.ivls.length
      let result = { root:robj.note, chord:chordName, octave:octave, max:maxinversions, positions:[] }
      let rivls = cobj.ivls
      let positions = ['Root','First','Second','Third','Fourth','Fifth']

      rivls[0].octave = robj.octave   // set correct octaves
      let s0 = q.intervals.byNote( rivls[0].note ).semis     
      for( let idx = 1; idx < maxinversions; idx++ ){
        let s1 = q.intervals.byNote( rivls[idx].note ).semis
        rivls[idx].octave = (s0 < s1 ?robj.octave :robj.octave +1)
      }
     
      for( let cnt = 1; cnt <= maxinversions; cnt++){
        let pos = positions[ cnt -1 ]
        let obj = result.positions[ pos ] = []

        for( let idx = 1; idx <= maxinversions; idx++ ){
          let inc = 0
          let ridx = idx +(cnt -2) 
          if(ridx >= maxinversions) {
            ridx -= maxinversions
            inc = 1
          }
          let ioctave = ( rivls[ ridx ].octave +inc )
                    
          obj[idx] ={ 
            num: (ridx +1),
            note: rivls[ ridx ].note,
            octave: ioctave,
            interval: null,
            abr:null,
            semis: q.semis.calc( rivls[ ridx ].note, ioctave ),
            // chordNote: rivls[ ridx ],
          }
          let isemis = (idx === 1 ?0 : obj[idx].semis -obj[1].semis)
          let iobj = q.intervals.bySemis(isemis, true)
          obj[idx].interval = (isemis === 0 ?'Root' :iobj.name )
          obj[idx].abr = iobj.abr
          // console.log( obj[idx] )
        }
      }

      return result
    },
    inversionLog( invrObj, includeSemis = false ){    // write to console
      let caption = invrObj.root +invrObj.octave +' ' +invrObj.chord +' inversions:\n'
      let data = ''
      for( let pos in invrObj.positions){
        data += ' ' +pos +': '
        for( let obj of invrObj.positions[pos] ){
          if(obj === undefined) continue    //positions[pos][0] === null
          data += obj.interval +' - ' +obj.note +obj.octave
                + ( includeSemis === false ?' ' :'(' +obj.semis +') ' )
        }
        data += '\n'       
      }
      console.log( caption, data)
    },
    inversionNotes( invrObj, invrPos ){ //return note objects for inversion
      //assume: inversion root is always the bass note 
      //assume: notes returned must be on continguous strings
      //assume: notes must exist within a range of frets from the bass note
      //note: only return notes when all notes of inversion found
      //note: some inversions will not have results because of these rules

      if( invrObj.positions[invrPos] === undefined )
        return null

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
              break;
            else{   //keep searching string
              fret += 12
              nobj = null
            }
          }
        }
        return nobj
      }

      let chord = invrObj.root +invrObj.chord
      let maxInversions = invrObj.max
      let inversions = invrObj.positions[invrPos]

      let tmp = []  //temporary store for notes found
      let list = []     //returned with all notes found
      for(let strgn = 6; strgn >= maxInversions; strgn--){   //because of inversion logic, root note can never be on upper strings

        let rootfret = null
        while( rootfret === null || rootfret < q.fretboard.fretMax){  //allow searching for root note multiple times
          //calc fret position of root note
          let invr = inversions[1]
          let nobj = local_invrToNobj( invr, strgn, null, rootfret )
          if(nobj === null) break
          tmp[0] = nobj
          tmp[0].invr = {chord:chord, inversion:invrPos, abr:invr.abr, num:1}
          rootfret = nobj.fret    //

          //calc note n
          let fnd = true
          for(let num = 2; num <= maxInversions; num++){
            let parent = nobj
            invr = inversions[ num ]
            nobj = local_invrToNobj( invr, strgn -(num -1), parent, null )
            if(nobj === null) {
              fnd = false
              break
            }
            tmp[ num -1 ] = nobj
            tmp[ num -1 ].invr = {chord:chord, inversion:invrPos, abr:invr.abr, num:num}
          }
          if(fnd === false) continue

          tmp.forEach( nobj => list.push( nobj ) )
        }
      }
      if(list.length === 0) return null
      return list
    },
    obj( root, chordName ){  //return chord object with notes based on root arg
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
        ivls.push({ ...ivl, note:note })
      }

      let obj = { 
        ...chord, 
        type:'chord',
        fullName: root.note +' '+chord.name,
        fullAbbrev: root.note +chord.abr,
        root: root,
        ivls:ivls
      }

      return obj
    },

    shapes: [   //define patterns for finding barre chords
      // https://www.guitarplayer.com/lessons/46-chord-shapes-you-must-know-the-ultimate-guide-to-chord-substitutions
      // https://www.libertyparkmusic.com/guitar-chord-shapes-beginner-to-advanced/
      // https://www.guitarhabits.com/what-is-the-caged-system-the-keys-to-the-fretboard/
      // https://appliedguitartheory.com/lessons/minor-caged-system/
      // https://www.cagedguitarsystem.net/caged-seventh-chords/
      //
      // a shape object defines the numerical relationship between the root note
      //   and notes on other strings
      //
      //rules:      
      //  strg: root note found on this string, this is a tab string letter
      //  cnt: number of frets consumed
      //  list[ string ] === null: string not played
      //  list[ string ] === integer: add to root fret number to obtain new fret on string
      //
      { name:'C Major', abr:'Cmaj', chordAbr:'maj', string:'A', cnt:4,
        strings:{ E:null, A:0, D:-1, G:-3, B:-2, e:-3 }
      },
      { name:'A Major', abr:'Amaj', chordAbr:'maj', string:'A', cnt:3,
        strings:{ E:null, A:0, D:2, G:2, B:2, e:0 }
      },
      { name:'G Major', abr:'Gmaj', chordAbr:'maj', string:'E', cnt:4,
        strings:{ E:0, A:-1, D:-3, G:-3, B:-3, e:0 }
      },
      { name:'E Major', abr:'Emaj', chordAbr:'maj', string:'E', cnt:3,
        strings:{ E:0, A:2, D:2, G:1, B:0, e:0 }
      },
      { name:'D Major', abr:'Dmaj', chordAbr:'maj', string:'D',  cnt:4,
        strings:{ E:null, A:null, D:0, G:2, B:3, e:2 }
      },
      //
      { name:'C Minor', abr:'Cmin', chordAbr:'min', string:'A', cnt:4,
        strings:{ E:null, A:0, D:-2, G:-3, B:-2, e:null }
      },
      { name:'A Minor', abr:'Amin', chordAbr:'min', string:'A', cnt:3,
        strings:{ E:null, A:0, D:2, G:2, B:1, e:0 }
      },
      { name:'G Minor', abr:'Gmin', chordAbr:'min', string:'E', cnt:4,
        strings:{ E:0, A:-2, D:-3, G:-3, B:0, e:0 }
      },
      { name:'E Minor', abr:'Emin', chordAbr:'min', string:'E', cnt:3,
        strings:{ E:0, A:2, D:2, G:0, B:0, e:0 }
      },
      { name:'D Minor', abr:'Dmin', chordAbr:'min', string:'D',  cnt:4,
        strings:{ E:null, A:null, D:0, G:2, B:3, e:1 }
      },
      //
      { name:'C Dominant seventh', abr:'C7', chordAbr:'7', string:'A', cnt:3,
        strings:{ E:null, A:0, D:-1, G:0, B:-2, e:null }
      },
      { name:'A Dominant seventh', abr:'A7', chordAbr:'7', string:'A', cnt:3,
        strings:{ E:null, A:0, D:2, G:0, B:2, e:0 }
      },
      { name:'G Dominant seventh', abr:'G7', chordAbr:'7', string:'E', cnt:4,
        strings:{ E:0, A:-1, D:-3, G:-3, B:-3, e:-2 }
      },
      { name:'E Dominant seventh', abr:'E7', chordAbr:'7', string:'E', cnt:3,
        strings:{ E:0, A:2, D:0, G:1, B:0, e:0 }
      },
      { name:'D Dominant seventh', abr:'D7', chordAbr:'7', string:'D',  cnt:4,
        strings:{ E:null, A:null, D:0, G:2, B:1, e:2 }
      } 
      /*/
      { name:'C Suspended fourth', abr:'Csus4', chordAbr:'sus4', string:'A', cnt:4,
        strings:{ E:null, A:0, D:0, G:-3, B:-2, e:-2 }
      },
      /*/
    ],
    shapeByName( name ){   // return barre chord object
      let bar = q.chords.shapes.find( obj => obj.abr === name || obj.name === name )
      return (bar === undefined ?null :{ ...bar} )
    },
    shapesByChord( chordAbr ){   // return list of barre chord objects
      let list = q.chords.shapes.filter( shape => shape.chordAbr === chordAbr )
      if(list.length === 0) return null

      for( let ii in list ){
        list[ii] = { ...list[ii] }
      }
      return list
    },
    shapeTabs( shape, note ){    //return object with name and tabs for note's barre chord
      if( typeof shape === 'string' )
        shape = q.chords.shapeByName( shape )
      if(typeof note === 'object')
        note = note.note
        
      //find root string, fret
      let roots = q.notes.find( shape.string, note )
      if( roots === null ) 
        return null
        
      //calculate notes on remaining strings
      let chord = q.chords.obj( note, shape.chordAbr )
      let min = q.fretboard.fretMin
      let max = q.fretboard.fretMax
      let filter = 'right'
      for( let strg in shape.strings){
        let fret = shape.strings[ strg ]
        if(fret != null && fret < 0){
          filter = 'left'
          break
        }
      }
      if(filter === 'left') min += (shape.cnt -1)  //frets start at 0 (nut)
      else max -= (shape.cnt -1)

      let result = []
      for( let root of roots){
        if(root.fret < min || root.fret > max ) continue
        
        let strings = { E:null, A:null, D:null, G:null, B:null, e:null }
        for( let ltr in strings){
          if( shape.strings[ltr] === null ){
            strings[ltr] = null
            continue
          }
          let tab = ltr +( root.fret +shape.strings[ltr] ) 
          let note = q.notes.byTab( tab )
          let ivl = chord.ivls.find( ivl => note.notes.indexOf( ivl.note ) >= 0 )
          
          strings[ltr] = { tab:tab, ...ivl }
        }
        
        result.push({
          chord:( root.note +' ' +chord.name ),
          abr:( root.note +chord.abr ),
          shape:( shape.abr +' shape' ),
          shapeAbr: shape.abr,
          root: root,
          type:'shapeTabs',
          strings:strings
        })      
      }

      return result
    },
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

    fretMin:0,  //0 = nut
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
      if( typeof strgN === 'number')
        return { ...q.fretboard.strings[ strgN -1 ] }
        
      //assume tab letter
      let result = q.fretboard.strings.find(
        strg => strg.tabLetter === strgN
      )
      return ( result === undefined ?null :{ ...result } )
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
    bySemis( semis ){
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
    byTab( tab ){
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
      {name:'Perfect unison', abr:'P1',  semis:0, degName:'Tonic', note:'C' },
      //{name:'Diminished second', abr:'d2', semis:0, note:'D♭♭' },
      
      {name:'Minor second', abr:'m2', semis:1, degName:'', note:'D♭' },
      {name:'Augmented unison', abr:'A1', semis:1, degName:'', note:'C#' },
      
      {name:'Major second', abr:'M2', semis:2, degName:'Supertonic', note:'D' },
      // {name:'Diminished third', abr:'d3', semis:2, note:'E♭♭' },
      
      {name:'Minor third', abr:'m3', semis:3, degName:'Mediant', note:'E♭' },
      {name:'Augmented second', abr:'A2', semis:3, degName:'Mediant', note:'D#' },
      
      {name:'Major third', abr:'M3', semis:4, degName:'Mediant', note:'E' },
      {name:'Diminished fourth', abr:'d4', semis:4, degName:'Mediant', note:'F♭' },

      {name:'Perfect fourth', abr:'P4', semis:5, degName:'Subdominant', note:'F'},
      {name:'Augmented third', abr:'A3', semis:5, degName:'Subdominant', note:'E#'},
      
      {name:'Diminished fifth', abr:'d5', semis:6, degName:'', note:'G♭' },
      {name:'Augmented fourth', abr:'A4', semis:6, degName:'', note:'F#' },
      // {name:'Tritone', abr:'TT', semis:6, note:'TT' },
      
      {name:'Perfect fifth', abr:'P5', semis:7, degName:'Dominant', note:'G' },
      // {name:'Diminished sixth', abr:'d6', semis:7, note:'A♭♭' },
      
      {name:'Minor sixth', abr:'m6', semis:8, degName:'Submediant', note:'A♭' },
      {name:'Augmented fifth', abr:'A5', semis:8, degName:'Submediant', note:'G#' },
      
      {name:'Major sixth', abr:'M6', semis:9, degName:'Submediant', note:'A' },
      // {name:'Diminished seventh', abr:'d7', semis:9, note:'B♭♭' },
      
      {name:'Minor seventh', abr:'m7', semis:10, degName:'Subtonic', note:'B♭' },
      {name:'Augmented sixth', abr:'A6', semis:10, degName:'Subtonic', note:'A#' },
      
      {name:'Major seventh', abr:'M7', semis:11, degName:'Leading tone', note:'B' },
      {name:'Diminished octave', abr:'d8', semis:11, degName:'Leading tone', note:'C♭' },
      
      {name:'Perfect octave', abr:'P8', semis:12, degName:'Octave', note:'C' },
      {name:'Augmented seventh', abr:'A7', semis:12, degName:'Octave', note:'B#' },
    ],
  
    byNote( note ){
      note = note.toUpperCase()
      for(let ivl of q.intervals.list){
        if(ivl.note === note)
          return { ...ivl }
      }
      return null
    },
    byName( nm ){
      let note = nm.toUpperCase()
      for(let ivl of q.intervals.list){
        if(ivl.abr === nm || ivl.note === note || ivl.name === nm)
          return { ...ivl }
      }
      return null
    },
    bySemis( semis, returnFirst = false ){   //return intervals where semis match
      semis = semis % 12
      let list = []
      for(let ivl of q.intervals.list){
        if(ivl.semis > semis) break    //shortcircuit, intervals ordered by semis
        if(ivl.semis === semis){
          let obj = { ...ivl }
          if(returnFirst === true) return obj
          list.push( obj )
        }
      }
      return list
    },
    findNote( ivls, nobj ){   //return null or ivl containing note
      if(typeof nobj === 'string')
        nobj = q.notes.byNote( nobj )
      
      let result = ivls.find( ivl => nobj.notes.indexOf( ivl.note ) >= 0 )

      if( typeof result !== 'object') return null
      return result
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

    find( strgN, note ){ // return null or list of note objects on string
      note = note.toUpperCase()
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
    byNote( note /*, octave = 0 */ ){   // return note object
      // assume note is a string
      let ivl = q.intervals.byNote( note ),
          semis = ivl.semis /* +(octave * 12) */,
          list = q.notes.bySemis( semis )
          //, fobj = q.fretboard.bySemis( semis )
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
    byTab( tab ){
      let fobj = q.fretboard.byTab( tab )
      return q.notes.obj( fobj.strgnum, fobj.fret )
    },

    match( ivls, nobjList ){    //return true/false if notes in nobjList contained within ivls
      //used to match scales and chords to user selected notes
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
    degreeTriads( root, scale ){    //build triads on all scale degrees
      // return: {type:'Scale Degree Triads', root:root, scale:scale, abr:sobj.abr, list:[]}
      let sobj = null
      if(typeof root === 'object') root = root.note
      if(typeof scale === 'object') sobj = scale
      else sobj = q.scales.obj(root, scale)
      if(sobj === null) return null

      let result = {type:'Scale Degree Triads', root:root, scale:scale, abr:sobj.abr, list:[]}
      const degrees = ['i','ii','iii','iv','v','vi','vii']

      for(let ii = 0; ii < sobj.ivls.length; ii++){    //iterate each scale degree
        let ivls = []
        let rootivl = null    //to calc correct semitones for interval

        for(let num = 0; num <= 2; num++ ){   //build triad
          let iidx = ii +((+2 * num) )
          if( iidx >= sobj.ivls.length ) iidx -= sobj.ivls.length
          
          let ivl = sobj.ivls[ iidx ]
          ivl = {
            num:    (num +1),
            abr:    null,
            note:   ivl.note, 
            semis0: ivl.semis, 
            semis:  ivl.semis
          } 
          if(rootivl === null){
            rootivl = ivl
            rootivl.semis = 0
          }
          else{
            ivl.semis -= rootivl.semis0
            if( ivl.semis < 0 ) ivl.semis += 12
          }
          ivl.abr = q.intervals.bySemis( ivl.semis, true ).abr
          ivls.push( ivl )
        }
      
        let deg = degrees[ii]
        let match = q.chords.findByIvls( ivls )
        if(match !== null){
          if( match.name.indexOf('Major') >= 0) deg = deg.toUpperCase()
          if( match.name.indexOf('Diminished') >= 0) deg += '°'
          if( match.name.indexOf('Augmented') >= 0) deg += '+'
        }

        let triad = {
          root:   sobj.ivls[ii].note,
          num:    (ii +1),
          degree: deg,
          degreeName: sobj.ivls[ii].degName,
          name:   (match !== null ?match.name :null),
          abr:    (match !== null ?match.abr :null),
          ivls:   ivls
        }
        result.list.push( triad )
        // console.log( triad )
      }
      return result
    },
    byName( scaleName ){
      for(let scale of q.scales.list){
        if(scale.name === scaleName || scale.short === scaleName || scale.abr === scaleName)
          return { ...scale }
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
        ivl = {
          ...ivl,
          abr: ivlAbr,    //abbreviation may differ from one assigned to scale
          note:note,
        }
        ivls.push( ivl )
      }

      let obj = { 
        ...scale, 
        type:'scale',
        fullName: root.note +' '+scale.name,
        shortName: root.note +' '+scale.short,
        abbrevName: root.note +scale.abr,
        root: root,
        ivls: ivls 
      }
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