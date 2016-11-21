import { connect } from 'react-redux';
import { setFontSize } from '../actions/actions.js';
import FontList from '../components/font-list/font-list.js';

const mapStateToProps = (state) => {
  return {
    fonts: state.fonts.get('fonts'),
    fixed: false
  }
}

const mapDispatchToProps = ({
  onSetFontSize: setFontSize
})

const Hot30 = connect(
  mapStateToProps,
  mapDispatchToProps
)(FontList)

export default Hot30
