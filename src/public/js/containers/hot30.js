import { connect } from 'react-redux';
import { setFontSize, setFontLeading } from '../actions/actions.js';
import FontList from '../components/font-list/font-list.js';

const mapStateToProps = (state) => {
  return {
    fonts: state.fonts.get('fonts'),
    fixed: false
  }
}

const mapDispatchToProps = ({
  onSetFontSize: setFontSize,
  onSetFontLeading: setFontLeading
})

const Hot30 = connect(
  mapStateToProps,
  mapDispatchToProps
)(FontList)

export default Hot30
