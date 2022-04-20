import { createAsyncThunk } from '@reduxjs/toolkit'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { clear, del, entries, get, set } from 'idb-keyval'
import type { Descendant } from 'slate'
import { RootState } from 'src/app/store'
import { typingStopped } from '../editor/editorSlice'

export const fetchDrafts = createAsyncThunk('drafts/fetchDrafts', async () => {
  const res = await entries<number, Descendant[]>()
  let draftId: string | null | number = localStorage.getItem('draftId')
  draftId = draftId === null ? null : parseInt(draftId)
  let selectedIndex =
    draftId === null || isNaN(draftId)
      ? 0
      : res.findIndex(([id]) => id === draftId)
  if (selectedIndex === -1) selectedIndex = 0
  return {
    entries: res,
    selectedIndex,
  }
})

export const fetchDraftByIndex = createAsyncThunk(
  'drafts/fetchByIndex',
  async (index: number, { getState }) => {
    const state = (getState() as RootState).drafts
    if (index in state.drafts) {
      return {
        index,
        value: await get<Descendant[]>(state.drafts[index].id),
      }
    } else throw new Error('Invalid payload')
  }
)

export const deleteDraftByIndex = createAsyncThunk(
  'drafts/deleteDraftStatus',
  async (index: number, { getState }) => {
    const state = (getState() as RootState).drafts
    await del(state.drafts[index].id)
    return index
  }
)

const saveCurrentDraftDebounced = AwesomeDebouncePromise(
  async (id: number, value: Descendant[]) => {
    await set(id, value)
  },
  1000
)

export const saveCurrentDraft = createAsyncThunk(
  'drafts/saveDraftStatus',
  async (value: Descendant[], { getState, dispatch }) => {
    const { drafts, currentDraft } = (getState() as RootState).drafts
    if (currentDraft === null)
      throw new Error('Currently no draft is selected.')
    await saveCurrentDraftDebounced(drafts[currentDraft.index].id, value)
    dispatch(typingStopped())
    return value
  }
)

export const deleteAllDrafts = createAsyncThunk(
  'drafts/deleteAllDraftsStatus',
  async () => {
    await clear()
  }
)
