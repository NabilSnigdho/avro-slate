export interface SuggestionState {
  candidates: string[]
  selection: number | null
  rawInput: string
}

export const initialSuggestion: SuggestionState = {
  candidates: [],
  selection: null,
  rawInput: '',
}

export type SuggestionAction =
  | {
      type: 'setSuggestion'
      payload: { candidates: string[]; prevSelection: number; rawInput: string }
    }
  | { type: 'clearSuggestion' }
  | { type: 'selectNext' }
  | { type: 'selectPrevious' }

const suggestionReducer = (
  state: SuggestionState,
  action: SuggestionAction
): SuggestionState => {
  switch (action.type) {
    case 'setSuggestion': {
      const { candidates, prevSelection, rawInput } = action.payload
      if (candidates.length && prevSelection in candidates)
        return {
          candidates,
          selection: prevSelection,
          rawInput,
        }
      else throw new Error('Invalid payload')
    }
    case 'clearSuggestion':
      return initialSuggestion
    case 'selectNext':
      return {
        candidates: state.candidates,
        selection:
          state.candidates.length === 0 || state.selection === null
            ? null
            : (state.selection + 1) % state.candidates.length,
        rawInput: state.rawInput,
      }
    case 'selectPrevious':
      return {
        candidates: state.candidates,
        selection:
          state.candidates.length === 0 || state.selection === null
            ? null
            : (state.selection || state.candidates.length) - 1,
        rawInput: state.rawInput,
      }
    default:
      throw new Error()
  }
}

export default suggestionReducer
