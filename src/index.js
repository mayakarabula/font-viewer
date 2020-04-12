const fs = require('fs')
const spawn = require('child_process').spawn
const termkit = require( 'terminal-kit' )
const clipboardy = require('clipboardy')
const md5 = require('md5')

const { generateImage } = require('./generateImage')
const { fonts, formatName } = require('./fontsList')
const { screen, searchText, list } = require('./ui')

let searchPhrase = ''
let searching = false
let filtered = fonts
let selected = null

var term = termkit.terminal

if (!fs.existsSync('./previews')){
    fs.mkdirSync('previews')
}

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
    if (selected) {
      clipboardy.writeSync(filtered[selected].family)
    }
  }
})

list.on('select', function(el, selectedIndex) {
  selected = selectedIndex
  printFont(selectedIndex)
})

const printFont = (fontIndex) => {
  const font = filtered[fontIndex]
  
  const text = `The quick brown fox
jumps over the lazy dog
1 2 3 4 5 6 7 8 9 0
! @ # $ % ^ & * ( )`
// \uE0A0 \uE0A2 \uE0B0`

  const hash = md5(font.family + font.style + text)
  const path = `./previews/${hash}.png` 
  
  try {
    if (fs.existsSync(path)) {
      readFile(path)
    } else {
      generateImage(font, text, path, () => readFile(path))
    }
  } catch(err) {
  }
}

const readFile = (path) => {
  const COLUMNS = process.stdout.columns
  const margin = COLUMNS * 0.65 | 0

  const ls = spawn('imgcat', [path])

  let output = ''

  ls.stdout.on('data', (data) => {
    output += data.toString()
  })
  
  ls.stderr.on('data', (error) => {
    console.log({ error: error.toString() })
  })

  ls.on('close', (code) => {
    if (code === 0) {
      term.moveTo(margin, 10)
      term(output)
    }
    list.focus()
  })
}

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
})

list.focus()

screen.render()

