import React from 'react'

const Key = ({ children }: { children: React.ReactChild }) => (
  <kbd className="font-bold ring-1 ring-black dark:ring-white px-1.5 py-px rounded-md text-sm">
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
