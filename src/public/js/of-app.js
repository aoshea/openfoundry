import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchLikes } from 'actions/actions'
import Nav from 'containers/ui/nav'

class OFApp extends Component {

  static propTypes = {
    isFetching: PropTypes.bool,
    likes: PropTypes.object,
    lastUpdated: PropTypes.number
  }

  componentDidMount() {

    // Any component wrapped with connect
    // has `dispatch` auto-added to props
    const { dispatch } = this.props

    dispatch(fetchLikes())
  }

  render() {

    const { params, likes, isFetching, lastUpdated } = this.props
    const { fontId } = params

    const lastUpdatedTime = new Date(lastUpdated || 0).toTimeString()

    return (
      <div className="is-loaded">
        <Nav fontId={fontId} />
        <div className="debug-information">{isFetching ? 'loading...' : null}{lastUpdatedTime}</div>
        <div className="of-main">{this.props.children}</div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isFetching: state.fonts.get('isFetching'),
    likes: state.fonts.get('likes'),
    lastUpdated: state.fonts.get('lastUpdated')
  }
}

export default connect(mapStateToProps)(OFApp)
