/**
 * @see https://github.com/john-doherty/swiped-events
 * @see https://stackoverflow.com/questions/16348031/disable-scrolling-when-touch-moving-certain-element
 */

export const initHorizontalSwipeEvents = ({
  excludedSelectors = '[data-ignore-swipe]',
  swipeThreshold = 75, // default 75px
  swipeTimeout = 500, // default 500ms
}) => {
  let data: {
    startEl: Element
    timeDown: number
    xDown: number
  } | null = null

  const handleTouchEnd = (event: TouchEvent) => {
    if (data === null) return
    const { startEl, timeDown, xDown } = data

    if (startEl !== event.target) return

    if (
      Math.abs(event.changedTouches[0].screenX - xDown) > swipeThreshold &&
      Date.now() - timeDown < swipeTimeout
    ) {
      startEl.dispatchEvent(
        new CustomEvent('horizontalswipe', {
          bubbles: true,
          cancelable: true,
        })
      )
    }

    // reset data
    data = null
  }

  const handleTouchStart = (event: TouchEvent) => {
    if (data !== null) return
    const { target } = event
    if (!(target instanceof Element) || parentsMatch(target, excludedSelectors))
      return

    data = {
      startEl: target,
      timeDown: Date.now(),
      xDown: event.targetTouches[0].screenX,
    }
  }

  document.addEventListener('touchstart', handleTouchStart)
  document.addEventListener('touchend', handleTouchEnd)
}

const parentsMatch = (el: Element | null, selectors: string) => {
  while (el && el !== document.documentElement) {
    if (el.matches(selectors)) {
      return true
    }
    el = el.parentElement
  }
  return false
}
