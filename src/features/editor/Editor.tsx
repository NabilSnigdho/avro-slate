import { useAppDispatch, useAppSelector } from '@/app/hooks'
import AvroPhonetic from '@/avro-phonetic'
import { saveCurrentDraft } from '@/features/drafts/draftsAPI'
import { selectIsBN } from '@/features/settings/settingsSlice'
import { Portal } from '@headlessui/react'
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import type { Descendant } from 'slate'
import {
  createEditor,
  Editor as SlateEditor,
  Point,
  Range,
  Transforms,
} from 'slate'
import { withHistory } from 'slate-history'
import {
  DefaultPlaceholder,
  Editable,
  ReactEditor,
  Slate,
  withReact,
} from 'slate-react'
import useConstant from 'use-constant'
import type { AvroSlateEditor } from './custom-types'
import { typingStarted } from './editorSlice'
import { Suggestion } from './Suggestion'
import suggestionReducer, {
  initialSuggestion,
  SuggestionState,
} from './suggestionReducer'

const Editor = ({ initialValue }: { initialValue: Descendant[] }) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const isBN = useAppSelector(selectIsBN)
  const avro = useConstant(() => new AvroPhonetic())
  const dispatch = useAppDispatch()

  const [suggestionState, suggestionDispatch] = useReducer(
    suggestionReducer,
    initialSuggestion
  )
  const inputStartRef = useRef<Point | null>(null)

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const { key } = event
      if (
        !isBN ||
        event.nativeEvent.isComposing ||
        ModifierKeys.has(key) ||
        key === 'Unidentified'
      )
        return

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
          const isSuggestionWinHorizontal = window.innerHeight < 622
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
    [avro, editor, isBN, suggestionState]
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

  const onKeyPress = useCallback(
    (event: Event) => {
      if (!('detail' in event && typeof event.detail === 'string'))
        throw new Error('invalid event')
      const key = event.detail
      const fnKey = key.match(/^{(.+)}$/)

      if (fnKey !== null) {
        switch (fnKey[1]) {
          case 'backspace': {
            if (isBN && avro.ongoingInputSession) {
              const suggestion = avro.getSuggestionForBackspace()
              if (suggestion !== null) {
                suggestionDispatch({
                  type: 'setSuggestion',
                  payload: suggestion,
                })
                return
              } else {
                suggestionDispatch({ type: 'clearSuggestion' })
              }
            }
            const { selection } = editor
            if (selection) {
              if (Range.isCollapsed(selection))
                editor.deleteBackward('character')
              else editor.deleteFragment()
            }
            ReactEditor.focus(editor)
            return
          }
          case 'enter':
            editor.insertBreak()
            break
          case 'space':
            editor.insertText(' ')
            break
          default:
            return
        }
        if (isBN && avro.ongoingInputSession)
          commitOrClose(avro, suggestionState)
        suggestionDispatch({ type: 'clearSuggestion' })
        ReactEditor.focus(editor)
      } else {
        if (isBN) {
          if (/^[^\P{ASCII} ]$/u.test(key)) {
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
          } else {
            if (avro.ongoingInputSession) commitOrClose(avro, suggestionState)
            suggestionDispatch({ type: 'clearSuggestion' })
          }
        }
        if (editor.selection) {
          editor.insertText(key)
          ReactEditor.focus(editor)
        }
      }
    },
    [avro, editor, isBN, suggestionState]
  )

  useEffect(() => {
    window.addEventListener('virtual-keypress', onKeyPress)
    return () => {
      window.removeEventListener('virtual-keypress', onKeyPress)
    }
  }, [onKeyPress])

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
      value={initialValue}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => 'set_selection' !== op.type
        )
        if (isAstChange) {
          dispatch(typingStarted())
          dispatch(saveCurrentDraft(value))
        }
      }}
    >
      <Editable
        id="slate-editor"
        aria-label="slate"
        inputMode="none"
        onKeyDown={onKeyDown}
        onClick={onClick}
        placeholder="Write Here"
        renderPlaceholder={(placeholderProps) => {
          placeholderProps.attributes.style.opacity = '0.54'
          return <DefaultPlaceholder {...placeholderProps} />
        }}
        className="p-3 flex-grow md:max-h-screen overflow-y-auto"
      />
      <Portal>
        {isBN && (
          <Suggestion
            suggestionState={suggestionState}
            suggestionDispatch={suggestionDispatch}
            inputStart={inputStartRef.current}
            avro={avro}
          />
        )}
      </Portal>
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
    ReactEditor.focus(editor)
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
