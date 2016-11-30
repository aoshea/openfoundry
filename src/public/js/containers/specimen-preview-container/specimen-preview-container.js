import React from 'react'
import { connect } from 'react-redux'
import SpecimenPreview from 'components/specimen-preview/specimen-preview'

const mapStateToProps = (state, ownProps) => {
  return {
    fonts: state.fonts.get('fonts'),
    ...ownProps
  }
}

const SpecimenPreviewContainer = connect(
  mapStateToProps
)(SpecimenPreview)

export default SpecimenPreviewContainer
