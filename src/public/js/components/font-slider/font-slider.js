import React, { Component } from 'react';
import ReactSlider from 'react-slider';
import ReactSliderLabel from './font-slider-label.js';

export default class FontSlider extends Component {
  
  constructor() {
    super()    
    this.state = { value: 0, unitValue: 0 };
    this.handleChange = this.handleChange.bind(this);
  }
  
  componentDidMount() {
    this.setState({
      value: this.props.initial,
      unitValue: this.props.initial / this.props.max
    });
  }
  
  handleChange(value) {
    let { onUpdate } = this.props;
    
    let unitValue = value / this.props.max;
    
    this.setState({
      value: value,
      unitValue: unitValue   
    });
    onUpdate && onUpdate(value);
  }
  
  render() {
    return (
      <div className="col-2 of-font-slider">
        <ReactSliderLabel v={this.state.value} uv={this.state.unitValue} label={this.props.label} />
        <ReactSlider 
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          onChange={this.handleChange} 
          defaultValue={this.props.initial} />
      </div>
    )
  }
}