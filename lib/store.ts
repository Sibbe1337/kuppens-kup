import { configureStore } from '@reduxjs/toolkit'
import tracksReducer from './slices/tracksSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    tracks: tracksReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

