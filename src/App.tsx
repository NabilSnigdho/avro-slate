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
import { LogoGithub32 } from '@carbon/icons-react'

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
  const setIsBN = useConstant(() => (isBN: boolean) => {
    settingsDispatch({ type: 'setIsBN', payload: { isBN } })
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
    document.addEventListener('keydown', keyboardToggleLang)
    document.addEventListener('horizontalswipe', toggleLanguage)
    return () => {
      document.removeEventListener('keydown', keyboardToggleLang)
      document.removeEventListener('horizontalswipe', toggleLanguage)
    }
  }, [toggleLanguage, keyboardToggleLang])

  return (
    <main className="flex min-h-screen md:(divide-x) <md:(divide-y flex-col)">
      {draftValue.loading || draftId === null ? (
        <div className="p-3 flex-grow">Loading...</div>
      ) : draftValue.error ? (
        <div className="p-3 flex-grow">Error: {draftValue.error.message}</div>
      ) : (
        <Editor
          id={draftId}
          initialValue={draftValue.result}
          saveDraft={saveDraft}
          setIsBN={setIsBN}
          settings={settings}
        ></Editor>
      )}
      <aside className="bg-light-100 p-3 md:min-w-64 flex flex-col gap-y-3">
        <InputMethodPane settings={settings} toggleLanguage={toggleLanguage} />
        <Drafts draftsState={draftsState} draftsDispatch={draftsDispatch} />
        <section className="<md:hidden text-dark-50">
          <h1 className="text-lg uppercase">Keyboard Shortcuts</h1>
          <hr className="mb-2" />
          <dl className="text-sm grid grid-cols-[1fr,auto] gap-x-3 gap-y-2">
            <dt>Next Candidate</dt>
            <dd>
              <CtrlKey /> + <Key>n</Key>
            </dd>
            <dt>Previous Candidate</dt>
            <dd>
              <CtrlKey /> + <Key>p</Key>
            </dd>
          </dl>
        </section>
        <nav className="mt-auto">
          <a
            href="https://github.com/NabilSnigdho/avro-slate"
            className="inline-flex items-center gap-x-2"
          >
            <LogoGithub32 className="w-8 h-8" />
            <span>Source Code</span>
          </a>
        </nav>
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
