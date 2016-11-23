import { connect } from 'react-redux';
import {
  setFontSize,
  setFontLeading,
  setFontColour,
  setFontTransform,
  setFontTracking,
  setFontBackground } from 'actions/actions.js';
import Hot30Page from 'components/hot30-page/hot30-page.js';

const mapStateToProps = (state, ownProps) => {
  return {
    fonts: state.fonts.get('fonts'),
    specimenFontId: ownProps.params.fontId
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

const Hot30 = connect(
  mapStateToProps,
  mapDispatchToProps
)(Hot30Page)

export default Hot30
