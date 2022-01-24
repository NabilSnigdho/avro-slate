import React, { FC } from 'react'

const Key: FC = ({ children }) => (
  <kbd className="border border-gray-300 px-1.5 py-px rounded-md text-gray-600 text-sm">
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
