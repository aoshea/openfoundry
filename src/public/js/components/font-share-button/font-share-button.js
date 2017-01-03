import React, { Component } from 'react'

export default class FontShareButton extends Component {

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const url = 'https://github.com'
    const msg = this.props.message
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`

    window.open(shareUrl, '_blank')
  }

  render() {
    return (
      <div className="share-container">
          <div className="share-button" onClick={this.handleClick}>
            <svg xmlns="http://www.w3.org/svg/2000" viewBox="0 0 32 32">
              <path d="M9.3,21.5c0-0.4,0-0.8,0-1.2c0-0.6-0.1-3.1,1.8-5c1.3-1.3,2.2-1.8,4.6-1.9v-3l7.1,4.7L15.6,20v-3c-1.1,0-1.6,0-2.5,0.3c-1.4,0.5-1.9,1.5-2.7,2.7l-0.8,1.6H9.3"/>
            </svg>
          </div>
          <span className="share-count">
            0
          </span>
      </div>
    )
  }
}
