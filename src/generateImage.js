const fs = require('fs')
const { createCanvas, registerFont } = require('canvas')

const generateImage = (font, text, cb) => {
  const COLUMNS = process.stdout.columns
  const margin = COLUMNS * 0.65 | 0

  registerFont(font.path, { family: font.family })
    const size = (COLUMNS * 0.4 | 0) * 10
    var img = createCanvas(size, size)
    var ctx = img.getContext('2d');

    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = '#fff'
    ctx.textAlign = "center"

    let fontSize = size / 30
    fontSize = fontSize < 20 ? 20 : fontSize

    ctx.font = `${fontSize}pt '${font.family}'`

    const lines = text.split('\n')
    const fontSpacing = fontSize * 2.5
    const middlePos = size/2|0
    const topStart = middlePos - (fontSpacing * lines.length/2|0)

    lines.map(
      (line, index) => ctx.fillText(
        line,
        middlePos,
        topStart + (index * fontSpacing)
      )
    )

    const out = fs.createWriteStream('out.png')
    const stream = img.createPNGStream()
    stream.pipe(out)
    out.on('finish', () => cb())
}

exports.generateImage = generateImage

