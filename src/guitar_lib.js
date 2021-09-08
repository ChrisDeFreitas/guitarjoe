/*
  //♭ &flat; alt+?
  
  GuitarJoe app's guitar theory logic
  by Chris DeFreitas, chrisd@europa.com
  
   Note:
    - "letter" refers to what we usually call a note, ie C#
    - note is an object, requires refactoring for consistency: { letter:'C#', semis:49, ... }
    - note.semis is unique
    - ivl is an interval object
    - assume: exception handling performed by caller

  todo:
    - refactor for code consistency
    - refactor to create a standard note object
    - fix q.chords.make() (when code needed)
    - (when needed) update letterCalc() for ##/bb -- see comments in function
  
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
    // todo: fix
    // make( letter, chordAbbrev, octaveNum ){
    //   let chord = q.chords.byName( chordAbbrev )
    //   let semis = []
    //   for(let stepnum = 0; stepnum < chord.semis.length; stepnum++){
    //     let step = chord.semis[stepnum]
    //     semis.push( q.semisCalc( step, octaveNum) )
    //   }
    //   return {
    //     letter: letter.toUpperCase(),
    //     octaveNum: octaveNum,
    //     name:chord.name, abr:chord.abr, 
    //     semis: semis
    //   }
    //},
    // toNotes( root, chord ){  //return scale notes based on root; todo: refactor for efficiency
    toObj( root, chordName ){  //return chord with notes based on root
      let ivls = [],
        chord = q.chords.byName( chordName )
      if(chord === null) return null

      if(typeof root === 'string')
        root = q.intervals.byName( root )   //object returned to caller
      if(root === null) return null

      let preferFlats = ( 
          chord.name.indexOf('Minor') >= 0  
        ||chord.name.indexOf('Diminished') >= 0 
        || root.letter.indexOf('♭') >= 0)
      for(let iname of chord.intervals){
        let ivl = q.intervals.byName( iname )
        let letter = q.letterCalc( root, ivl, preferFlats )
        ivls.push( Object.assign({}, ivl, { letter:letter } ))
      }

      let obj = Object.assign({}, chord, {
        type:'chord',
        fullName: root.letter +' '+chord.name,
        fullAbbrev: root.letter +chord.abr,
        root: Object.assign({}, root),
        ivls:ivls
       })

      return obj
    }
  },

  fretboard: {
    strings: [
      {num:1, letter:'E', octave:4, semis:0, tabLetter:'e' },
      {num:2, letter:'B', octave:3, semis:0, tabLetter:'B' },
      {num:3, letter:'G', octave:3, semis:0, tabLetter:'G' },
      {num:4, letter:'D', octave:3, semis:0, tabLetter:'D' },
      {num:5, letter:'A', octave:2, semis:0, tabLetter:'A' },
      {num:6, letter:'E', octave:2, semis:0, tabLetter:'E' }
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
        q.fretboard.strings[ii].semis = q.semisCalc(strg.letter, strg.octave)
      }
    },
    strg( strgN ){  
      return Object.assign({}, q.fretboard.strings[ strgN -1 ])
    },
    fretInRange(note, root){
      if((root.fretN <= 1 && note.fretN <= 5)
      || (root.fretN > 1 && note.fretN >= (root.fretN -3)  &&  note.fretN <= (root.fretN +3) ))
        return true
      return null
    },
    fretBySemis( semis ){   // returns fretObject: {fretN, strg, tab}
      let fretN = null,
        fretMax = q.fretboard.fretMax
      for(let strg of q.fretboard.strings){
        if(semis >= strg.semis && semis <= (strg.semis +fretMax)){
          fretN = ( semis -strg.semis )
          return { fretN: fretN, strg:Object.assign( {}, strg ), tab:(strg.tabLetter +fretN) }
        }
      }
      return null
    },
    fretByTab( tab ){   // returns fretObject: {fretN, strg, tab}
      let ltr = tab.substr(0,1),
        fretN = Number(tab.substr(1))
      for( let strg of q.fretboard.strings ){
        if(strg.tabLetter === ltr){
          return { fretN:fretN, strg:Object.assign({}, strg), tab:(strg.tabLetter +fretN) }
        }
      }
      return null
    },
    tabByFret( strN, fretN ){  // return example: 'e12'
      strN = Number( strN )
      for( let strg of q.fretboard.strings ){
        if(strg.num === strN){
          return ( strg.tabLetter +fretN )
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
      // 5. removed (♭♭, TT, P8) because added complexity not relevant to most uses
      // 
      {name:'Perfect unison', abr:'P1',  semis:0, letter:'C' },
      //{name:'Diminished second', abr:'d2', semis:0, letter:'D♭♭' },
      
      {name:'Minor second', abr:'m2', semis:1, letter:'D♭' },
      {name:'Augmented unison', abr:'A1', semis:1, letter:'C#' },
      
      {name:'Major second', abr:'M2', semis:2, letter:'D' },
      // {name:'Diminished third', abr:'d3', semis:2, letter:'E♭♭' },
      
      {name:'Minor third', abr:'m3', semis:3, letter:'E♭' },
      {name:'Augmented second', abr:'A2', semis:3, letter:'D#' },
      
      {name:'Major third', abr:'M3', semis:4, letter:'E' },
      {name:'Diminished fourth', abr:'d4', semis:4, letter:'F♭' },

      {name:'Perfect fourth', abr:'P4', semis:5, letter:'F'},
      {name:'Augmented third', abr:'A3', semis:5, letter:'E#'},
      
      {name:'Diminished fifth', abr:'d5', semis:6, letter:'G♭' },
      {name:'Augmented fourth', abr:'A4', semis:6, letter:'F#' },
      // {name:'Tritone', abr:'TT', semis:6, letter:'TT' },
      
      {name:'Perfect fifth', abr:'P5', semis:7, letter:'G' },
      // {name:'Diminished sixth', abr:'d6', semis:7, letter:'A♭♭' },
      
      {name:'Minor sixth', abr:'m6', semis:8, letter:'A♭' },
      {name:'Augmented fifth', abr:'A5', semis:8, letter:'G#' },
      
      {name:'Major sixth', abr:'M6', semis:9, letter:'A' },
      // {name:'Diminished seventh', abr:'d7', semis:9, letter:'B♭♭' },
      
      {name:'Minor seventh', abr:'m7', semis:10, letter:'B♭' },
      {name:'Augmented sixth', abr:'A6', semis:10, letter:'A#' },
      
      {name:'Major seventh', abr:'M7', semis:11, letter:'B' },
      {name:'Diminished octave', abr:'d8', semis:11, letter:'C♭' },
      
      {name:'Perfect octave', abr:'P8', semis:12, letter:'C' },
      {name:'Augmented seventh', abr:'A7', semis:12, letter:'B#' },
    ],
  
    byLetter( letter ){
      letter = letter.toUpperCase()
      for(let ivl of q.intervals.list){
        if(ivl.letter === letter)
          return Object.assign({}, ivl)
      }
      return null
    },
    byName( nm ){
      let letter = nm.toUpperCase()
      for(let ivl of q.intervals.list){
        if(ivl.abr === nm || ivl.letter === letter || ivl.name === nm)
          return Object.assign({}, ivl)
      }
      return null
    },
    bySemis( semis ){   //return first interval where semis match
      semis = semis % 12
      for(let ivl of q.intervals.list){
        if(ivl.semis === semis)
          return Object.assign({}, ivl)
      }
      return null
    },
    allBySemis( semis ){   //return all intervals where semis
      let semis2 = semis % 12
      let list = []
      for(let ivl of q.intervals.list){
        if(ivl.semis === semis2)
          list.push( Object.assign({}, ivl) )
      }
      return list
    },
  },

  letters:['C','C#','D♭','D','D#','E♭','E','F','F#','G♭','G','G#','A♭','A','A#','B♭','B'],
  lttrs:['C','D','E','F','G','A','B'],
  lettersBySemis( semis ){
    let letters = []
    semis = semis % 12
    for(let ivl of q.intervals.list ){
      if(ivl.semis === semis){
        letters.push(ivl.letter)
      }
      if(ivl.semis > semis) break //intervals ordered by semis
    }
    return letters
  },
  letterCalc( root, ivlOrName, preferFlats = false){  //iterate by semitones to get new letter with correct #/b
    // assume: preferFlats === true: return only flats

    // to handle ##/bb:
    // 1. pre-loop: resolve to standard note, get new root interval, proceed as normal
    // 2. post loop(???): if ivl requires ##/bb, manually resolve based on new note: C => Dbb

    if(typeof root === 'object') root = root.letter
    let rprefix = root.substr(0,1)
    let rsuffix = root.substr(1,2)
    // console.log('root='+root, 'rprefix='+rprefix, 'rsuffix='+rsuffix)

    let ivl = (typeof ivlOrName === 'object' ?ivlOrName : q.intervals.byName(ivlOrName))
    let iprefix = ivl.abr.substr(0,1)    // A as in A1
    // console.log('ivl.abr='+ivl.abr, 'iprefix='+iprefix )

    // test: display matching intervals
    // let rivl = q.intervals.byName( root )
    // let list = q.intervals.allBySemis( rivl.semis +ivl.semis )
    // console.log( 'ivl.semis='+ivl.semis, '\nlist=', list  )

    //assume: no ## or bb used
    let max = ivl.semis, idx = 0    //idx = q.lttrs.indexOf( ltr ) ::: test
    let newlet = rprefix, newsfx = rsuffix
    function local_inc( ltr ){
      idx = q.lttrs.indexOf( ltr ) // this can probably be refactored out: lttrs[idx % 7] always === newlet; lookup not required
      idx++
      return q.lttrs[ idx % 7]
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
  noteByLetter( letter ){
    let ivl = q.intervals.byLetter( letter ),
        semis = ivl.semis,
        octave = q.octave(semis),
        letters = q.lettersBySemis(semis)
        //, fobj = q.fretboard.fretBySemis( semis )
    return {
      strg: null, // fobj.strg,    //should be null because input being not specific to a fret
      fretN: null, // fobj.fretN,
      tab: null, // fobj.tab,
      letter:letter,
      letters:letters,
      octave:octave,
      semis:semis,
      noteByLetter:true
    }
  },
  noteByFret( strN, fretN ){
    let strg = q.fretboard.strg( strN ),
        semis = strg.semis +fretN,
        octave = q.octave(semis),
        letters = q.lettersBySemis(semis)
    return {
      strg:strg, 
      fretN:(semis -strg.semis),
      tab: strg.tabLetter +fretN,
      letter:letters[0],
      letters:letters,
      octave:octave,
      semis:semis,
      noteByFret:true
    }
  },
  noteBySemis( semis ){
    let fobj = q.fretboard.fretBySemis( semis )
    let letters = q.lettersBySemis(semis)
    return {
      strg: fobj.strg, 
      fretN: fobj.fretN, 
      tab: fobj.strg.tabLetter +(semis -fobj.strg.semis),
      letter:letters[0], 
      letters:letters, 
      octave:q.octave(semis),
      semis:semis, 
      noteBySemis:true
    }
  },
  noteByTab( tab ){
    let fobj = q.fretboard.fretByTab( tab ),
      strg = fobj.strg,
      fretN = fobj.fret,
      semis = strg.semis +fretN,
      letters = q.lettersBySemis(semis)
    return {
      strg: strg, 
      fretN:fretN, 
      tab:tab,
      letter:letters[0], 
      letters:letters, 
      octave:q.octave(semis),
      semis:semis,
      noteByTab:true
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
      { name:'Natural minor', abr:'m', short:'Nat.min', 
        // list:[ 'C', 'D', 'D#', 'F', 'G', 'A', 'A#'],
        intervals:['P1','M2','m3','P4','P5','m6','m7']
      },
      { name:'Pentatonic major', abr:'P', short:'Pen.maj', 
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
      { name:'Chromatic', abr:'Ch', short:'Chrom',
        intervals:['P1','m2','M2','m3','M3','P4','d5','P5','m6','M6','m7','M7']
      },
      { name:'Double harmonic', abr:'DH', short:'Dbl.har',
        // minor second, major third, perfect fourth and fifth, minor sixth, major seventh -- https://en.wikipedia.org/wiki/Double_harmonic_scale
        intervals:['P1','m2','M3','P4','P5','m6','M7']
      },
      { name:'Gypsy minor', abr:'Gm', short:'Gypsy.min',
        // step pattern is W, H, +, H, H, +, H -- https://en.wikipedia.org/wiki/Hungarian_minor_scale
        intervals:['P1','M2','m3','d5','P5','m6','M7']
      },
      { name:'Hungarian major', abr:'HM', short:'Hung.maj`',
        // semitones: 3, 1, 2, 1, 2, 1, 2 -- https://en.wikipedia.org/wiki/Hungarian_major_scale
        intervals:['P1','m3','M3','d5','P5','M6','m7']
      },
      { name:'Phrygian dominant', abr:'Pd', short:'Phr.dom`',
        //1 – ♭2 – 3 – 4 – 5 – ♭6 – ♭7 – 1  https://en.wikipedia.org/wiki/Phrygian_dominant_scale
        intervals:['P1','m2','M3','P4','P5','m6','m7']
      }
    ],
    byName( scaleName ){
      for(let scale of q.scales.list){
        if(scale.name === scaleName || scale.short === scaleName || scale.abr === scaleName)
          return Object.assign({}, scale)
      }
      return null
    },
    toObj( root, scaleName ){  //return scale, root and scale intervals
      let ivls = []

      if(typeof root === 'string')        //else interval object
        root = q.intervals.byName( root )
      if(root === null) return null

      let scale = q.scales.byName( scaleName )
      if(scale === null) return null

      let preferFlats = ( scaleName.indexOf('minor') >= 0 || root.letter.indexOf('♭') >= 0 )

      for(let ivlAbr of scale.intervals){   //generate intervals for scale built on root
        let ivl = q.intervals.byName( ivlAbr )
        let letter = q.letterCalc( root, ivl, preferFlats )
        ivl = Object.assign( {}, ivl, {
          abr: ivlAbr,    //abbreviation may differ from one assigned to scale
          letter:letter,
        })
        ivls.push( ivl )
      }

      let obj = Object.assign( {}, scale, {
        type:'scale',
        fullName: root.letter +' '+scale.name,
        shortName: root.letter +' '+scale.short,
        abbrevName: root.letter +scale.abr,
        root: Object.assign({}, root),
        ivls: ivls 
      })
      return obj
    }
  },

  semis( nm ){    //return ivl object
    return q.intervals.byName( nm )
  },
  semisCalc(note, octaveNum){   //return number of semitones
      //assume: ocatveNum range: 0 to infinity
      //assume: Middle C (C4) == (C,4) == (48 +0) == 48
      //assume:            C0 == (C,0) == ( 0 +0) ==  0
      //assume: A440     (A4) == (A,4) == (48 +9) == 57
      let semis = (octaveNum *12)
      semis += q.intervals.byName( note ).semis
      return semis
  },
}


q.fretboard.init()
export default q