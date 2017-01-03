import { fromJS } from 'immutable'

export const InitialState = fromJS({
  menuOpen: false,
  breadcrumbUp: false,
  navHidden: false,
  logoUp: false
})

const initialState = InitialState

const uiReducer = (state = initialState, action) => {

  switch (action.type) {

    case 'OPEN_MENU':
      return state
        .set('menuOpen', true)
        .set('breadcrumpUp', true)
        .set('logoUp', false)

    case 'CLOSE_MENU':
      return state
        .set('menuOpen', false)
        .set('breadcrumpUp', false)
        .set('logoUp', true)

    case 'HIDE_MENU':
      return state

    case 'SHOW_BREADCRUMBS':
      return state
        .set('menuOpen', false)
        .set('logoUp', true)
        .set('breadcrumpUp', false)

    case 'HIDE_BREADCRUMBS':
      return state
        .set('logoUp', false)
        .set('breadcrumpUp', true)

    case 'LOCATION_CHANGE':
      return state
        .set('menuOpen', false)
        .set('logoUp', true)
        .set('breadcrumpUp', false)

    default:
      return state
  }
}

export default uiReducer
