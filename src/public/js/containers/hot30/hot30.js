import { connect } from 'react-redux'
import Hot30Page from 'components/hot30-page/hot30-page.js'
import { exitSpecimen } from 'actions/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    fonts: state.fonts.get('fonts'),
    likes: state.fonts.get('likes'),
    isGridView: state.fonts.get('isGridView'),
    specimenOffset: state.fonts.get('specimenOffset'),
    specimenFontId: ownProps.params.fontId
  }
}

const mapDispatchToProps = {
  exitSpecimen
}

const Hot30 = connect(
  mapStateToProps,
  mapDispatchToProps
)(Hot30Page)

export default Hot30
