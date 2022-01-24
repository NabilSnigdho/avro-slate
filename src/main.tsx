import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import initOkkhor from 'okkhor'
import { initHorizontalSwipeEvents } from './horizontal-swipe-event'

await initOkkhor()
initHorizontalSwipeEvents({ excludedSelectors: 'label, button, a' })
export const root = document.getElementById('root')

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  root
)
