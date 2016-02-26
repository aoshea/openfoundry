import React, { Component } from 'react';

export default class FontColourBox extends Component {
  
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: ''
    };
  }
  
  handleChange(e) {
    let hex = e.target.value, { onUpdate } = this.props;
    
    if (hex.substr(0, 1) !== '#') {
      hex = '#' + hex;      
    }
    
    hex = hex.substr(0, 7);
    
    this.setState({
      value: hex
    });
    
    onUpdate && onUpdate(hex);
  }
  
  render() {
    let hexValue = this.props.value.substr(1);

    return (
      <div className="of-font-colour-input">
        <input type="text" value={hexValue} defaultValue={this.props.initial} onChange={this.handleChange} placeholder="000000" />
      </div>
    )
  }
}
