import fontManager from 'font-manager'
import formatFontName from './utils'

const sortByFontFamily = (fonts) =>
  (a, b) => {
    if (a.family > b.family) {
      return 1
    } else if (b.family > a.family) {
      return -1
    }
    return 0
  }

export const fonts = fontManager
  .getAvailableFontsSync()
  .sort(sortByFontFamily)

