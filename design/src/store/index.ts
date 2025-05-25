import { configureStore } from '@reduxjs/toolkit'
import initStoreReducer from './initStoreSlice'

export const store = configureStore({
  reducer: {
    initStore: initStoreReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
