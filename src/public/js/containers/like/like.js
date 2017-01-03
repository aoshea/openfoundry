import { connect } from 'react-redux'
import { addLike } from 'actions/actions'
import LikeButton from 'components/font-like-button/font-like-button'

const mapStateToProps = (state, ownProps) => {
  return {
    isFetching: state.fonts.get('isFetching'),
    likeCount: ownProps.likeCount
  }
}

const mapDispatchToProps = ({
  addLike
})

const Like = connect(
  mapStateToProps,
  mapDispatchToProps
)(LikeButton)

export default Like
