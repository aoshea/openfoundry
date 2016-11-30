import React, { Component, PropTypes } from 'react'
import ReactSlider from 'react-slider'
import ReactSliderLabel from './font-slider-label.js'

const FontSlider = ({ onUpdate, min, max, value, step, initial, fixed, label }) => {

  return (
    <div className="col-2 of-font-slider">
      <ReactSliderLabel v={value} min={min} max={max} fixed={fixed} label={label} />
      <ReactSlider
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={onUpdate}
        defaultValue={initial} />
    </div>
  )
}

FontSlider.propTypes = {
  initial: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  fixed: PropTypes.number,
  label: PropTypes.string.isRequired
}

export default FontSlider