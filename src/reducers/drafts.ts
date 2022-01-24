import { Descendant, Node } from 'slate'

export interface DraftsState {
  drafts: { id: number; title: string }[]
  currentIndex: number | null
}

export const initialDrafts: DraftsState = {
  drafts: [],
  currentIndex: null,
}

export type DraftsAction =
  | {
      type: 'setDrafts'
      payload: { entries: [number, Descendant[]][]; index: number }
    }
  | {
      type: 'updateCurrentDraftTitle'
      payload: { value: Descendant[] }
    }
  | { type: 'selectDraft'; payload: { index: number } }
  | { type: 'deleteDraft'; payload: { index: number } }
  | { type: 'newDraft' }
  | { type: 'deleteAllDrafts' }

const draftsReducer = (
  state: DraftsState,
  action: DraftsAction
): DraftsState => {
  switch (action.type) {
    case 'setDrafts': {
      const { entries, index } = action.payload
      if (entries.length === 0)
        return {
          drafts: [{ id: 0, title: 'Draft 1' }],
          currentIndex: 0,
        }
      if (index in entries)
        return {
          drafts: entries.map(([id, value]) => ({
            id,
            title: makeTitle(value, id),
          })),
          currentIndex: index,
        }
      else throw new Error('Invalid payload')
    }
    case 'selectDraft': {
      const { index } = action.payload
      const { drafts } = state
      if (index in drafts)
        return {
          drafts,
          currentIndex: index,
        }
      else throw new Error('Invalid payload')
    }
    case 'deleteDraft': {
      const { index } = action.payload
      const { currentIndex } = state
      const drafts = state.drafts.slice(0)
      if (currentIndex === null || drafts.length === 0)
        throw new Error('There is no draft currently.')
      if (index in drafts) {
        if (index === currentIndex)
          throw new Error('Can not delete the current draft.')
        drafts.splice(index, 1)
        return {
          drafts,
          currentIndex: index > currentIndex ? currentIndex : currentIndex - 1,
        }
      } else throw new Error('Invalid payload')
    }
    case 'updateCurrentDraftTitle': {
      const { value } = action.payload
      const { currentIndex } = state
      const drafts = state.drafts.slice(0)
      if (currentIndex === null || drafts.length === 0)
        throw new Error('There is no draft currently.')
      const currentDraft = drafts[currentIndex]
      drafts[currentIndex] = {
        id: currentDraft.id,
        title: makeTitle(value, currentDraft.id),
      }
      return {
        drafts,
        currentIndex,
      }
    }
    case 'newDraft': {
      const drafts = state.drafts.slice(0)
      const currentIndex = drafts.length
      const draftId = drafts[currentIndex - 1].id + 1
      drafts.push({
        id: draftId,
        title: `Draft ${draftId + 1}`,
      })
      return {
        drafts,
        currentIndex,
      }
    }
    case 'deleteAllDrafts':
      return {
        drafts: [{ id: 0, title: 'Draft 1' }],
        currentIndex: 0,
      }
    default:
      throw new Error()
  }
}

const titleLength = 25
const makeTitle = (value: Descendant[], id: number) => {
  const content = value.length ? Node.string(value[0]).trim() : ''

  if (content === '') return `Draft ${id + 1}`
  if (content.length <= titleLength) return content
  if (content[titleLength] === ' ') return content.substring(0, titleLength)
  return content.substring(0, content.lastIndexOf(' ', titleLength))
}

export default draftsReducer
