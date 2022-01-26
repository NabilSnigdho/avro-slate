import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'

import {
  createEditor,
  Editor as SlateEditor,
  Range,
  Descendant,
  Point,
  Transforms,
} from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { withHistory } from 'slate-history'

import AvroPhonetic from '../../avro-phonetic'
import Suggestion from './Suggestion'
import suggestionReducer, {
  initialSuggestion,
  SuggestionState,
} from '../../reducers/suggestion'
import type { AvroSlateEditor } from './custom-types'
import useConstant from 'use-constant'
import Portal from '../common/Portal'
import { SettingsState } from '../../reducers/settings'

const Editor: FC<{
  id: number
  initialValue: Descendant[] | undefined
  settings: SettingsState
  setIsBN: (isBN: boolean) => void
  saveDraft: (draftId: number, value: Descendant[]) => Promise<void>
}> = ({ id, initialValue, settings: { isBN }, setIsBN, saveDraft }) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const avro = useConstant(() => new AvroPhonetic())

  const [value, setValue] = useState<Descendant[]>(
    initialValue ?? [{ type: 'paragraph', children: [{ text: '' }] }]
  )
  const [suggestionState, suggestionDispatch] = useReducer(
    suggestionReducer,
    initialSuggestion
  )
  const inputStartRef = useRef<Point | null>(null)

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const { key } = event
      if (!isBN || event.nativeEvent.isComposing || ModifierKeys.has(key))
        return
      if (key === 'Unidentified') {
        setIsBN(false)
        return
      }

      if (
        /^[^\P{ASCII} ]$/u.test(key) &&
        !(event.ctrlKey || event.altKey || event.metaKey)
      ) {
        event.preventDefault()

        const { selection } = editor
        if (selection) {
          if (Range.isCollapsed(selection)) {
            if (!avro.ongoingInputSession)
              inputStartRef.current = Range.start(selection)
          } else {
            Transforms.insertText(editor, '')
            inputStartRef.current = Range.start(selection)
          }
        }

        const suggestion = avro.getSuggestionForKey(key)
        suggestionDispatch({ type: 'setSuggestion', payload: suggestion })
        return
      }

      if (avro.ongoingInputSession) {
        if (suggestionState.candidates.length > 1) {
          const isSuggestionWinHorizontal = window.innerHeight < 360
          if (
            key === (isSuggestionWinHorizontal ? 'ArrowRight' : 'ArrowDown') ||
            key === 'Tab' ||
            (key === 'n' && event.ctrlKey)
          ) {
            event.preventDefault()
            suggestionDispatch({ type: 'selectNext' })
            return
          } else if (
            key === (isSuggestionWinHorizontal ? 'ArrowLeft' : 'ArrowUp') ||
            (key === 'p' && event.ctrlKey)
          ) {
            event.preventDefault()
            suggestionDispatch({ type: 'selectPrevious' })
            return
          }
        }

        switch (key) {
          case 'Backspace': {
            const suggestion = avro.getSuggestionForBackspace()
            if (suggestion !== null) {
              event.preventDefault()
              suggestionDispatch({ type: 'setSuggestion', payload: suggestion })
            } else {
              suggestionDispatch({ type: 'clearSuggestion' })
            }
            return
          }
          case 'Enter':
            commitOrClose(avro, suggestionState, event)
            break
          default:
            commitOrClose(avro, suggestionState)
        }
      }
      suggestionDispatch({ type: 'clearSuggestion' })
    },
    [avro, editor, isBN, setIsBN, suggestionState]
  )

  const onClick = useCallback(() => {
    if (suggestionState.selection !== null) {
      avro.commit(
        suggestionState.rawInput,
        suggestionState.candidates[suggestionState.selection]
      )
    } else {
      avro.closeInputSession()
    }
    suggestionDispatch({ type: 'clearSuggestion' })
  }, [
    avro,
    suggestionState.candidates,
    suggestionState.rawInput,
    suggestionState.selection,
  ])

  useEffect(() => {
    if (!ReactEditor.isFocused(editor)) {
      ReactEditor.focus(editor)
      Transforms.select(
        editor,
        SlateEditor.range(editor, SlateEditor.end(editor, []))
      )
    }
  }, [editor])

  useEffect(() => {
    if (suggestionState.selection !== null)
      updatePreEdit(
        editor,
        inputStartRef.current,
        suggestionState.candidates[suggestionState.selection]
      )
  }, [editor, suggestionState.candidates, suggestionState.selection])

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(value) => {
        setValue(value)
        const isAstChange = editor.operations.some(
          (op) => 'set_selection' !== op.type
        )
        if (isAstChange) saveDraft(id, value)
      }}
    >
      <Editable
        aria-label="slate"
        onKeyDown={onKeyDown}
        onClick={onClick}
        placeholder="Write Here"
        className={`p-3 flex-grow md:(max-h-screen overflow-y-auto)${
          isBN ? ' border-orange-400' : ''
        } <md:(border-l-4 border-r-4)`}
      />
      {isBN && (
        <Portal>
          <Suggestion
            suggestionState={suggestionState}
            suggestionDispatch={suggestionDispatch}
            inputStart={inputStartRef.current}
            avro={avro}
          />
        </Portal>
      )}
    </Slate>
  )
}

export const updatePreEdit = (
  editor: AvroSlateEditor,
  anchor: Point | null,
  text: string
) => {
  const { selection } = editor
  if (anchor !== null && selection && Range.isCollapsed(selection)) {
    Transforms.setSelection(editor, { anchor })
    Transforms.insertText(editor, text)
  }
}

const commitOrClose = (
  avro: AvroPhonetic,
  { candidates, selection, rawInput }: SuggestionState,
  event?: React.KeyboardEvent
) => {
  if (selection !== null) {
    event?.preventDefault()
    avro.commit(rawInput, candidates[selection])
  } else {
    avro.closeInputSession()
  }
}

const ModifierKeys = new Set([
  'Alt',
  'AltGraph',
  'CapsLock',
  'Control',
  'Fn',
  'FnLock',
  'Hyper',
  'Meta',
  'NumLock',
  'OS',
  'ScrollLock',
  'Shift',
  'Super',
  'Symbol',
  'SymbolLock',
])

export default React.memo(Editor)
