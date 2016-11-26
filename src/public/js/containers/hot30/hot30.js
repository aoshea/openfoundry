import { connect } from 'react-redux';
import Hot30Page from 'components/hot30-page/hot30-page.js';

const mapStateToProps = (state, ownProps) => {
  return {
    fonts: state.fonts.get('fonts'),
    likes: state.fonts.get('likes'),
    specimenFontId: ownProps.params.fontId
  }
}

const Hot30 = connect(
  mapStateToProps
)(Hot30Page)

export default Hot30
