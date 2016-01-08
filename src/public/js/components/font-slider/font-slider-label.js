import React, { Component } from 'react';

export default class FontSliderLabel extends Component {
    
  render() {    
    let { label, v, uv } = this.props;
    
    // set label
    label = label + ' ' + v;
    
    // set percentage for positioning
    uv *= 100;
    
    let divStyle = {
      left: `${uv}%`
    };
    
    return <div style={divStyle} className="of-font-slider-label">{label}</div>
  }
}