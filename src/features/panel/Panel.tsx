import { useAppSelector } from '@/app/hooks'
import { AvroLayout } from './AvroLayout'
import { BottomBar } from './BottomBar'
import { Keyboard } from './Keyboard'
import { selectSelectedTab } from './panelSlice'

export const Panel = () => {
  const selectedTab = useAppSelector(selectSelectedTab)

  return (
    <div>
      <BottomBar />
      {selectedTab === 'keyboard' && <Keyboard />}
      {selectedTab === 'avro-layout' && <AvroLayout />}
    </div>
  )
}
