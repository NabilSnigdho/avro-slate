import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'

interface EditorState {
  isTyping: boolean
}

const initialState: EditorState = {
  isTyping: false,
}

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    typingStarted: (state) => {
      state.isTyping = true
    },
    typingStopped: (state) => {
      state.isTyping = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { typingStarted, typingStopped } = editorSlice.actions

export const selectIsTyping = (state: RootState) => state.editor.isTyping

export default editorSlice.reducer
