const fontManager = require('font-manager')

const fonts = fontManager
  .getAvailableFontsSync()
  .sort((a, b) => {
    if (a.family > b.family) {
      return 1
    } else if (b.family > a.family) {
      return -1
    }
    return 0
  })

const formatName = (font) => (font.family + ' - ' + font.style)

exports.fonts = fonts
exports.formatName = formatName
