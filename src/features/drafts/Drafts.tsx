import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { flip, useFloating } from '@floating-ui/react-dom'
import { Menu } from '@headlessui/react'
import React, { useEffect, useRef } from 'react'
import { FiMinus, FiMoreVertical, FiPlus, FiTrash2 } from 'react-icons/fi'
import { selectIsTyping } from '@/features/editor/editorSlice'
import {
  deleteAllDrafts,
  deleteDraftByIndex,
  fetchDraftByIndex
} from './draftsAPI'
import { newDraft, selectDraftState } from './draftsSlice'

const Drafts = () => {
  const { drafts, currentIndex } = useAppSelector(selectDraftState)
  const isTyping = useAppSelector(selectIsTyping)
  const currentId = currentIndex === null ? null : drafts[currentIndex].id
  const dispatch = useAppDispatch()
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
    <section>
      <div className="flex mb-2">
        <h1 className="text-lg uppercase flex-grow">Drafts</h1>
        <button
          onClick={() => {
            dispatch(newDraft())
          }}
          className="sidebar-item-hoverable inline-flex items-center focusable"
        >
          <span className="sr-only">add new draft</span>
          <FiPlus className="w-5 h-5" aria-hidden="true" />
        </button>
        <Menu>
          <Menu.Button
            ref={reference}
            className="sidebar-item-hoverable inline-flex items-center focusable"
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
                  className={`${
                    active ? 'bg-gray-200 dark:bg-blue-gray-700' : ''
                  } flex items-center gap-1 px-2 py-px w-full focus:outline-none`}
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
      <ul className="max-h-36 overflow-y-auto">
        {drafts.map(({ title, id }, index) => {
          if (title === null) title = `Draft ${id + 1} (unsaved)`
          return index === currentIndex ? (
            <li
              ref={currentDraftRef}
              key={id}
              className="px-2 py-px rounded-sm sidebar-item-active cursor-default"
            >
              {isTyping ? 'typing...' : title}
            </li>
          ) : (
            <li key={id} className="flex sidebar-item-hoverable">
              <button
                onClick={() => {
                  dispatch(fetchDraftByIndex(index))
                }}
                className="px-2 py-px rounded-sm text-left flex-grow"
              >
                {title}
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
    </section>
  )
}

export default React.memo(Drafts)
