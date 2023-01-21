import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { cls } from '@/common/cls'
import { setColorScheme } from '@/common/dark-mode'
import {
  selectIsBN,
  selectIsDarkMode,
  setIsBN,
  setIsDarkMode,
  toggleAvro,
} from '@/features/settings/settingsSlice'
import { RadioGroup, Switch } from '@headlessui/react'
import { useCallback, useEffect } from 'react'
import type { IconType } from 'react-icons'
import {
  BsChevronDown,
  BsFilesAlt,
  BsKeyboard,
  BsQuestionSquare,
} from 'react-icons/bs'
import { FiMoon, FiSun } from 'react-icons/fi'
import useConstant from 'use-constant'
import { selectSelectedTab, setSelectedTab } from './panelSlice'

const Tab = ({
  name,
  icon: Icon,
  className,
}: {
  name: string
  icon: IconType
  className?: string
}) => {
  return (
    <RadioGroup.Option value={name} className={cls('inline-flex', className)}>
      {({ checked }) => (
        <div
          className={cls(
            'px-2 py-1 inline-flex items-center cursor-pointer',
            checked ? 'item-active' : 'item-hoverable'
          )}
        >
          <span className="sr-only">{name}</span>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </RadioGroup.Option>
  )
}

export const BottomBar = () => {
  const dispatch = useAppDispatch()

  const selectedTab = useAppSelector(selectSelectedTab)
  const handleTabChange = useCallback(
    (tab: string) => {
      dispatch(setSelectedTab(tab))
    },
    [dispatch, setSelectedTab]
  )

  const isBN = useAppSelector(selectIsBN)
  const dispatchSetIsBN = useConstant(
    () => (isBN: boolean) => dispatch(setIsBN(isBN))
  )
  const dispatchToggleAvro = useConstant(() => () => {
    dispatch(toggleAvro())
  })
  const keyboardToggleAvro = useConstant(() => (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === '.') {
      event.preventDefault()
      dispatchToggleAvro()
    }
  })
  useEffect(() => {
    document.addEventListener('keydown', keyboardToggleAvro)
    document.addEventListener('horizontal-swipe', dispatchToggleAvro)
    return () => {
      document.removeEventListener('keydown', keyboardToggleAvro)
      document.removeEventListener('horizontal-swipe', dispatchToggleAvro)
    }
  }, [dispatchToggleAvro, keyboardToggleAvro])

  const isDarkMode = useAppSelector(selectIsDarkMode)
  const dispatchIsDarkMode = useConstant(
    () => (isDarkMode: boolean) => dispatch(setIsDarkMode(isDarkMode))
  )
  useEffect(() => {
    setColorScheme(isDarkMode)
  }, [isDarkMode])

  return (
    <div className="flex bg-blue-gray-100 dark:bg-dark-100">
      <RadioGroup
        value={selectedTab}
        onChange={handleTabChange}
        className="mr-auto flex"
      >
        {selectedTab !== 'hide' && (
          <Tab
            name="hide"
            icon={BsChevronDown}
            className={cls(selectedTab === 'drafts' && 'md:hidden')}
          />
        )}
        <Tab name="keyboard" icon={BsKeyboard} />
        <Tab name="avro-layout" icon={BsQuestionSquare} />
        <Tab name="drafts" icon={BsFilesAlt} className="md:hidden" />
      </RadioGroup>
      <Switch
        className="px-2 py-1 item-hoverable"
        checked={isBN}
        onChange={dispatchSetIsBN}
      >
        {isBN ? (
          <span className="flex items-center gap-x-2">
            <img
              className="w-6 h-6"
              src={import.meta.env.BASE_URL + 'avro-icon.webp'}
              alt="avro icon"
            />{' '}
            অভ্র
          </span>
        ) : (
          'EN'
        )}
      </Switch>
      <Switch
        checked={isDarkMode}
        onChange={dispatchIsDarkMode}
        className="px-2 py-1 inline-flex items-center item-hoverable"
      >
        <span className="sr-only">toggle dark-mode</span>
        {isDarkMode ? (
          <FiMoon className="w-6 h-6" />
        ) : (
          <FiSun className="w-6 h-6" />
        )}
      </Switch>
    </div>
  )
}
