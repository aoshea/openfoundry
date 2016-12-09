import { combineReducers } from 'redux'
import fontReducer from 'containers/hot30/reducer'
import uiReducer from 'containers/ui/reducer'
import transitionReducer from 'containers/specimen-transition-container/reducer'

const fontsApp = combineReducers({
  fonts: fontReducer,
  ui: uiReducer,
  transition: transitionReducer
})

export default fontsApp
