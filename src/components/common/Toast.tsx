import React, { FC } from 'react'
import Portal from './Portal'

const Toast: FC<{ text: string }> = ({ children, text }) => (
  <Portal>
    <div className="fixed bottom-0 right-0 m-4 p-3 border rounded-sm shadow-md bg-white">
      <div className="mb-2">{text}</div>
      <div className='inline-flex gap-2'>{children}</div>
    </div>
  </Portal>
)

export const Button: FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => (
  <button
    type="button"
    {...props}
    className="px-2 py-px rounded-sm bg-light-400 hover:bg-light-300 border border-light-900"
  >
    {children}
  </button>
)

export default Toast
