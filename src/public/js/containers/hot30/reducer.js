import { fromJS } from 'immutable'

const sheetJSON = require('../../../../../open/build/sheet.json')

const InitialState = fromJS({
  isFetching: false,
  isGridView: true,
  likes: [],
  ...sheetJSON
})

const initialState = InitialState

const findItemIndex = (state, list, prop, id) => {
  return state.get(list).findIndex(
    (item) => item.get(prop) === id
  )
}

const updateFont = (state, param, action) => {
  const itemIndex = findItemIndex(state, 'fonts', 'id', action.id)
  const item = state.getIn(['fonts', itemIndex])
  const updatedItem = item.set(param, action.value)
  return state.setIn(['fonts', itemIndex], updatedItem)
}

const updateLike = (state, param, action) => {
  const itemIndex = findItemIndex(state, 'likes', 'fontId', action.id)
  const item = state.getIn(['likes', itemIndex])
  const numLikes = item.get('likes')
  const updatedItem = item.set(param, numLikes + 1)
  return state.setIn(['likes', itemIndex], updatedItem)
}

const fontReducer = (state = initialState, action) => {

  switch (action.type) {

    case 'SHOW_GRID':
      if (state.get('isGridView')) return state
      return state.set('isGridView', true)

    case 'SHOW_LIST':
      if (!state.get('isGridView')) return state
      return state.set('isGridView', false)

    case 'SUCCESS_ADD_LIKE':
      return updateLike(state, 'likes', action)
        .set('isFetching', false)

    case 'REQUEST_ADD_LIKE':
      return state.set('isFetching', true)

    case 'REQUEST_LIKES':
      return state.set('isFetching', true)

    case 'RECEIVE_LIKES':
      return state
        .set('isFetching', false)
        .set('lastUpdated', action.receivedAt)
        .set('likes', fromJS(action.likes))

    case 'UPDATE_SIZE':
      return updateFont(state, 'settingsFontSize', action)

    case 'UPDATE_LEADING':
      return updateFont(state, 'settingsLineHeight', action)

    case 'UPDATE_TRACKING':
      return updateFont(state, 'settingsLetterSpacing', action)

    case 'UPDATE_COLOUR':
      return updateFont(state, 'settingsColor', action)

    case 'UPDATE_TRANSFORM':
      return updateFont(state, 'settingsTextTransform', action)

    case 'UPDATE_BACKGROUND':
      return updateFont(state, 'settingsBackgroundState', action)

    default:
      return state
  }
}

export default fontReducer
