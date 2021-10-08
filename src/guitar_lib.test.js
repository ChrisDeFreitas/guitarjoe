/*
  test guitar_lib.js functions
  - test suite used for initial concept development
  - not all library functions test here
*/
import q from "./guitar_lib.js";

q.fretboard.fretMaxSet( 14 )

describe.skip('test interval functions', () => {
  it("expect q.intervals.byName('m3').semis === 3 ", () => {
		let ivl = q.intervals.byName('m3')
    expect( ivl ).toBeTruthy()
    expect( ivl.semis ).toBe( 3 )
  })
  it("expect q.intervals.byNote('C').abr === 'P1' ", () => {
		let ivl = q.intervals.byNote('C')
    expect( ivl ).toBeTruthy()
    expect( ivl.abr ).toBe( 'P1' )
  })
  it("expect q.intervals.bySemis.calc('E', 4) === 52 ", () => {
		let semis = q.semis.calc('E', 4)
    expect( semis ).toBeTruthy()
    expect( semis ).toBe( 52 )
  })
})


describe.skip('test notes.calc()', () => {
  it("expect q.notes.calc('C', 'A1') === C#", () => {
		let letter = q.notes.calc('C', 'A1')
    expect( letter ).toBeTruthy()
    expect( letter ).toBe( 'C#' )
  })
  it("expect q.notes.calc('B', 'A1') === C", () => {
		let letter = q.notes.calc('B', 'A1')
    expect( letter ).toBeTruthy()
    expect( letter ).toBe( 'C' )
  })
  it("expect q.notes.calc('E', 'A1') === F", () => {
		let letter = q.notes.calc('E', 'A1')
    expect( letter ).toBeTruthy()
    expect( letter ).toBe( 'F' )
  })
  it("expect q.notes.calc('C#', 'A1') === D", () => {
		let letter = q.notes.calc('C#', 'A1')
    expect( letter ).toBeTruthy()
    expect( letter ).toBe( 'D' )
  })
  it("expect q.notes.calc('C♭', 'A1') === C", () => {
		let letter = q.notes.calc('C♭', 'A1')
    expect( letter ).toBeTruthy()
    expect( letter ).toBe( 'C' )
  })

  it("expect q.notes.calc('C', 'm2') === D♭", () => {
		let letter = q.notes.calc('C', 'm2')
    expect( letter ).toBeTruthy()
    expect( letter ).toBe( 'D♭' )
  })
  it("expect q.notes.calc('D#', 'm2') === E", () => {
		let letter = q.notes.calc('D#', 'm2')
    expect( letter ).toBeTruthy()
    expect( letter ).toBe( 'E' )
  })
  it("expect q.notes.calc('B', 'm2') === C", () => {
		let letter = q.notes.calc('B', 'm2')
    expect( letter ).toBeTruthy()
    expect( letter ).toBe( 'C' )
  })

  it("expect q.notes.calc('E', 'M2') === F#", () => {
		let letter = q.notes.calc('E', 'M2')
    expect( letter ).toBeTruthy()
    expect( letter ).toBe( 'F#' )
  })

  it("expect q.notes.calc('C', 'M3') === E", () => {
		let letter = q.notes.calc('C', 'M3')
    expect( letter ).toBeTruthy()
    expect( letter ).toBe( 'E' )
  })
  it("expect q.notes.calc('C#', 'M3') === F", () => {
		let letter = q.notes.calc('C#', 'M3')
    expect( letter ).toBeTruthy()
    expect( letter ).toBe( 'F' )
  })

  it("expect q.notes.calc('C', 'm3') === E♭", () => {
		let letter = q.notes.calc('C', 'm3')
    expect( letter ).toBeTruthy()
    expect( letter ).toBe( 'E♭' )
  })
  it("expect q.notes.calc('C#', 'm3') === E", () => {
		let letter = q.notes.calc('C#', 'm3')
    expect( letter ).toBeTruthy()
    expect( letter ).toBe( 'E' )
  })

  it("expect q.notes.calc('D#', 'M6') === C", () => {
		let letter = q.notes.calc('D#', 'M6')
    expect( letter ).toBeTruthy()
    expect( letter ).toBe( 'C' )
  })
})


