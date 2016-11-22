import { combineReducers } from 'redux'
import { fromJS } from 'immutable';

const sheetJSON = require('../../../../open/build/sheet.json');

const InitialState = fromJS({
  ...sheetJSON
});

const initialState = InitialState; // .toJS();

const findItemIndex = (state, id) => {
  return state.get('fonts').findIndex(
    (item) => item.get('id') === id
  )
}

const updateFont = (state, param, action) => {
  const itemIndex = findItemIndex(state, action.id);
  const item = state.getIn(['fonts', itemIndex]);
  const updatedItem = item.set(param, action.value);
  return state.setIn(['fonts', itemIndex], updatedItem);
}

const fonts = (state = initialState, action) => {

  switch (action.type) {

    case 'UPDATE_SIZE':
      return updateFont(state, 'settingsFontSize', action);

    case 'UPDATE_LEADING':
      return updateFont(state, 'settingsLineHeight', action);

    case 'UPDATE_TRACKING':
      return updateFont(state, 'settingsLetterSpacing', action);

    case 'UPDATE_COLOUR':
      return updateFont(state, 'settingsColor', action);

    case 'UPDATE_TRANSFORM':
      return updateFont(state, 'settingsTextTransform', action);

    case 'UPDATE_BACKGROUND':
      return updateFont(state, 'settingsBackgroundState', action);

    default:
      return state
  }
}

console.log('reducers.js: Logging initial state from JSON');
console.log(InitialState.toJS());

const fontsApp = combineReducers({
  fonts
})

export default fontsApp