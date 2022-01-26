export interface SettingsState {
  isBN: boolean
}

export const initialSettings: SettingsState = {
  isBN: true,
}

export type SettingsAction =
  | { type: 'toggleLanguage' }
  | { type: 'setIsBN'; payload: { isBN: boolean } }

const settingsReducer = (
  state: SettingsState,
  action: SettingsAction
): SettingsState => {
  switch (action.type) {
    case 'toggleLanguage':
      return {
        isBN: !state.isBN,
      }
    case 'setIsBN':
      return {
        isBN: action.payload.isBN,
      }
    default:
      throw new Error()
  }
}

export default settingsReducer
