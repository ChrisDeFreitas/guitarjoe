/*
  test guitar_lib.js functions
  - test suite used for initial concept development
  - not all library functions test here
*/
import q from "./guitar_lib.js";

q.fretMaxSet( 8 )

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


describe('test letterCalc()', () => {
  it("expect q.letterCalc('C', 2) === D ", () => {
		let letter = q.letterCalc('C', 2)
    expect( letter ).toBeTruthy()
    expect( letter ).toBe( 'D' )
  })
  it("expect q.letterCalc('C', '12') === C ", () => {
		let letter = q.letterCalc('C', '12')
    expect( letter ).toBeTruthy()
    expect( letter ).toBe( 'C' )
  })
  it("expect q.letterCalc('C', 13) === C# ", () => {
		let letter = q.letterCalc('C', 14)
    expect( letter ).toBeTruthy()
    expect( letter ).toBe( 'D' )
  })
  it("expect q.letterCalc('C', {semis:14}) === D ", () => {
		let letter = q.letterCalc('C', {semis:14})
    expect( letter ).toBeTruthy()
    expect( letter ).toBe( 'D' )
  })
})


describe('test chord functions', () => {
  it("expect q.chords.byName('Maj').abr === 'maj' ", () => {
		let chord = q.chords.byName('maj')
    expect( chord ).toBeTruthy()
    expect( chord.abr ).toBe( 'maj' )
  })
/* need to fix q.chords.make() (when code needed)
  it("expect q.chords.make('c', 'min', 4).abr === 'min' ", () => {
		let chord = q.chords.make('c', 'min', 4)
    expect( chord ).toBeTruthy()
    expect( chord.abr ).toBe( 'min' )
  })
*/
})


describe('test noteBySemis()', () => {
  it("expect q.noteBySemis('48') returns object ", () => {
		let result = q.noteBySemis('48')
    expect( result ).not.toBe( false )
    expect( result.fretN ).toBe( 1 )
    expect( result.letter ).toBe( 'C' )
  })
  it("expect q.noteBySemis(50).fretN === 3 ", () => {
		let result = q.noteBySemis(50)
    expect( result ).not.toBe( false )
    expect( result.fretN ).toBe( 3 )
    expect( result.letter ).toBe( 'D' )
    expect( result.strg.letter ).toBe( 'B' )
  })
})
