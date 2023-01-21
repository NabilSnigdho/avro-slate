import 'virtual:windi-devtools'
import 'virtual:windi.css'

import { fetchDictionaryData } from '@/avro-phonetic/data'
import { selectInitialValue } from '@/features/drafts/draftsSlice'
import { Panel } from '@/features/panel/Panel'
import { ReloadPrompt } from '@/features/reload-prompt/ReloadPrompt'
import { Sidebar } from '@/features/sidebar/Sidebar'
import initOkkhor from 'okkhor'
import React, { Suspense, useRef } from 'react'
import { useAppSelector } from './hooks'

const editorPromise = Promise.all([
  import('@/features/editor/Editor'),
  fetchDictionaryData(),
  initOkkhor(),
]).then(([Editor]) => Editor)
const Editor = React.lazy(() => editorPromise)

function App() {
  const initialValue = useAppSelector(selectInitialValue)
  const editorData = useRef({ initialValue, key: 'odd' })
  if (editorData.current.initialValue !== initialValue) {
    editorData.current = {
      initialValue,
      key: editorData.current.key === 'odd' ? 'even' : 'odd',
    }
  }

  return (
    <main className="flex h-screen md:divide-x <md:flex-col dark:divide-black">
      <div className="flex flex-col flex-grow min-h-0">
        {initialValue === null ? (
          <div className="p-3 flex-grow">Loading draft...</div>
        ) : (
          <Suspense
            fallback={
              <div className="p-3 flex-grow">Loading dictionary...</div>
            }
          >
            <Editor
              key={editorData.current.key}
              initialValue={initialValue}
            ></Editor>
          </Suspense>
        )}
        <Panel />
      </div>
      <Sidebar />
      {typeof window !== 'undefined' && <ReloadPrompt />}
    </main>
  )
}

export default App
