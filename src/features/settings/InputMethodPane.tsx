import React, { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectIsBN, setIsBN, toggleLanguage } from './settingsSlice'

import { Switch } from '@headlessui/react'
import Key, { CtrlKey } from '../../common/components/Key'
import useConstant from 'use-constant'

const InputMethodPane = () => {
  const isBN = useAppSelector(selectIsBN)
  const dispatch = useAppDispatch()

  const dispatchSetIsBN = useConstant(
    () => (isBN: boolean) => dispatch(setIsBN(isBN))
  )
  const dispatchToggleLang = useConstant(() => () => {
    dispatch(toggleLanguage())
  })
  const keyboardToggleLang = useConstant(() => (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === '.') {
      event.preventDefault()
      dispatchToggleLang()
    }
  })

  useEffect(() => {
    document.addEventListener('keydown', keyboardToggleLang)
    document.addEventListener('horizontal-swipe', dispatchToggleLang)
    return () => {
      document.removeEventListener('keydown', keyboardToggleLang)
      document.removeEventListener('horizontal-swipe', dispatchToggleLang)
    }
  }, [dispatchToggleLang, keyboardToggleLang])

  const transitionCommon = 'duration-150 ease-in'
  return (
    <div className="flex justify-between">
      <span className="<md:hidden">
        <CtrlKey /> + <Key>.</Key>
      </span>
      <span className="text-gray-600 dark:text-gray-300 md:hidden">
        Swipe anywhere to switch
      </span>

      <Switch
        checked={isBN}
        onChange={dispatchSetIsBN}
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
