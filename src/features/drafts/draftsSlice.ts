import { createSlice } from '@reduxjs/toolkit'
import { Node } from 'slate'
import type { Descendant } from 'slate'
import {
  fetchDrafts,
  fetchDraftByIndex,
  deleteDraftByIndex,
  saveCurrentDraft,
  deleteAllDrafts,
} from './draftsAPI'
import { RootState } from '../../app/store'

interface DraftsState {
  drafts: { id: number; title: string | null }[]
  currentDraft: {
    index: number
    initialValue: Descendant[]
  } | null
}

const initialState: DraftsState = {
  drafts: [],
  currentDraft: null,
}

export const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    newDraft: (state) => {
      const { drafts } = state
      state.currentDraft = {
        index:
          drafts.push({
            id: drafts.length > 0 ? drafts[drafts.length - 1].id + 1 : 0,
            title: null,
          }) - 1,
        initialValue: [{ type: 'paragraph', children: [{ text: '' }] }],
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrafts.fulfilled, (state, action) => {
        const { entries, selectedIndex } = action.payload
        if (entries.length === 0) {
          state.drafts = [{ id: 0, title: null }]
          state.currentDraft = {
            index: 0,
            initialValue: [{ type: 'paragraph', children: [{ text: '' }] }],
          }
        } else if (selectedIndex in entries) {
          state.drafts = entries.map(([id, value]) => ({
            id,
            title: makeTitle(value, id),
          }))
          state.currentDraft = {
            index: selectedIndex,
            initialValue: entries[selectedIndex][1],
          }
        } else throw new Error('Invalid payload')
      })
      .addCase(fetchDraftByIndex.fulfilled, (state, action) => {
        const { index, value } = action.payload
        state.currentDraft = {
          index,
          initialValue:
            value !== undefined
              ? value
              : [{ type: 'paragraph', children: [{ text: '' }] }],
        }
      })
      .addCase(deleteDraftByIndex.fulfilled, (state, action) => {
        const index = action.payload
        const { drafts, currentDraft } = state
        if (currentDraft === null || drafts.length === 0)
          throw new Error('There is no draft currently.')
        if (index in drafts) {
          const currentIndex = currentDraft.index
          if (index === currentIndex)
            throw new Error('Can not delete the current draft.')
          drafts.splice(index, 1)
          currentDraft.index =
            index > currentIndex ? currentIndex : currentIndex - 1
        } else throw new Error('Invalid payload')
      })
      .addCase(saveCurrentDraft.fulfilled, (state, action) => {
        const value = action.payload
        const { drafts, currentDraft } = state
        if (currentDraft === null)
          throw new Error('Currently no draft is selected.')
        const draft = drafts[currentDraft.index]
        draft.title = makeTitle(value, draft.id)
      })
      .addCase(deleteAllDrafts.fulfilled, (state) => {
        state.drafts = [{ id: 0, title: null }]
        state.currentDraft = {
          index: 0,
          initialValue: [{ type: 'paragraph', children: [{ text: '' }] }],
        }
      })
  },
})

const titleLength = 25
const makeTitle = (value: Descendant[], id: number) => {
  const content = value.map(n => Node.string(n)).join('\n').trim().split("\n")[0]

  if (content === '') return `Draft ${id + 1}`
  if (content.length <= titleLength) return content
  if (content[titleLength] === ' ') return content.substring(0, titleLength)
  return content.substring(0, content.lastIndexOf(' ', titleLength))
}

// Action creators are generated for each case reducer function
export const { newDraft } = draftsSlice.actions

export const selectInitialValue = (state: RootState) =>
  state.drafts.currentDraft === null
    ? null
    : state.drafts.currentDraft.initialValue

export const selectDraftState = (state: RootState) => {
  const { drafts, currentDraft } = state.drafts
  return {
    drafts,
    currentIndex: currentDraft === null ? null : currentDraft.index,
  }
}

export default draftsSlice.reducer
