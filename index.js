const fontManager = require('font-manager')
const fs = require('fs')
const blessed = require('neo-blessed')
const spawn = require('child_process').spawn
const term = require( 'terminal-kit' ).terminal
const { generateImage } = require('./generateImage')

var screen = blessed.screen({
  smartCSR: true
})

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

const leftPane = blessed.box({
  top: 'center',
  left: '5%',
  width: '40%',
  height: '90%',
  border: {
    type: 'line'
  }
})

var list = blessed.list({
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

let searchPhrase = ''
let searching = false
let filtered = fonts

const searchInList = () => {
  let index = 0
  const phrase = new RegExp(searchPhrase, 'i')

  filtered = fonts.filter(
    (font) => phrase.test(formatName(font))
  ) 

  list.setItems(filtered.map(formatName))
  screen.render()
}

process.stdin.on('keypress', (str, event) => {
  const key = event && event.name || str

  if (searching && key) {
    if (key === '/') {
      searching = false
      searchPhrase = ''
      searchText.content = ''
      screen.render()
    } else if (key === 'backspace') {
      searchPhrase = searchPhrase.substring(0, searchPhrase.length - 1)
      searchText.content = 'search: ' + searchPhrase
      screen.render()
    } else if (key.length === 1) {
      searchPhrase += key
      searchText.content = 'search: ' + searchPhrase
      screen.render()
    }
    
    searchInList()
  } else {
    if (key === '/') {
      searching = true
      searchText.content = 'search: ' 
      screen.render()
    }
  }

  if (!searching && key === 'y') {

  }
})

list.on('select', function(el, selectedIndex) {
  printFont(selectedIndex)
})

// Append our box to the screen.
screen.append(leftPane)

leftPane.append(list)
leftPane.append(searchText)

const printFont = (fontIndex) => {
  const font = filtered[fontIndex]
  const COLUMNS = process.stdout.columns
  const margin = COLUMNS * 0.65 | 0
  
  const text = `The quick brown fox
jumps over the lazy dog
1 2 3 4 5 6 7 8 9 0
! @ # $ % ^ & * ( )`
// \uE0A0 \uE0A2 \uE0B0`

  generateImage(font, text, () => {
    const ls = spawn('imgcat', ['out.png'])

    let s = ''

    ls.stdout.on('data', (data) => {
      s += data.toString()
    })
    ls.on('close', (code) => {
      if (code === 0) {
        term.moveTo(margin, 10)
        term(s)
      }
      list.focus()
    })
  })
}

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
})

list.focus()

screen.render()
