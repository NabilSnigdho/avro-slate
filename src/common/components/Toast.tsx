import React from 'react'
import { Portal } from '@headlessui/react'

const Toast = ({
  children,
  text,
}: {
  children: React.ReactNode
  text: string
}) => (
  <Portal>
    <div className="fixed bottom-0 right-0 m-4 p-3 popper">
      <div className="mb-2">{text}</div>
      <div className="inline-flex gap-2">{children}</div>
    </div>
  </Portal>
)

export default Toast
