import React, { useEffect, useReducer } from 'react'
import 'virtual:windi.css'
import 'virtual:windi-devtools'

import { Editor } from './components/Editor'

import draftsReducer, { DraftsAction, initialDrafts } from './reducers/drafts'
import settingsReducer, { initialSettings } from './reducers/settings'
import type { Descendant } from 'slate'

import { entries, get, set } from 'idb-keyval'
import { useAsync } from 'react-async-hook'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import useConstant from 'use-constant'

import InputMethodPane from './components/InputMethodPane'
import Drafts from './components/Drafts'
import ReloadPrompt from './components/ReloadPrompt'
import Key, { CtrlKey } from './components/common/Key'
import { Asleep32, Awake32, LogoGithub32 } from '@carbon/icons-react'
import { Switch } from '@headlessui/react'
import { setColorScheme } from './dark-mode'
import KeyboardShortcuts from './components/KeyboardShortcuts'

function App() {
  const [draftsState, draftsDispatch] = useReducer(draftsReducer, initialDrafts)
  const [settings, settingsDispatch] = useReducer(
    settingsReducer,
    initialSettings
  )

  const saveDraft = useConstant(() =>
    AwesomeDebouncePromise(async (draftId: number, value: Descendant[]) => {
      await set(draftId, value)
      draftsDispatch({ type: 'updateCurrentDraftTitle', payload: { value } })
    }, 1000)
  )
  const toggleLanguage = useConstant(() => () => {
    settingsDispatch({ type: 'toggleLanguage' })
  })
  const keyboardToggleLang = useConstant(() => (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === '.') {
      event.preventDefault()
      toggleLanguage()
    }
  })

  const draftIndex = draftsState.currentIndex
  const draftId = draftIndex === null ? null : draftsState.drafts[draftIndex].id
  const draftValue = useAsync(fetchDraft, [draftId, draftsDispatch])

  useEffect(() => {
    if (draftId !== null) localStorage.setItem('draftId', `${draftId}`)
  }, [draftId])

  useEffect(() => {
    setColorScheme(settings.isDarkMode)
  }, [settings.isDarkMode])

  useEffect(() => {
    document.addEventListener('keydown', keyboardToggleLang)
    document.addEventListener('horizontalswipe', toggleLanguage)
    return () => {
      document.removeEventListener('keydown', keyboardToggleLang)
      document.removeEventListener('horizontalswipe', toggleLanguage)
    }
  }, [toggleLanguage, keyboardToggleLang])

  return (
    <main className="flex min-h-screen md:(divide-x) <md:(divide-y flex-col) dark:divide-black">
      {draftValue.loading || draftId === null ? (
        <div className="p-3 flex-grow">Loading...</div>
      ) : draftValue.error ? (
        <div className="p-3 flex-grow">Error: {draftValue.error.message}</div>
      ) : (
        <Editor
          id={draftId}
          initialValue={draftValue.result}
          saveDraft={saveDraft}
          settings={settings}
          settingsDispatch={settingsDispatch}
        ></Editor>
      )}
      <aside className="p-3 md:min-w-64 flex flex-col gap-y-5 bg-gray-100 dark:bg-dark-300">
        <InputMethodPane settings={settings} toggleLanguage={toggleLanguage} />
        <Drafts draftsState={draftsState} draftsDispatch={draftsDispatch} />
        <footer className="mt-auto flex gap-3">
          <a
            href="https://github.com/NabilSnigdho/avro-slate"
            className="inline-flex items-center gap-x-2"
          >
            <LogoGithub32 className="w-8 h-8" />
            <span className="sr-only">Source Code</span>
          </a>
          <KeyboardShortcuts />
          <Switch
            checked={settings.isDarkMode}
            onChange={(isDarkMode) =>
              settingsDispatch({
                type: 'setIsDarkMode',
                payload: { isDarkMode },
              })
            }
            className="ml-auto inline-flex items-center"
          >
            <span className="sr-only">toggle dark-mode</span>
            {settings.isDarkMode ? (
              <Asleep32 className="w-8 h-8" />
            ) : (
              <Awake32 className="w-8 h-8" />
            )}
          </Switch>
        </footer>
      </aside>
      <ReloadPrompt />
    </main>
  )
}

const fetchDraft = async (
  id: number | null,
  draftsDispatch: React.Dispatch<DraftsAction>
) => {
  if (id === null) {
    const res = await entries<number, Descendant[]>()
    let draftId: string | null | number = localStorage.getItem('draftId')
    draftId = draftId === null ? null : parseInt(draftId)
    let index =
      draftId === null || isNaN(draftId)
        ? 0
        : res.findIndex(([id]) => id === draftId)
    if (index === -1) index = 0
    draftsDispatch({
      type: 'setDrafts',
      payload: {
        entries: res,
        index,
      },
    })
    return res[index][1]
  } else {
    return await get<Descendant[]>(id)
  }
}

export default App
