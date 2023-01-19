import { configureStore } from '@reduxjs/toolkit'
import draftsReducer from '@/features/drafts/draftsSlice'
import editorReducer from '@/features/editor/editorSlice'
import settingsReducer from '@/features/settings/settingsSlice'

const store = configureStore({
  reducer: {
    drafts: draftsReducer,
    editor: editorReducer,
    settings: settingsReducer,
  },
})
export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
