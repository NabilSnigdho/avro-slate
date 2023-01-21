import { createSlice } from '@reduxjs/toolkit'
import { isDarkMode } from '@/common/dark-mode'
import { RootState } from '@/app/store'
import type { PayloadAction } from '@reduxjs/toolkit'

interface SettingsState {
  isBN: boolean
  isDarkMode: boolean
}

const initialState: SettingsState = {
  isBN: true,
  isDarkMode: isDarkMode(),
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleAvro: (state) => {
      state.isBN = !state.isBN
    },
    setIsBN: (state, action: PayloadAction<boolean>) => {
      state.isBN = action.payload
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { toggleAvro, setIsBN, setIsDarkMode } = settingsSlice.actions

export const selectIsBN = (state: RootState) => state.settings.isBN
export const selectIsDarkMode = (state: RootState) => state.settings.isDarkMode

export default settingsSlice.reducer
