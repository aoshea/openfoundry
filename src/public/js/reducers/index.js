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

const fonts = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_SIZE':

      const itemIndex = findItemIndex(state, action.id);
      const fft = state.getIn(['fonts', itemIndex]);
      const updatedItem = fft.set('settingsFontSize', action.value);

      return state.setIn(['fonts', itemIndex], updatedItem);
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