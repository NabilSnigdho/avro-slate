import 'virtual:windi-devtools'
import 'virtual:windi.css'

import { fetchDictionaryData } from '@/avro-phonetic/data'
import { setColorScheme } from '@/common/dark-mode'
import Drafts from '@/features/drafts/Drafts'
import { selectInitialValue } from '@/features/drafts/draftsSlice'
import KeyboardShortcuts from '@/features/keyboard-shortcuts/KeyboardShortcuts'
import ReloadPrompt from '@/features/reload-prompt/ReloadPrompt'
import InputMethodPane from '@/features/settings/InputMethodPane'
import {
  selectIsDarkMode,
  setIsDarkMode
} from '@/features/settings/settingsSlice'
import { Switch } from '@headlessui/react'
import initOkkhor from 'okkhor'
import React, { Suspense, useEffect, useRef } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'
import { GoMarkGithub } from 'react-icons/go'
import useConstant from 'use-constant'
import { useAppDispatch, useAppSelector } from './hooks'

const editorPromise = Promise.all([
  import('@/features/editor/Editor'),
  fetchDictionaryData(),
  initOkkhor(),
]).then(([Editor]) => Editor)
const Editor = React.lazy(() => editorPromise)

function App() {
  const dispatch = useAppDispatch()

  const initialValue = useAppSelector(selectInitialValue)
  const editorData = useRef({ initialValue, key: 'odd' })
  if (editorData.current.initialValue !== initialValue) {
    editorData.current = {
      initialValue,
      key: editorData.current.key === 'odd' ? 'even' : 'odd',
    }
  }

  const isDarkMode = useAppSelector(selectIsDarkMode)
  const dispatchIsDarkMode = useConstant(
    () => (isDarkMode: boolean) => dispatch(setIsDarkMode(isDarkMode))
  )
  useEffect(() => {
    setColorScheme(isDarkMode)
  }, [isDarkMode])

  return (
    <main className="flex min-h-screen md:(divide-x) <md:(divide-y flex-col) dark:divide-black">
      {initialValue === null ? (
        <div className="p-3 flex-grow">Loading draft...</div>
      ) : (
        <Suspense fallback={<div className="p-3 flex-grow">Loading dictionary...</div>}>
          <Editor
            key={editorData.current.key}
            initialValue={initialValue}
          ></Editor>
        </Suspense>
      )}
      <aside className="p-3 md:min-w-64 flex flex-col gap-y-5 bg-gray-100 dark:bg-dark-300">
        <InputMethodPane />
        <Drafts />
        <footer className="mt-auto flex gap-3">
          <a
            href="https://github.com/NabilSnigdho/avro-slate"
            className="inline-flex items-center gap-x-2"
          >
            <GoMarkGithub className="w-8 h-8" />
            <span className="sr-only">Source Code</span>
          </a>
          <KeyboardShortcuts />
          <Switch
            checked={isDarkMode}
            onChange={dispatchIsDarkMode}
            className="ml-auto inline-flex items-center"
          >
            <span className="sr-only">toggle dark-mode</span>
            {isDarkMode ? (
              <FiMoon className="w-8 h-8" />
            ) : (
              <FiSun className="w-8 h-8" />
            )}
          </Switch>
        </footer>
      </aside>
      {typeof window !== 'undefined' && <ReloadPrompt />}
    </main>
  )
}

export default App
