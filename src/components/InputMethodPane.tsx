import { Switch } from '@headlessui/react'
import React, { FC } from 'react'
import { SettingsState } from '../reducers/settings'
import Key, { CtrlKey } from './common/Key'

const InputMethodPane: FC<{
  settings: SettingsState
  toggleLanguage: () => void
}> = ({ settings: { isBN }, toggleLanguage }) => {
  const transitionCommon = 'duration-150 ease-in'
  return (
    <div className="flex justify-between">
      <span className="<md:hidden">
        <CtrlKey /> + <Key>.</Key>
      </span>
      <span className="text-gray-600 dark:text-gray-300 md:hidden">Swipe anywhere to switch</span>

      <Switch
        checked={isBN}
        onChange={toggleLanguage}
        className={`inline-flex items-center font-mono text-sm p-px focusable !focus-visible:ring-blue-500${
          isBN ? ' bg-dark-900 text-white dark:(bg-white text-dark-300)' : ''
        } cursor-pointer select-none ring-1 ring-current rounded-full transition-colors ${transitionCommon}`}
      >
        <span
          className={`w-5 h-5 mx-px rounded-full bg-current relative ${transitionCommon}`}
          style={{
            transitionProperty: 'left, background-color',
            left: isBN ? 'calc(100% - 22px)' : 0,
          }}
          aria-hidden="true"
        ></span>
        <span
          className={`uppercase px-2 relative ${transitionCommon}`}
          style={{
            transitionProperty: 'right, color',
            right: isBN ? '22px' : 0,
          }}
        >
          {isBN ? 'bn' : 'en'}
        </span>
      </Switch>
    </div>
  )
}

export default React.memo(InputMethodPane)
