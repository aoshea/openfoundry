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