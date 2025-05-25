import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: Design.Store = {
  componentList: [],
  navigations: {}
}

const initStoreSlice = createSlice({
  name: 'initStore',
  initialState,
  reducers: {
    // 初始化 store
    initStore: (state, action: PayloadAction<Design.Store>) => {
      if (action.payload.componentList?.length) {
        state.componentList = action.payload.componentList
      }
      if (action.payload.navigations) {
        state.navigations = action.payload.navigations
      }
    },
    // 添加组件
    addComponents: (state, action: PayloadAction<Design.ComponentConfig | Design.ComponentConfig[]>) => {
      const components = Array.isArray(action.payload) ? action.payload : [action.payload]
      state.componentList.unshift(...components)
    },
    // 添加导航
    addNavigations: (state, action: PayloadAction<Design.Navigation>) => {
      if (state.navigations) {
        state.navigations = { ...state.navigations, ...action.payload }
      }
    }
  }
})

export const { initStore, addComponents, addNavigations } = initStoreSlice.actions
export default initStoreSlice.reducer
