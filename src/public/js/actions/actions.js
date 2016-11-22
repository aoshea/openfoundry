export const setFontSize = (font) => ({
  type: 'UPDATE_SIZE',
  id: font.id,
  value: font.value
})

export const setFontLeading = (font) => ({
  type: 'UPDATE_LEADING',
  id: font.id,
  value: font.value
})

export const setFontTracking = (font) => ({
  type: 'UPDATE_TRACKING',
  id: font.id,
  value: font.value
})

export const setFontTransform = (font) => ({
  type: 'UPDATE_TRANSFORM',
  id: font.id,
  value: font.value
})

export const setFontColour = (font) => ({
  type: 'UPDATE_COLOUR',
  id: font.id,
  value: font.value
})

export const setFontBackground = (font) => ({
  type: 'UPDATE_BACKGROUND',
  id: font.id,
  value: font.value
})