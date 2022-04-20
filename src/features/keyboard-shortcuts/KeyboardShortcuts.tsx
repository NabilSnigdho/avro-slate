import React, { Fragment } from 'react'
import { Popover, Portal } from '@headlessui/react'
import { useFloating, autoPlacement, offset } from '@floating-ui/react-dom'
import { BsKeyboard } from 'react-icons/bs'
import Key, { CtrlKey } from '../../common/components/Key'

const KeyboardShortcuts = () => {
  const { x, y, reference, floating, strategy } = useFloating({
    middleware: [autoPlacement(), offset(12)],
  })
  return (
    <Popover as={Fragment}>
      <Popover.Button
        ref={reference}
        className="<md:hidden inline-flex items-center"
      >
        <span className="sr-only">keyboard shortcuts</span>
        <BsKeyboard className="w-8 h-8" />
      </Popover.Button>
      <Portal>
          <Popover.Panel
            ref={floating}
            style={{
              position: strategy,
              top: y ?? '',
              left: x ?? '',
            }}
            className="p-3 popper"
          >
            <h1 className="text-lg uppercase mb-2">Keyboard Shortcuts</h1>
            <dl className="text-sm grid grid-cols-[1fr,auto] gap-x-3 gap-y-2">
              <dt>Toggle Language</dt>
              <dd>
                <CtrlKey /> + <Key>.</Key>
              </dd>
              <dt>Next Candidate</dt>
              <dd>
                <CtrlKey /> + <Key>n</Key>
              </dd>
              <dt>Previous Candidate</dt>
              <dd>
                <CtrlKey /> + <Key>p</Key>
              </dd>
            </dl>
          </Popover.Panel>
      </Portal>
    </Popover>
  )
}

export default React.memo(KeyboardShortcuts)
