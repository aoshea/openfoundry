import React, { Component } from 'react';
import FontBackgroundToggle from '../../components/font-background-toggle/font-background-toggle.js';
import FontUppercase from '../../components/font-uppercase/font-uppercase.js';
import FontColourBox from '../../components/font-colour-box/font-colour-box.js';

export default class FontColours extends Component {
  render() {
    return (
      <div className="col-3">        
      
        <div className="of-font-background-toggle-container">
          <FontBackgroundToggle background={this.props.background} onUpdateColour={this.props.onUpdate} onUpdate={this.props.onUpdateBackground} />
        </div>
      
        <div className="of-font-uppercase-toggle-container">
          <FontUppercase background={this.props.background} onUpdate={this.props.onUpdateTextTransform} />
        </div>
              
        <FontColourBox initial={this.props.initial} onUpdate={this.props.onUpdate} />
        
      </div>
    )
  }
}