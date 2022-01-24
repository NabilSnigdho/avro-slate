import React, { FC } from 'react'

import { useRegisterSW } from 'virtual:pwa-register/react'
import useConstant from 'use-constant'
import Toast, { Button } from './common/Toast'

const ReloadPrompt: FC = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = useConstant(() => () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  })

  return offlineReady ? (
    <Toast text="App ready to work offline">
      <Button onClick={close}>Close</Button>
    </Toast>
  ) : needRefresh ? (
    <Toast text="New content available, click on reload button to update.">
      <Button onClick={() => updateServiceWorker(true)}>Reload</Button>
      <Button onClick={close}>Close</Button>
    </Toast>
  ) : null
}

export default React.memo(ReloadPrompt)
