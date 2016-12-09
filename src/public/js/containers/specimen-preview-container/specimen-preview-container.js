import React from 'react'
import { connect } from 'react-redux'
import SpecimenPreview from 'components/specimen-preview/specimen-preview'
import {
  startTransition,
  endTransition,
  initTransition
} from '../specimen-transition-container/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    fonts: state.fonts.get('fonts'),
    ...ownProps
  }
}

const mapDispatchToProps = {
  startTransition,
  endTransition,
  initTransition
}

const SpecimenPreviewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SpecimenPreview)

export default SpecimenPreviewContainer
