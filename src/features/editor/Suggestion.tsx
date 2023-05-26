import React, { useLayoutEffect } from 'react'
import { useFloating, shift, flip, offset } from '@floating-ui/react-dom'
import { Point, Range, Editor } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { updatePreEdit } from './Editor'

import type AvroPhonetic from 'src/avro-phonetic'
import type { SuggestionState, SuggestionAction } from './suggestionReducer'
import { cls } from '@/common/cls'

export const Suggestion = ({
  suggestionState: { candidates, selection, rawInput },
  suggestionDispatch,
  inputStart,
  avro,
}: {
  suggestionState: SuggestionState
  suggestionDispatch: React.Dispatch<SuggestionAction>
  inputStart: Point | null
  avro: AvroPhonetic
}) => {
  const editor = useSlate()

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    middleware: [
      shift(),
      flip({
        boundary: document.querySelector('#slate-editor') ?? undefined,
      }),
      offset(({ placement }) => ({
        crossAxis: placement.endsWith('start') ? -9 : 0,
        mainAxis: 3,
      })),
    ],
  })
  useLayoutEffect(() => {
    const { selection } = editor
    const start = inputStart
    if (
      start !== null &&
      rawInput !== '' &&
      selection !== null &&
      Range.isCollapsed(selection)
    ) {
      const { x, y, width, height } = ReactEditor.toDOMRange(
        editor,
        Editor.range(editor, start, Range.end(selection))
      ).getBoundingClientRect()
      const { scrollX, scrollY } = window
      refs.setReference({
        getBoundingClientRect: () =>
          DOMRectReadOnly.fromRect({
            x: x + scrollX - window.scrollX,
            y: y + scrollY - window.scrollY,
            width,
            height,
          }),
      })
    } else refs.setReference(null)
  }, [editor, inputStart, rawInput, refs])

  if (refs.reference.current !== null && candidates.length > 1)
    return (
      <div ref={refs.setFloating} style={floatingStyles} className="popper">
        <div className="px-2">{rawInput}</div>
        <ol
          className="list-decimal list-inside p-px border-t dark:border-black horizontal:(flex flex-wrap)"
          role="listbox"
        >
          {candidates.map((suggestion, i) => {
            const handleSelect = () => {
              updatePreEdit(editor, inputStart, suggestion)
              avro.commit(rawInput, suggestion)
              suggestionDispatch({ type: 'clearSuggestion' })
              ReactEditor.focus(editor)
            }

            return (
              <li
                role="option"
                aria-selected={i === selection}
                key={suggestion}
                className={cls(
                  'px-2 py-px',
                  i === selection
                    ? 'bg-green-300 dark:bg-rose-700'
                    : 'hover:bg-green-200 dark:hover:bg-rose-600'
                )}
                onClick={handleSelect}
                onKeyDown={({ key }) => {
                  if (key === 'Enter') handleSelect()
                }}
              >
                {suggestion}
              </li>
            )
          })}
        </ol>
      </div>
    )
  else return null
}