describe.skip('test chord functions', () => {
  it.skip("expect q.chords.byName('Maj').abr === 'maj' ", () => {
		let chord = q.chords.byName('maj')
    expect( chord ).toBeTruthy()
    expect( chord.abr ).toBe( 'maj' )
  })
  it("test q.chords.inversions('c', 'maj', 4)", () => {
		let result = q.chords.inversions('c', 'maj', 4 )
    expect( result ).toBeTruthy()
    expect( Object.keys(result.positions).length ).toBe( 3 )
    // console.log('result.positions.Second:', result.positions.Second )
    expect( result.positions.Second[1].note ).toBe( 'G' )
    expect( result.positions.Second[2].note ).toBe( 'C' )
    expect( result.positions.Second[3].note ).toBe( 'E' )
    expect( result.positions.Second[3].semis ).toBe( 64 )
  })
  it("test q.chords.inversions('c', 'min', 4)", () => {
		let result = q.chords.inversions('c', 'min', 4 )
    expect( result ).toBeTruthy()
    expect( Object.keys(result.positions).length ).toBe( 3 )
    // console.log('result.positions:', result.positions )
    expect( result.positions.Second[1].note ).toBe( 'G' )
    expect( result.positions.Second[2].note ).toBe( 'C' )
    expect( result.positions.Second[3].note ).toBe( 'E♭' )
    expect( result.positions.Second[3].semis ).toBe( 63 )
  })
  it("test q.chords.inversions('c', 'maj7', 4)", () => {
		let result = q.chords.inversions('c', 'maj7', 4 )
    expect( result ).toBeTruthy()
    expect( Object.keys(result.positions).length ).toBe( 4 )
    // console.log('result.positions:', result.positions )
    expect( result.positions.Second[1].note ).toBe( 'G' )
    expect( result.positions.Second[2].note ).toBe( 'B' )
    expect( result.positions.Second[3].note ).toBe( 'C' )
    expect( result.positions.Second[4].note ).toBe( 'E' )
    expect( result.positions.Second[4].semis ).toBe( 64 )
  })
  it("test q.chords.inversions('c', 'aug' )", () => {
		let result = q.chords.inversions('c', 'aug' )
    expect( result ).toBeTruthy()
    expect( Object.keys(result.positions).length ).toBe( 3 )
    // console.log('result.positions:', result.positions )
    expect( result.positions.Second[1].note ).toBe( 'G#' )
    expect( result.positions.Second[2].note ).toBe( 'C' )
    expect( result.positions.Second[3].note ).toBe( 'E' )
    expect( result.positions.Second[3].semis ).toBe( 16 )
  })
  it("visually test q.chords.inversionNotes('C','maj')", () => {
		let result = q.chords.inversions('C','maj')
    expect( result ).toBeTruthy()
    //extract notes for inversions
    let list = q.chords.inversionNotes( result, 'Second' )
    console.log( 'q.chords.inversionNotes()', list)
  })
  it("visually test q.chords.inversionNotes('C','7')", () => {
		let result = q.chords.inversions('C','7')
    expect( result ).toBeTruthy()
    //extract notes for inversions
    let list = q.chords.inversionNotes( result, 'First' )
    console.log( 'q.chords.inversionNotes()', list)
  })
  it("visually test q.chords.inversionNotes('C','sus2')", () => {
		let result = q.chords.inversions('C','sus2')
    expect( result ).toBeTruthy()
    //extract notes for inversions
    let list = q.chords.inversionNotes( result, 'Third' )
    console.log( 'q.chords.inversionNotes()', list)
  })
})

describe.skip('test fretboard.objBySemis()', () => {
  it("expect q.notes.bySemis('48', true).notes[0] = C", () => {
		let result = q.fretboard.objBySemis('48')
    expect( result ).not.toBe( false )
    expect( result.notes[0] ).toBe( 'C' )
    expect( result.strgnum ).toBe( 2 )
    expect( result.fret ).toBe( 1 )
  })
  it("expect q.fretboard.objBySemis(35).notes[0] === B ", () => {
		let result = q.fretboard.objBySemis(35)
    expect( result ).not.toBe( false )
    expect( result.notes[0] ).toBe( 'B' )
    expect( result.notes[1] ).toBe( 'C♭' )
    expect( result.strgnum ).toBe( 5 )
    expect( result.fret ).toBe( 2 )
  })
})

