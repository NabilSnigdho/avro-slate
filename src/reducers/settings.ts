import { isDarkMode } from '../dark-mode'

export interface SettingsState {
  isBN: boolean
  isDarkMode: boolean
}

export const initialSettings: SettingsState = {
  isBN: true,
  isDarkMode: isDarkMode(),
}

export type SettingsAction =
  | { type: 'toggleLanguage' }
  | { type: 'setIsBN'; payload: { isBN: boolean } }
  | { type: 'setIsDarkMode'; payload: { isDarkMode: boolean } }

const settingsReducer = (
  state: SettingsState,
  action: SettingsAction
): SettingsState => {
  switch (action.type) {
    case 'toggleLanguage':
      return {
        ...state,
        isBN: !state.isBN,
      }
    case 'setIsBN':
      return {
        ...state,
        isBN: action.payload.isBN,
      }
    case 'setIsDarkMode':
      return {
        ...state,
        isDarkMode: action.payload.isDarkMode,
      }
    default:
      throw new Error()
  }
}

export default settingsReducer
