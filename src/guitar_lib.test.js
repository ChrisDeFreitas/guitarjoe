/*
  test guitar_lib.js functions
  - test suite used for initial concept development
  - not all library functions test here
*/
import q from "./guitar_lib.js";

q.fretboard.fretMaxSet( 8 )

describe('test interval functions', () => {
  it("expect q.semis('m3').semis === 3 ", () => {
		let ivl = q.semis('m3')
    expect( ivl ).toBeTruthy()
    expect( ivl.semis ).toBe( 3 )
  })
  it("expect q.semis('C').abr === 'P1' ", () => {
		let ivl = q.semis('C')
    expect( ivl ).toBeTruthy()
    expect( ivl.abr ).toBe( 'P1' )
  })
})


describe('test semisCalc()', () => {
  it("expect q.semisCalc('E', 4) === 52 ", () => {
		let semis = q.semisCalc('E', 4)
    expect( semis ).toBeTruthy()
    expect( semis ).toBe( 52 )
  })
})


describe('test notes.calc()', () => {
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


describe('test chord functions', () => {
  it("expect q.chords.byName('Maj').abr === 'maj' ", () => {
		let chord = q.chords.byName('maj')
    expect( chord ).toBeTruthy()
    expect( chord.abr ).toBe( 'maj' )
  })
//  need to fix q.chords.make() (when code needed)
//   it("expect q.chords.make('c', 'min', 4).abr === 'min' ", () => {
// 		let chord = q.chords.make('c', 'min', 4)
//     expect( chord ).toBeTruthy()
//     expect( chord.abr ).toBe( 'min' )
//   })
})


describe('test fretboard.objBySemis()', () => {
  it("expect q.notes.bySemis('48', true).notes[0] = C", () => {
		let result = q.fretboard.objBySemis('48')
    expect( result ).not.toBe( false )
    expect( result.notes[0] ).toBe( 'C' )
    expect( result.strg.note ).toBe( 'B' )
    expect( result.fret ).toBe( 1 )
  })
  it("expect q.fretboard.objBySemis(35).notes[0] === B ", () => {
		let result = q.fretboard.objBySemis(35)
    expect( result ).not.toBe( false )
    expect( result.notes[0] ).toBe( 'B' )
    expect( result.notes[1] ).toBe( 'C♭' )
    expect( result.strg.note ).toBe( 'A' )
    expect( result.fret ).toBe( 2 )
  })
})
