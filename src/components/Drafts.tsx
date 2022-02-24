import React, { FC, Fragment, useEffect, useRef, useState } from 'react'
import { useAsyncCallback } from 'react-async-hook'
import useConstant from 'use-constant'
import {
  Add32,
  OverflowMenuVertical32,
  Subtract32,
  TrashCan32,
} from '@carbon/icons-react'
import { clear, del } from 'idb-keyval'
import type { DraftsAction, DraftsState } from '../reducers/drafts'
import { Menu, Transition } from '@headlessui/react'
import { usePopper } from 'react-popper'

const Drafts: FC<{
  draftsState: DraftsState
  draftsDispatch: React.Dispatch<DraftsAction>
}> = ({ draftsState: { drafts, currentIndex }, draftsDispatch }) => {
  const currentDraftRef = useRef<HTMLLIElement>(null)

  const newDraft = useConstant(() => () => draftsDispatch({ type: 'newDraft' }))
  const asyncDeleteDraft = useAsyncCallback(deleteDraft)
  const asyncDeleteAllDrafts = useAsyncCallback(deleteAllDrafts)

  useEffect(() => {
    currentDraftRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  })

  const popperMenuRef = React.useRef<HTMLDivElement>(null)
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null)
  const [popperMenuElement, setPopperMenuElement] =
    useState<HTMLDivElement | null>(null)
  const { styles, attributes } = usePopper(
    referenceElement,
    popperMenuElement,
    {
      placement: 'bottom-end',
    }
  )

  return (
    <section>
      <div className="flex mb-2">
        <h1 className="text-lg uppercase flex-grow">Drafts</h1>
        <button
          onClick={newDraft}
          className="sidebar-item-hoverable inline-flex items-center focusable"
        >
          <span className="sr-only">add new draft</span>
          <Add32 className="w-5 h-5" aria-hidden="true" />
        </button>
        <Menu>
          <Menu.Button
            ref={setReferenceElement}
            className="sidebar-item-hoverable inline-flex items-center focusable"
          >
            <span className="sr-only">drafts options</span>
            <OverflowMenuVertical32 className="w-5 h-5" aria-hidden="true" />
          </Menu.Button>
          <div
            ref={popperMenuRef}
            style={styles.popper}
            {...attributes.popper}
            className="popper"
          >
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
              beforeEnter={() => setPopperMenuElement(popperMenuRef.current)}
              afterLeave={() => setPopperMenuElement(null)}
            >
              <Menu.Items className="p-px">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() =>
                        asyncDeleteAllDrafts.execute(draftsDispatch)
                      }
                      disabled={asyncDeleteAllDrafts.loading}
                      className={`${
                        active ? 'bg-gray-200 dark:bg-blue-gray-700' : ''
                      } flex items-center gap-1 px-2 py-px w-full focus:outline-none`}
                    >
                      <TrashCan32
                        className="w-5 h-5 text-red-600 dark:text-red-200"
                        aria-hidden="true"
                      />
                      {asyncDeleteAllDrafts.loading ? '...' : 'Delete All'}
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </div>
        </Menu>
      </div>
      <ul className="max-h-36 overflow-y-auto">
        {drafts.map(({ title, id }, index) =>
          index === currentIndex ? (
            <li
              ref={currentDraftRef}
              key={id}
              className="px-2 py-px rounded-sm sidebar-item-active cursor-default"
            >
              {title}
            </li>
          ) : (
            <li key={id} className="flex sidebar-item-hoverable">
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
                className="px-1 inline-flex items-center hover:(text-red-600 dark:text-red-200)"
              >
                <span className="sr-only">delete draft-{id}</span>
                {asyncDeleteDraft.loading ? (
                  '...'
                ) : (
                  <Subtract32 className="h-5 w-5" aria-label="Delete draft" />
                )}
              </button>
            </li>
          )
        )}
      </ul>
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
