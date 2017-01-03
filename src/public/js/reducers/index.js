import { combineReducers } from 'redux'
import fontReducer from 'containers/hot30/reducer'
import uiReducer from 'containers/ui/reducer'

const fontsApp = combineReducers({
  fonts: fontReducer,
  ui: uiReducer
})

export default fontsApp
