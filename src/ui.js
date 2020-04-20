import blessed from 'blessed'
import { fonts } from './fontsList'
import { formatFontName } from './utils'

export const screen = blessed.screen({
  smartCSR: true
})

const leftPane = blessed.box({
  top: 'center',
  left: '5%',
  width: '40%',
  height: '90%',
  border: {
    type: 'line'
  }
})

export const list = blessed.list({
  top: 0,
  left: 0,
  style: {
    selected: {
      bg: '#f0f0f0',
      fg: '#333'
    }
  },
  items: fonts.map(formatFontName),
  interactive: true,
  mouse: true,
  keys: true
});

export const searchText = blessed.text({
  top: 0,
  right: 0,
  content: ''
})

const instructions = blessed.text({
  bottom: 1,
  left: 1,
  content: 'Use arrows to browse the list. Use return to select a font. Use / to search.'
})

screen.append(instructions)

// Append our box to the screen.
screen.append(leftPane)

leftPane.append(list)
leftPane.append(searchText)

