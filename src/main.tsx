import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import store from './app/store'
import { Provider } from 'react-redux'
import { initHorizontalSwipeEvents } from './common/horizontal-swipe-event'
import { fetchDrafts } from './features/drafts/draftsAPI'

const container = document.getElementById('app')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)

initHorizontalSwipeEvents({ excludedSelectors: 'label, button, a' })
store.dispatch(fetchDrafts())
