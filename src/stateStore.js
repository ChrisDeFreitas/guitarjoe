/*
	redux central state object with RTK

*/
import { configureStore } from '@reduxjs/toolkit'

import fretboardActions from './FretboardActions'


export const store =  configureStore({
  reducer: {
    frets: fretboardActions,
  },
})
