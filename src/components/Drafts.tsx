import React, { FC, useEffect, useRef } from 'react'
import { useAsyncCallback } from 'react-async-hook'
import useConstant from 'use-constant'
import { TrashCan32 } from '@carbon/icons-react'
import { clear, del } from 'idb-keyval'
import type { DraftsAction, DraftsState } from '../reducers/drafts'

const Drafts: FC<{
  draftsState: DraftsState
  draftsDispatch: React.Dispatch<DraftsAction>
}> = ({ draftsState: { drafts, currentIndex }, draftsDispatch }) => {
  const currentDraftRef = useRef<HTMLLIElement | null>(null)

  const newDraft = useConstant(() => () => draftsDispatch({ type: 'newDraft' }))
  const asyncDeleteDraft = useAsyncCallback(deleteDraft)
  const asyncDeleteAllDrafts = useAsyncCallback(deleteAllDrafts)

  useEffect(() => {
    currentDraftRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  })

  return (
    <section>
      <div className="flex items-center">
        <h1 className="text-lg uppercase flex-grow">Drafts</h1>
        <button
          onClick={() => asyncDeleteAllDrafts.execute(draftsDispatch)}
          disabled={asyncDeleteAllDrafts.loading}
          className="text-sm px-1 bg-light-400 hover:bg-red-100 border border-light-900"
        >
          {asyncDeleteAllDrafts.loading ? '...' : 'Delete All'}
        </button>
      </div>
      <hr className="mb-2" />
      <ul className="max-h-36 overflow-y-auto">
        {drafts.map(({ title, id }, index) =>
          index === currentIndex ? (
            <li
              ref={currentDraftRef}
              key={id}
              className="px-2 py-px rounded-sm bg-gray-200 cursor-default"
            >
              {title}
            </li>
          ) : (
            <li key={id} className="flex hover:bg-gray-100">
              <button
                onClick={() => {
                  draftsDispatch({
                    type: 'selectDraft',
                    payload: { index },
                  })
                }}
                className="px-2 py-px rounded-sm text-left flex-grow"
              >
                {title}
              </button>
              <button
                onClick={() =>
                  asyncDeleteDraft.execute(index, drafts, draftsDispatch)
                }
                disabled={asyncDeleteDraft.loading}
                className="p-1 inline-flex items-center hover:text-red-500"
              >
                {asyncDeleteDraft.loading ? (
                  '...'
                ) : (
                  <span>
                    <TrashCan32 className="h-5 w-5" aria-label="Delete draft" />
                  </span>
                )}
              </button>
            </li>
          )
        )}
      </ul>
      <button
        onClick={newDraft}
        className="border border-blue-900 px-2 py-px rounded-sm w-full bg-blue-400 hover:bg-blue-300 mt-2"
      >
        New Draft
      </button>
    </section>
  )
}

const deleteDraft = async (
  index: number,
  drafts: DraftsState['drafts'],
  draftsDispatch: React.Dispatch<DraftsAction>
) => {
  if (confirm('Do you really want to delete this draft?')) {
    await del(drafts[index].id)
    draftsDispatch({
      type: 'deleteDraft',
      payload: { index },
    })
  }
}

const deleteAllDrafts = async (
  draftsDispatch: React.Dispatch<DraftsAction>
) => {
  if (confirm('Do you really want to delete all the drafts?')) {
    await clear()
    draftsDispatch({ type: 'deleteAllDrafts' })
  }
}

export default React.memo(Drafts)
