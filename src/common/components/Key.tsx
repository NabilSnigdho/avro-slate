import React from 'react'

const Key = ({ children }: { children: string | React.ReactElement }) => (
  <kbd className="ring-1 ring-black dark:ring-white px-1.5 py-px rounded-sm text-sm">
    {children}
  </kbd>
)

export const CtrlKey = () => (
  <Key>
    <abbr title="Control" className="!no-underline">
      Ctrl
    </abbr>
  </Key>
)

export default Key
