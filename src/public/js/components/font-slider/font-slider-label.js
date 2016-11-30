import React, { Component, PropTypes } from 'react'

export default class FontSliderLabel extends Component {

  static propTypes = {
    label: PropTypes.string,
    v: PropTypes.number,
    max: PropTypes.number,
    min: PropTypes.number
  }

  render() {

    const { label, v, max, min, fixed } = this.props

    let unitValue = (v - min) / (max - min)
    let fixValue = v

    if (fixed) {
      fixValue = fixValue.toFixed(fixed)
    }

    // set label
    const updatedLabel = label + ' ' + fixValue

    // set percentage for positioning
    unitValue *= 100

    const divStyle = {
      left: `${unitValue}%`
    }

    return <div style={divStyle} className="of-font-slider-label">{updatedLabel}</div>
  }
}