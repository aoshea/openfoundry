import React, { Component, PropTypes } from 'react'

export default class FontUppercase extends Component {

  static propTypes = {
    backgroundState: PropTypes.string.isRequired,
    uppercase: PropTypes.bool.isRequired,
    onUpdate: PropTypes.func.isRequired
  }

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    const { onUpdate, uppercase } = this.props
    const nextUppercase = !uppercase
    onUpdate && onUpdate(nextUppercase)
  }

  render() {

    const { uppercase, backgroundState } = this.props

    const size = 32
    const viewBox = [0, 0, size, size].join(' ')
    const onStyle = {
      display: uppercase ? 'block' : 'none',
      fill: backgroundState === 'white' ? 'black' : 'white'
    }
    const offStyle = {
      display: uppercase ? 'none' : 'block',
      fill: backgroundState !== 'white' ? 'white' : 'black'
    }

    return (
      <svg onClick={this.handleClick} xmlns="http://www.w3.org/svg/2000"
        viewBox={viewBox}>
        <g id="of-font-uppercase-on" style={onStyle} >
          <path d="M10,21.6v-9.3H6.7v-1.9h8.8v1.9h-3.3v9.3H10z M19.8,21.6v-9.3h-3.3v-1.9h8.8v1.9H22v9.3H19.8z"/>
        </g>
        <g id="of-font-uppercase-off" style={offStyle}>
          <path d="M10,21.6v-9.3H6.7v-1.9h8.8v1.9h-3.3v9.3H10z M23.4,13.5v1.7H22v3.3c0,0.7,0,1,0,1.2c0,0.1,0.1,0.2,0.2,0.3
  c0.1,0.1,0.2,0.1,0.4,0.1c0.2,0,0.5-0.1,0.9-0.2l0.2,1.7c-0.5,0.2-1.1,0.3-1.7,0.3c-0.4,0-0.7-0.1-1-0.2c-0.3-0.1-0.5-0.3-0.7-0.5
  c-0.1-0.2-0.2-0.5-0.3-0.8c0-0.2-0.1-0.7-0.1-1.5v-3.5h-1v-1.7h1v-1.6l2.1-1.2v2.8H23.4z"/>
        </g>
      </svg>
    )
  }
}
