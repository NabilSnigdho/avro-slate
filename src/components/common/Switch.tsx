import React, { FC } from 'react'

const Switch: FC<{
  checked: boolean
  onChange: () => void
  className?: string
}> = ({ checked, onChange, children, ...props }) => {
  return (
    <label {...props}>
      <input
        type="checkbox"
        className="w-0 h-0 opacity-0 absolute"
        defaultChecked={checked}
        onChange={onChange}
      />
      {children}
    </label>
  )
}

export default Switch
