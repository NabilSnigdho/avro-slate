/**
 * https://javascript.plainenglish.io/light-and-dark-mode-in-react-web-application-with-tailwind-css-89674496b942
 */

export const isDarkMode = (): boolean => {
  const storedPrefs = localStorage.getItem('color-scheme')
  if (storedPrefs !== null) {
    return storedPrefs === 'dark'
  }
  return matchMedia('(prefers-color-scheme: dark)').matches
}

export const setColorScheme = (isDark: boolean) => {
  window.document.documentElement.classList.toggle('dark', isDark)
  localStorage.setItem('color-scheme', isDark ? 'dark' : 'light')
}
