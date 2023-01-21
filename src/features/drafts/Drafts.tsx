import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { cls } from '@/common/cls'
import { selectIsTyping } from '@/features/editor/editorSlice'
import { selectSelectedTab } from '@/features/panel/panelSlice'
import { flip, useFloating } from '@floating-ui/react-dom'
import { Menu } from '@headlessui/react'
import React, { useEffect, useRef } from 'react'
import { FiMinus, FiMoreVertical, FiPlus, FiTrash2 } from 'react-icons/fi'
import { RiDraftLine } from 'react-icons/ri'
import {
  deleteAllDrafts,
  deleteDraftByIndex,
  fetchDraftByIndex,
} from './draftsAPI'
import { newDraft, selectDraftState } from './draftsSlice'

export const Drafts = React.memo(() => {
  const dispatch = useAppDispatch()
  const selectedTab = useAppSelector(selectSelectedTab)
  const { drafts, currentIndex } = useAppSelector(selectDraftState)
  const isTyping = useAppSelector(selectIsTyping)
  const currentId = currentIndex === null ? null : drafts[currentIndex].id
  const currentDraftRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (currentId !== null) localStorage.setItem('draftId', `${currentId}`)
  }, [currentId])

  const { x, y, reference, floating, strategy } = useFloating({
    placement: 'bottom-end',
    middleware: [flip()],
  })

  useEffect(() => {
    currentDraftRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  })

  return (
    <section
      className={cls(
        'flex flex-col flex-grow gap-y-1 min-h-0 <md:h-[12.875rem]',
        selectedTab === 'drafts' || '<md:hidden'
      )}
    >
      <div className="flex">
        <h1 className="text-lg uppercase flex-grow">Drafts</h1>
        <Menu>
          <Menu.Button
            ref={reference}
            className="item-hoverable inline-flex items-center focusable"
          >
            <span className="sr-only">drafts options</span>
            <FiMoreVertical className="w-5 h-5" aria-hidden="true" />
          </Menu.Button>
          <Menu.Items
            ref={floating}
            style={{
              position: strategy,
              top: y ?? '',
              left: x ?? '',
            }}
            className="p-px popper"
          >
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    dispatch(deleteAllDrafts())
                  }}
                  className={cls(
                    'flex items-center gap-1 px-2 py-px w-full focus:outline-none',
                    active && 'bg-gray-200 dark:bg-blue-gray-700'
                  )}
                >
                  <FiTrash2
                    className="w-5 h-5 text-red-600 dark:text-red-200"
                    aria-hidden="true"
                  />
                  Delete All
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
      <ul className="overflow-y-auto bg-light-200 border-b-3 border-t-3 dark:(bg-dark-400 border-black)">
        {drafts.map(({ title, id }, index) => {
          if (title === null) title = `Draft ${id + 1} (unsaved)`
          return index === currentIndex ? (
            <li
              ref={currentDraftRef}
              key={id}
              className="px-2 py-1 grid grid-cols-[auto,1fr] items-center rounded-sm item-active cursor-default"
            >
              <RiDraftLine className="h-5 w-5 mr-2" />
              <span className="truncate font-mono">
                {isTyping ? 'typing...' : title}
              </span>
            </li>
          ) : (
            <li key={id} className="flex item-hoverable">
              <button
                onClick={() => {
                  dispatch(fetchDraftByIndex(index))
                }}
                className="px-2 py-1 grid grid-cols-[auto,1fr] items-center rounded-sm flex-grow"
              >
                <RiDraftLine className="h-5 w-5 mr-2" />
                <span className="truncate text-left font-mono">{title}</span>
              </button>
              <button
                onClick={() => {
                  dispatch(deleteDraftByIndex(index))
                }}
                className="px-1 inline-flex items-center hover:(text-red-600 dark:text-red-200)"
              >
                <span className="sr-only">delete draft-{id}</span>
                <FiMinus className="h-5 w-5" aria-label="Delete draft" />
              </button>
            </li>
          )
        })}
      </ul>
      <button
        onClick={() => {
          dispatch(newDraft())
        }}
        className="item-hoverable px-2 py-1 flex items-center w-full focusable"
      >
        <FiPlus className="w-5 h-5 mr-2" aria-hidden="true" />
        New draft
      </button>
    </section>
  )
})
