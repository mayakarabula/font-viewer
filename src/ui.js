const blessed = require('blessed')
const { fonts, formatName } = require('./fontsList')

const screen = blessed.screen({
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

const list = blessed.list({
  top: 0,
  left: 0,
  border: {
    // type: 'line'
  },
  style: {
    selected: {
      bg: '#f0f0f0',
      fg: '#333'
    }
  },
  items: fonts.map(formatName),
  interactive: true,
  // vi: true,
  mouse: true,
  keys: true
});

const searchText = blessed.text({
  top: 0,
  right: 0,
  content: '',
  style: {
    // bg: '#000',
    // fg: '#fff'
  }
})

// Append our box to the screen.
screen.append(leftPane)

leftPane.append(list)
leftPane.append(searchText)

exports.screen = screen
exports.list = list
exports.searchText = searchText
