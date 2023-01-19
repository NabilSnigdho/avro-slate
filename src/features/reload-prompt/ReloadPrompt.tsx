import React from 'react'

import { useRegisterSW } from 'virtual:pwa-register/react'
import useConstant from 'use-constant'
import Toast from '@/common/components/Toast'

const ReloadPrompt = () => {
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
      <button className="button" onClick={close}>
        Close
      </button>
    </Toast>
  ) : needRefresh ? (
    <Toast text="New content available, click on reload button to update.">
      <Button onClick={() => updateServiceWorker(true)}>Reload</Button>
      <Button onClick={close}>Close</Button>
    </Toast>
  ) : null
}

const Button = (
  {
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>
) => <button type="button" {...props} className="button">
  {children}
</button>

export default React.memo(ReloadPrompt)
