import { connect } from 'react-redux';
import {
  setFontSize,
  setFontLeading,
  setFontColour,
  setFontTransform,
  setFontTracking } from '../actions/actions.js';
import FontList from '../components/font-list/font-list.js';

const mapStateToProps = (state) => {
  return {
    fonts: state.fonts.get('fonts'),
    fixed: false
  }
}

const mapDispatchToProps = ({
  onSetFontSize: setFontSize,
  onSetFontLeading: setFontLeading,
  onSetFontTracking: setFontTracking,
  onSetFontColour: setFontColour,
  onSetFontTransform: setFontTransform
})

const Hot30 = connect(
  mapStateToProps,
  mapDispatchToProps
)(FontList)

export default Hot30
