import fs from 'fs'
import { createCanvas, registerFont } from 'canvas'
import { spawn } from 'child_process'
import termkit from 'terminal-kit'
import { 
  getImageSize,
  getImageMargin,
  getImagePreviewProcess
} from './utils'

const putText = (text, fontSize, ctx) => {
  const lines = text.split('\n')
  const fontSpacing = fontSize * 2.5
  const middlePos = getImageSize() / 2 | 0
  const topStart = middlePos - (fontSpacing * lines.length / 2 | 0)

  lines.map(
    (line, index) => ctx.fillText(
      line,
      middlePos,
      topStart + (index * fontSpacing)
    )
  )
}

const createImageCanvas = (text, font) => {
  const size = getImageSize()
  const img = createCanvas(size, size)
  const ctx = img.getContext('2d');

  ctx.fillStyle = '#282A36'
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = '#fff'
  ctx.textAlign = "center"

  let fontSize = size / 30 | 0
  fontSize = fontSize < 20 ? 20 : fontSize
  ctx.font = `${fontSize}pt '${font.family}'`

  putText(text, fontSize, ctx)

  return img
}

const writeImageToFile = (path, img, cb) => {
  const out = fs.createWriteStream(path)
  const stream = img.createPNGStream()
  stream.pipe(out)
  out.on('finish', () => cb())
}

export const generateImage = (font, text, path, cb) => {
  registerFont(font.path, { family: font.family })
  const img = createImageCanvas(text, font)
  writeImageToFile(path, img, cb)
}

const term = termkit.terminal

export const printImage = (path) => {
  const margin = getImageMargin()
  const ls = spawn(getImagePreviewProcess(), [path])

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
  })
}
