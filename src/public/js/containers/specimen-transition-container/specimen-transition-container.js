import React from 'react'
import { connect } from 'react-redux'
import SpecimenTransition from 'components/specimen-transition/specimen-transition'
import {
  startTransition,
  endTransition
} from './actions'

const mapStateToProps = (state, ownProps) => {
  return {
    imageSrc: state.transition.get('imageSrc'),
    imageRect: state.transition.get('imageRect'),
    transform: state.transition.get('transform'),
    isInitTransition: state.transition.get('isInitTransition'),
    isBeginTransition: state.transition.get('isBeginTransition'),
    ...ownProps
  }
}

const mapDispatchToProps = {
  startTransition,
  endTransition
}

const SpecimenTransitionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SpecimenTransition)

export default SpecimenTransitionContainer
