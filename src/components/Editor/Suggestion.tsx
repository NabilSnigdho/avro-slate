import React, { FC, useMemo, useState } from 'react'
import { usePopper } from 'react-popper'
import { Point, Range, Editor } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { updatePreEdit } from './Editor'

import type AvroPhonetic from '../../avro-phonetic'
import type { AvroSlateEditor } from './custom-types'
import type { SuggestionState, SuggestionAction } from '../../reducers/suggestion'
import type { OffsetModifier } from '@popperjs/core/lib/modifiers/offset'

const Suggestion: FC<{
  suggestionState: SuggestionState
  suggestionDispatch: React.Dispatch<SuggestionAction>
  inputStart: Point | null
  avro: AvroPhonetic
}> = ({ suggestionState, suggestionDispatch, inputStart, avro }) => {
  const editor: AvroSlateEditor = useSlate()
  const { candidates, selection, rawInput } = suggestionState
  const referenceElement = useMemo(() => {
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
      return {
        getBoundingClientRect: () =>
          DOMRectReadOnly.fromRect({
            x: x + scrollX - window.scrollX,
            y: y + scrollY - window.scrollY,
            width,
            height,
          }),
      }
    } else return null
  }, [editor, inputStart, rawInput])
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  )
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
    modifiers: [offset],
  })

  if (referenceElement !== null && candidates.length > 1)
    return (
      <div
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className="popper"
      >
        <div className="px-2">{rawInput}</div>
        <ol className="list-decimal list-inside p-px border-t dark:border-black horizontal:(flex flex-wrap)">
          {candidates.map((suggestion, i) => (
            <li
              key={suggestion}
              className={`px-2 py-px${
                i === selection ? ' bg-green-300 dark:bg-rose-700' : ' hover:bg-green-200 dark:hover:bg-rose-600'
              }`}
              onClick={() => {
                updatePreEdit(editor, inputStart, suggestion)
                avro.commit(suggestionState.rawInput, suggestion)
                suggestionDispatch({ type: 'clearSuggestion' })
                ReactEditor.focus(editor)
              }}
            >
              {suggestion}
            </li>
          ))}
        </ol>
      </div>
    )
  else return null
}

const offset = {
  name: 'offset',
  options: {
    offset: ({ placement }) => [placement.endsWith('start') ? -9 : 0, 3],
  },
} as OffsetModifier

export default React.memo(Suggestion)
