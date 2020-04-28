import fontManager from 'font-manager'
import { formatFontName } from  './utils'

export const sortFormattedNames = (a, b) => {
  const nameA = formatFontName(a)
  const nameB = formatFontName(b)

  if (nameA > nameB) {
    return 1
  } else if (nameB > nameA) {
    return -1
  }
  return 0
}

export const fonts = fontManager
  .getAvailableFontsSync()
  .sort(sortFormattedNames)

