import React, { Component } from 'react';
import Slider from '../../components/slider/slider.js';

export default class FontSlider extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: 0
    };
  }
  
  componentDidMount() {
    this.setState({
      value: this.props.initial
    });
  }

  handleChange(value) {
    let { onUpdate } = this.props;
    
    this.setState({
      value: value
    });
    
    onUpdate && onUpdate(value);
  }

  render() {
    return (
      <div className="col-2">
      <Slider
      value={this.state.value}
      orientation="horizontal"
      label={this.props.label}
      min={this.props.min}
      max={this.props.max}
      step={this.props.step}
      onChange={this.handleChange} />
      </div>
    );
  }
}
