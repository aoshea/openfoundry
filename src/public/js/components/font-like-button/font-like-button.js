import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

export default class FontLikeButton extends Component {

  static propTypes = {
    addLike: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    likeCount: PropTypes.number.isRequired,
    fontId: PropTypes.string.isRequired
  }

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
    this.state = { clicked: false }
  }

  handleClick() {

    const { addLike, fontId } = this.props
    const { clicked } = this.state

    // TODO We can only click once here
    //      But there should be some prop
    //      from the server to flag if
    //      this user has already liked
    if (clicked) return

    this.setState({
      clicked: true
    })

    addLike({ id: fontId })
  }

  render() {

    const { clicked } = this.state
    const { likeCount, isFetching } = this.props
    const locked = clicked || isFetching

    const btnClass = classNames({
      'like-button': true,
      'like-button-disabled': locked,
      'like-button-fetching': isFetching
    })

    return (
      <div className="vote-container">
        <div onClick={this.handleClick} className={btnClass}>
          <svg xmlns="http://www.w3.org/svg/2000" viewBox="0 0 32 32">
            <path d="M21.1,11.4c1.3,1.4,1.3,3.6,0,4.9L16,21.5l-5.1-5.2c-1.3-1.4-1.3-3.6,0-4.9c1.2-1.2,3.1-1.2,4.3,0l0.8,0.8l0.8-0.8
  C18,10.2,19.9,10.2,21.1,11.4"/>
          </svg>
        </div>
        <span className="num-likes">{likeCount}</span>
      </div>
    )
  }
}
