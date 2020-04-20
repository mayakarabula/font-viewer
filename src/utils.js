import {
  IMAGE_MARGIN_PERCENTAGE,
  IMAGE_WIDTH_PERCENTAGE,
  IMAGE_WIDTH_SCALE,
  IMAGE_PREVIEW_PROCESS,
  IMAGE_PREVIEW_DEFAULT
} from './constants'

export const getColumnWidth = () => process.stdout.columns

export const getImageSize = () => (getColumnWidth() * IMAGE_WIDTH_PERCENTAGE | 0) * IMAGE_WIDTH_SCALE

export const getImageMargin = () => getColumnWidth() * IMAGE_MARGIN_PERCENTAGE | 0 

export const formatFontName = (font) => (font.family + ' - ' + font.style)

export const getImagePreviewProcess = () =>
  process.env[IMAGE_PREVIEW_PROCESS] || IMAGE_PREVIEW_DEFAULT 
