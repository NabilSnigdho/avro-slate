import React, { FC, Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { usePopper } from 'react-popper'
import { Keyboard32 } from '@carbon/icons-react'
import Key, { CtrlKey } from './common/Key'

const KeyboardShortcuts: FC = () => {
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null)
  const [popperTooltipElement, setPopperTooltipElement] =
    useState<HTMLDivElement | null>(null)
  const { styles, attributes } = usePopper(
    referenceElement,
    popperTooltipElement
  )

  return (
    <Popover as={Fragment}>
      <Popover.Button
        ref={setReferenceElement}
        className="<md:hidden inline-flex items-center"
      >
        <span className="sr-only">keyboard shortcuts</span>
        <Keyboard32 className="w-8 h-8" />
      </Popover.Button>
      <Transition
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel
          ref={setPopperTooltipElement}
          style={styles.popper}
          {...attributes.popper}
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
      </Transition>
    </Popover>
  )
}

export default React.memo(KeyboardShortcuts)
