import type { State } from '~components/app/Store'
import { getFlag } from '~lib/flags'

interface DrawOptions {
  x: number
  y: number

  w: number
  h: number

  offsetX: number
  offsetY: number
}

export const drawFrame = async (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  state: State
) => {
  const defaultOptions: DrawOptions = {
    x: 0,
    y: 0,
    w: ctx.canvas.width,
    h: ctx.canvas.height,
    offsetX: 0.5,
    offsetY: 0.5,
  }

  const drawImage = async (
    input: HTMLImageElement | string,
    options: Partial<DrawOptions>
  ) => {
    const { x, y, w, h, offsetX, offsetY } = { ...defaultOptions, ...options }

    let img: HTMLImageElement
    if (typeof input === 'string') {
      img = new Image()
      img.src = input
    } else {
      img = input
    }

    if (img.complete === false) {
      await new Promise<void>(resolve => {
        img.addEventListener('load', () => {
          resolve()
        })
      })
    }

    const iw = img.width
    const ih = img.height
    const r = Math.min(w / iw, h / ih)
    let nw = iw * r
    let nh = ih * r
    let cx
    let cy
    let cw
    let ch
    let ar = 1

    if (nw < w) ar = w / nw
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh
    nw *= ar
    nh *= ar

    cw = iw / (nw / w)
    ch = ih / (nh / h)

    cx = (iw - cw) * Math.max(0, Math.min(1, offsetX))
    cy = (ih - ch) * Math.max(0, Math.min(1, offsetY))

    if (cx < 0) cx = 0
    if (cy < 0) cy = 0
    if (cw > iw) cw = iw
    if (ch > ih) ch = ih

    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h)
  }

  ctx.save()

  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((Math.PI / 180) * state.angle)

  const scale = Math.abs(state.angle) / 50 + 1.01
  ctx.scale(scale, scale)

  const flagImage = getFlag(state.flag)
  if (flagImage.complete === false) {
    await new Promise<void>(resolve => {
      flagImage.addEventListener('load', () => {
        resolve()
      })
    })
  }

  ctx.drawImage(
    flagImage,
    (canvas.width / 2) * -1,
    (canvas.height / 2) * -1,
    canvas.width,
    canvas.height
  )

  ctx.restore()

  if (state.image) {
    ctx.save()

    ctx.beginPath()
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      canvas.height / 2 - state.padding,
      0,
      Math.PI * 2,
      true
    )

    ctx.closePath()
    ctx.clip()

    ctx.translate(canvas.width / 2, canvas.height / 2)
    await drawImage(state.image, {
      x: (canvas.width / 2) * -1 + state.padding,
      y: (canvas.height / 2) * -1 + state.padding,
      w: canvas.width - state.padding * 2,
      h: canvas.height - state.padding * 2,
    })

    ctx.restore()
  }
}