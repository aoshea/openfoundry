import React, { Component, PropTypes } from 'react';

export default class FontBackgroundToggle extends Component {

  propTypes: {
    backgroundState: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onUpdateColour: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const { onUpdate, onUpdateColour, backgroundState } = this.props;

    const mappedStates = ['white', 'black', 'image'];
    const index = mappedStates.findIndex(s => s === backgroundState);

    const nextIndex = (index + 1) % mappedStates.length;

    const backgroundColour = nextIndex > 0 ? '#ffffff' : '#000000';
    const nextBackgroundState = mappedStates[nextIndex];

    onUpdate && onUpdate(nextBackgroundState);
    onUpdateColour && onUpdateColour(backgroundColour);
  }

  render() {

    const { backgroundState } = this.props;
    const size = 32;
    const viewBox = [0, 0, size, size].join(' ');
    const imageStyle = {
      display: backgroundState === 'image' ? 'block' : 'none'
    };
    const imageFirstStyle = {
      display: backgroundState === 'image' ? 'none' : 'block',
      stroke: backgroundState === 'white' ? 'black' : 'white'
    };

    return (
      <svg onClick={this.handleClick} xmlns="http://www.w3.org/svg/2000"
        viewBox={viewBox}>
        <g id="of-font-toggle-no-image" style={imageFirstStyle} fill="none" >
          <circle cx="16" cy="12.8" r="5.5"/>
          <circle cx="12" cy="19.2" r="5.5"/>
          <circle cx="20" cy="19.2" r="5.5"/>
        </g>
        <g id="of-font-toggle-image" style={imageStyle}>
          <path fill="#0000FF" d="M14,19.2c0-0.3,0-0.6,0.1-0.8c-2.1-0.7-3.7-2.6-4-4.8c-2.4,0.8-4.1,3-4.1,5.7c0,3.3,2.7,6,6,6
          c1.5,0,2.9-0.6,4-1.5C14.8,22.6,14,21,14,19.2z"/>
          <path fill="#00FF00" d="M21.9,13.6c-0.3,2.3-1.9,4.1-4,4.8c0,0.3,0.1,0.5,0.1,0.8c0,1.8-0.8,3.4-2,4.5c1.1,1,2.5,1.5,4,1.5
          c3.3,0,6-2.7,6-6C26,16.6,24.3,14.4,21.9,13.6z"/>
          <path fill="#FF0000" d="M16,14.8c1.1-1,2.5-1.5,4-1.5c0.7,0,1.3,0.1,1.9,0.3c0-0.3,0.1-0.5,0.1-0.8c0-3.3-2.7-6-6-6s-6,2.7-6,6
          c0,0.3,0,0.6,0.1,0.8c0.6-0.2,1.3-0.3,1.9-0.3C13.5,13.2,14.9,13.8,16,14.8z"/>
          <path fill="#00FFFF" d="M18,19.2c0-0.3,0-0.6-0.1-0.8c-0.6,0.2-1.3,0.3-1.9,0.3s-1.3-0.1-1.9-0.3c0,0.3-0.1,0.5-0.1,0.8
          c0,1.8,0.8,3.4,2,4.5C17.2,22.6,18,21,18,19.2z"/>
          <path fill="#FF00FF" d="M14.1,18.4c0.2-1.4,0.9-2.7,1.9-3.6c-1.1-1-2.5-1.5-4-1.5c-0.7,0-1.3,0.1-1.9,0.3
          C10.4,15.8,12,17.7,14.1,18.4z"/>
          <path fill="#FFFF00" d="M16,14.8c1,0.9,1.7,2.2,1.9,3.6c2.1-0.7,3.7-2.6,4-4.8c-0.6-0.2-1.3-0.3-1.9-0.3
          C18.5,13.2,17.1,13.8,16,14.8z"/>
          <path fill="#FFFFFF" d="M16,14.8c-1,0.9-1.7,2.2-1.9,3.6c0.6,0.2,1.3,0.3,1.9,0.3s1.3-0.1,1.9-0.3C17.7,17,17,15.7,16,14.8z"/>
        </g>
      </svg>
    )
  }
}