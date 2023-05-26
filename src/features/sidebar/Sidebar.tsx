import { useAppSelector } from '@/app/hooks'
import { cls } from '@/common/cls'
import { Drafts } from '@/features/drafts/Drafts'
import { selectSelectedTab } from '@/features/panel/panelSlice'
import { Footer } from './Footer'
import { KeyboardShortcuts } from './KeyboardShortcuts'

export const Sidebar = () => {
  const selectedTab = useAppSelector(selectSelectedTab)

  return (
    <aside
      className={cls(
        'p-3 md:w-[16.25rem] flex flex-col flex-shrink-0 gap-y-5 bg-gray-100 dark:bg-dark-300',
        ['keyboard', 'avro-layout'].includes(selectedTab) && 'lt-md:hidden'
      )}
    >
      <Drafts />
      <KeyboardShortcuts />
      <Footer />
    </aside>
  )
}
