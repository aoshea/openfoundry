import { connect } from 'react-redux'
import SpecimenPage from 'components/specimen-page/specimen-page'

const mapStateToProps = (state, ownProps) => {
  return {
    fonts: state.fonts.get('fonts'),
    fontId: ownProps.params.fontId
  }
}

const Specimen = connect(
  mapStateToProps
)(SpecimenPage)

export default Specimen

