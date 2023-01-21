import { useCallback, useState } from 'react'
import SimpleKeyboard from 'react-simple-keyboard'
import './keyboard-dark.css'
import './keyboard.css'

export const Keyboard = () => {
  const [layoutName, setLayoutName] = useState('default')

  const onKeyPress = useCallback(
    (button: string) => {
      if (button === '{shift}') {
        setLayoutName(layoutName === 'default' ? 'shift' : 'default')
      } else if (button === '{numbers}' || button === '{abc}') {
        setLayoutName(layoutName !== 'numbers' ? 'numbers' : 'default')
      } else if (button === '{alt}') {
        setLayoutName('alt')
      } else {
        window.dispatchEvent(
          new CustomEvent('virtual-keypress', { detail: button })
        )
        if (layoutName === 'shift' && button !== '{shift}') {
          setLayoutName('default')
        }
      }
    },
    [layoutName]
  )

  return (
    <SimpleKeyboard
      layoutName={layoutName}
      layout={{
        default: [
          '` ! ? \u2010 " \' : ; ( )',
          'q w e r t y u i o p',
          'a s d f g h j k l',
          '{shift} z x c v b n m {backspace}',
          '{numbers} , {space} . {enter}',
        ],
        shift: [
          '` ! ? \u2010 " \' : ; ( )',
          'Q W E R T Y U I O P',
          'A S D F G H J K L',
          '{shift} Z X C V B N M {backspace}',
          '{numbers} , {space} . {enter}',
        ],
        numbers: [
          '` ! ? \u2010 " \' : ; ( )',
          '1 2 3 4 5 6 7 8 9 0',
          '@ # $ % & * \u2212 + ÷ \u00D7',
          '{alt} ✓ ✗ § ← ↑ → ↓ {backspace}',
          '{abc} , {space} . {enter}',
        ],
        alt: [
          '` ! ? \u2010 " \' : ; ( )',
          '~ | ∙ √ ∛ ∑ ∏ ∴ { }',
          '= ≈ ≤ ≥ ° ^ _ ± [ ]',
          '{numbers} ™ ® © ≠ \\ < > {backspace}',
          '{abc} , {space} . {enter}',
        ],
      }}
      display={{
        '{numbers}': '?123',
        '{abc}': 'ABC',
        '{alt}': 'ALT',
        '{enter}': '⏎',
        '{backspace}': '⌫',
        '{shift}': '⇧',
        '{space}': '⎵',
      }}
      theme="hg-theme-default text-2xl"
      mergeDisplay={true}
      onKeyPress={onKeyPress}
    />
  )
}
