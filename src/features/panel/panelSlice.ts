import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'
import type { PayloadAction } from '@reduxjs/toolkit'
import isMobile from 'is-mobile'

interface PanelState {
  selectedTab: string
}

const initialState: PanelState = {
  selectedTab: isMobile() ? 'keyboard' : 'avro-layout',
}

export const panelSlice = createSlice({
  name: 'panel',
  initialState,
  reducers: {
    setSelectedTab: (state, action: PayloadAction<string>) => {
      state.selectedTab = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setSelectedTab } = panelSlice.actions

export const selectSelectedTab = (state: RootState) => state.panel.selectedTab

export default panelSlice.reducer
