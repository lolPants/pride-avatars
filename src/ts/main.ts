import { angle, input, padding } from './input'
import { render } from './render'
import { state } from './state'

input.addEventListener(
  'change',
  () => {
    const file = input && input.files && input.files[0]
    if (!file) return

    const img = new Image()
    img.src = URL.createObjectURL(file)
    state.image = img
  },
  false
)

padding.addEventListener('input', () => {
  state.padding = parseInt(padding.value, 10)
})

angle.addEventListener('input', () => {
  state.angle = parseInt(angle.value, 10)
})

state.addListener('changed', () => render())