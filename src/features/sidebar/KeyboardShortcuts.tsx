import React from 'react'
import Key, { CtrlKey } from '@/common/components/Key'

export const KeyboardShortcuts = React.memo(function KeyboardShortcuts() {
  return (
    <section className="lt-md:hidden">
      <h1 className="text-lg uppercase mb-2">Keyboard Shortcuts</h1>
      <dl className="text-sm grid grid-cols-[1fr_auto] gap-x-3 gap-y-2">
        <dt>Toggle Avro</dt>
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
    </section>
  )
})
