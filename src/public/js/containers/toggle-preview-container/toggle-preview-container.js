import React from 'react'
import { connect } from 'react-redux'
import TogglePreview from 'components/toggle-preview/toggle-preview'
import {
  showList,
  showGrid } from 'actions/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    isGridView: state.fonts.get('isGridView')
  }
}

const mapDispatchToProps = {
  showList,
  showGrid
}

const TogglePreviewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TogglePreview)

export default TogglePreviewContainer
