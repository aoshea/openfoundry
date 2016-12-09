import { fromJS } from 'immutable'

const InitialState = fromJS({
  isTransition: false,
  imageRect: null,
  imageSrc: null,
  transform: null
})

const initialState = InitialState

const transitionReducer = (state = initialState, action) => {

  switch (action.type) {

    case 'INIT_TRANSITION':
      if (action.data) {
        return state
          .set('imageRect', action.data.imageRect)
          .set('imageSrc', action.data.imageSrc)
          .set('transform', action.data.transform)
          .set('isInitTransition', true)
      }
      return state

    case 'START_TRANSITION':
      return state.set('isBeginTransition', true)

    case 'END_TRANSITION':
      return state
        .set('isBeginTransition', false)
        .set('isInitTransition', false)

    default:
      return state
  }
}

export default transitionReducer
