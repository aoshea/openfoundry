import { combineReducers } from 'redux'
import { fromJS } from 'immutable';

const sheetJSON = require('../../../../open/build/sheet.json');

const InitialState = fromJS({
  ...sheetJSON
});

const initialState = InitialState; // .toJS();

const font = (state, action) => {
  switch (action.type) {
    case 'ADD_FONT':
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    case 'UPDATE_SIZE':
      if (action.id !== state.get('id')) return state;
      return state.set('settingsFontSize', action.value);
    default:
      return state
  }
}

const fonts = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_FONT':
      return [
        ...state,
        font(undefined, action)
      ]
    case 'UPDATE_SIZE':
      return state.map(f => font(f, action))
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