import { useAppSelector } from '@/app/hooks'
import { cls } from '@/common/cls'
import { selectSelectedTab } from '@/features/panel/panelSlice'
import { GoMarkGithub } from 'react-icons/go'

export const Footer = () => {
  const selectedTab = useAppSelector(selectSelectedTab)

  return (
    <footer
      className={cls('flex gap-3', selectedTab === 'hide' || 'lt-md:hidden')}
    >
      <span className="inline-flex items-center gap-x-2">
        <img
          alt="avro slate logo"
          src={import.meta.env.BASE_URL + 'favicon.svg'}
          className="w-8 h-8"
        />
        Avro Slate
      </span>
      <a
        href="https://github.com/NabilSnigdho/avro-slate"
        className="ml-auto inline-flex items-center gap-x-2"
      >
        <GoMarkGithub className="w-8 h-8" />
        <span className="sr-only">Source Code</span>
      </a>
    </footer>
  )
}
