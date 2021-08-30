/*
	these are really app level states
	-  Fretboard requires private state to allow multiple on screen
*/
import { createSlice } from '@reduxjs/toolkit'

export const fretboardActions = createSlice({
  name: 'FretboardActions',
  initialState: {
		// fretFirst:0,
		fretMax:19,
		// semis:'48,59,37',
		Note:'',
		Octave:'All',
		Scale:'Major',
		Chord:'None',
		Inversion:'None',
	},
  reducers: {
		
		// fretFirstUpdate: (state, action) => {
		// 	state.fretFirst = Number( action.payload )
		// },
		// these are global, semis needs to be local to FretPnl:
		// semisUpdate: (state, action) => {
		// 	state.semis = action.payload
		// 	console.log('semisUpdate', action.payload)
		// },
		fretMaxUpdate(state, action){
			// console.log('fretMaxUpdate action:', action)
			state.fretMax = Number( action.payload )
		},
  },
})

// Action creators are generated for each case reducer function
export const { 
	fretMaxUpdate
 } = fretboardActions.actions

export default fretboardActions.reducer