import fs from 'fs'
import { spawn } from 'child_process'
import md5 from 'md5'
import clipboardy from 'clipboardy'
import { 
  generateImage,
  printImage
} from './image'
import { fonts } from './fontsList'
import { 
  formatFontName,
  getImageSize
} from './utils'
import { screen, searchText, list } from './ui'
import { text } from './constants'

let searchPhrase = ''
let searching = false
let filtered = fonts
let selected = null

if (!fs.existsSync('./previews')){
    fs.mkdirSync('previews')
}

const searchInList = () => {
  let index = 0
  const phrase = new RegExp(searchPhrase, 'i')

  filtered = fonts.filter(
    (font) => phrase.test(formatFontName(font))
  )

  list.setItems(filtered.map(formatFontName))
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
  const hash = md5(font.family + font.style + text + getImageSize())
  const path = `./previews/${hash}.png` 
  
  try {
    if (fs.existsSync(path)) {
      printImage(path)
    } else {
      generateImage(font, text, path, () => printImage(path))
    }
  } catch(err) {
    console.log({ err })
  }
}

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
})

list.focus()

screen.render()

