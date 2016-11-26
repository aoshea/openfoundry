import React from 'react'
import { connect } from 'react-redux'
import FontPreview from 'components/font-preview/font-preview'
import {
  setFontSize,
  setFontLeading,
  setFontColour,
  setFontTransform,
  setFontTracking,
  setFontBackground } from 'actions/actions.js';

const mapStateToProps = (state, ownProps) => {
  return {
    fonts: state.fonts.get('fonts'),
    ...ownProps
  }
}

const mapDispatchToProps = ({
  onSetFontSize: setFontSize,
  onSetFontLeading: setFontLeading,
  onSetFontTracking: setFontTracking,
  onSetFontColour: setFontColour,
  onSetFontTransform: setFontTransform,
  onSetFontBackground: setFontBackground
})

const FontPreviewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FontPreview)

export default FontPreviewContainer