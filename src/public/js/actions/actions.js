const requestAddLike = (font) => ({
  type: 'REQUEST_ADD_LIKE',
  id: font.id
})

const successAddLike = (font) => ({
  type: 'SUCCESS_ADD_LIKE',
  id: font.id
})

export const addLike = (font) => (dispatch) => {
  dispatch(requestAddLike(font))

  return fetch(`/api/like/${font.id}`)
    .then(res => res.json())
    .then(json => dispatch(successAddLike(font, json)))
}

export const requestLikes = (fonts) => ({
  type: 'REQUEST_LIKES',
  fonts
})

export const receiveLikes = (fonts, json) => ({
  type: 'RECEIVE_LIKES',
  fonts,
  likes: json.docs,
  receivedAt: Date.now()
})

export const fetchLikes = (fonts) => (dispatch) => {

  // Dispatch provided by redux-thunk middleware
  dispatch(requestLikes(fonts))

  // Return a promise from ajax request
  // Fetch is web api to replace xmlhttprequest
  return fetch('/api/fonts/')
    .then(res => res.json())
    .then(json => dispatch(receiveLikes(fonts, json)))
}

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