describe.skip('manual tests for notes.match() ', () => {
  let nobjList8 = [  //should match EBlues7
    {
      "note": "G",
      "notes": q.notes.bySemis( q.semis.calc('G', 3)),
      "semis": q.semis.calc('G', 3),
    // },{
    //   "note": "A",
    //   "notes": q.notes.bySemis( q.semis.calc('A', 3)),
    //   "semis": q.semis.calc('A', 3),
    },{
      "note": "D",
      "notes": q.notes.bySemis( q.semis.calc('D', 3)),
      "semis": q.semis.calc('D', 3),
    // },{
    //   "note": "E",
    //   "notes": q.notes.bySemis( q.semis.calc('E', 3)),
    //   "semis": q.semis.calc('E', 3),
    },
  ]
  it.skip("manual test, one chord against selected notes", () => {
    let chordName = 'maj'
    let note = 'G'
    let chord = q.chords.obj(note, chordName)
    let ivls = chord.ivls    
    let nobs = nobjList8
    console.log( 'original nobjList:', nobs)
  	let result = q.notes.match( ivls,  nobs)
    if(result === false)
      console.log( note, chord.name, ' failed',
        '\nscale.ivls:', chord.ivls,
      )
    else{
      console.log( note, chord.name, ' found:', result,
           '\nscale.ivls:', chord.ivls,
      )
    }
  })
  it("manual test, finding all chords that match selected notes", () => {
    let nobs = nobjList8
    console.log( 'original nobjList:', nobs)
    let cnt = 0
    let last = null
    for(let chord of q.chords.list){    //test chord for a matching patter of notes
      for(let iobj of q.intervals.list){
        if(last != null && last.semis === iobj.semis) continue
        last = iobj

        let note = iobj.note
        let sobj = q.chords.obj(note, chord.name)
        let ivls = sobj.ivls    
       	let result = q.notes.match( ivls,  nobs)
        
        if(result === true) 
          console.log( ++cnt, note, chord.name+' match: ', ivls)
      }
      // break
    }
  })
  it.skip("manual test, one scale against selected notes", () => {
    let scaleShort = 'Blues6'
    let scale = q.scales.obj('E', scaleShort)
    let ivls = scale.ivls    
    let nobs = nobjList8
    console.log( 'original nobjList:', nobs)
  	let result = q.notes.match( ivls,  nobs)
    if(result === false)
      console.log( scale.name+' failed',
        '\nscale.ivls:', scale.ivls,
      )
    else{
      console.log( scale.name+' found:', result,
           '\nscale.ivls:', scale.ivls,
      )
    }
  })
  it.skip("manual test, finding all scales that match selected notes", () => {
    let nobs = nobjList8
    console.log( 'original nobjList:', nobs)
    let cnt = 0
    let last = null
    for(let scale of q.scales.list){    //test scale for a matching patter of notes
      for(let iobj of q.intervals.list){
        if(last != null && last.semis === iobj.semis) continue
        last = iobj

        let note = iobj.note
        let sobj = q.scales.obj(note, scale.name)
        let ivls = sobj.ivls    
       	let result = q.notes.match( ivls,  nobs)

        if(result === true) 
          console.log( ++cnt, note, scale.name+' match: ', ivls)
      }
      // break
    }
  })

})

describe('test scale functions', () => {
  it("test inspect scales.degreeChords('C', 'Major')", () => {
		let result = q.scales.degreeChords('C', 'Major')
    expect( result ).not.toBe( false )
 
    // console.log( result.chords[6] )
    expect( result.chords[1].abr ).toBe( 'min' )
    expect( result.chords[6].abr ).toBe( 'dim' )
  })
  it("test inspect scales.degreeTriads('C', 'Minor')", () => {
		let result = q.scales.degreeTriads('C', 'Minor')
    expect( result ).not.toBe( false )
 
    console.log( result )
    // console.log( result.chords[6] )
    expect( result.chords[0].abr ).toBe( 'min' )
    expect( result.chords[1].abr ).toBe( 'dim' )
  })
})
