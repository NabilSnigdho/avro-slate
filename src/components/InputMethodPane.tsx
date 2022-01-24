import React, { FC } from 'react'
import { SettingsState } from '../reducers/settings'
import Key, { CtrlKey } from './common/Key'
import Switch from './common/Switch'

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
      <span className="text-gray-600 md:hidden">Swipe anywhere to switch</span>

      <Switch
        checked={isBN}
        onChange={toggleLanguage}
        className={`inline-flex items-center font-mono text-sm p-px${
          isBN ? ' bg-gray-900 text-white' : ''
        } cursor-pointer select-none border border-gray-900 rounded-full transition-colors ${transitionCommon}`}
      >
        <span className="sr-only">Switch Input Language</span>
        <span
          className={`w-5 h-5 rounded-full${
            isBN ? ' bg-white' : ' bg-gray-900'
          } relative ${transitionCommon}`}
          style={{
            transitionProperty: 'left, background-color',
            left: isBN ? 'calc(100% - 1.25rem)' : 0,
          }}
          aria-hidden="true"
        ></span>
        <span
          className={`uppercase px-2 relative ${transitionCommon}`}
          style={{
            transitionProperty: 'right, color',
            right: isBN ? '1.25rem' : 0,
          }}
        >
          {isBN ? 'bn' : 'en'}
        </span>
      </Switch>
    </div>
  )
}

export default React.memo(InputMethodPane)
