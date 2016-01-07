import React, { Component } from 'react';

export default class FontSpecimen extends Component { 
  
  render() {
    return (
      <div className="of-font-specimen">
        <h3>{this.props.font}</h3>
        <div className="of-font-specimen-svg">
          <img src="/img/specimen-bagnard-regular.svg" />
        </div>
      </div>
    )
  }
}