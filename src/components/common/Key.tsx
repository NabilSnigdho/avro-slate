import React, { FC } from 'react'

const Key: FC = ({ children }) => (
  <kbd className="font-bold ring-1 ring-black dark:ring-white px-1.5 py-px rounded-md text-sm">
    {children}
  </kbd>
)

export const CtrlKey: FC = () => (
  <Key>
    <abbr title="Control" className="!no-underline">
      Ctrl
    </abbr>
  </Key>
)

export default Key
