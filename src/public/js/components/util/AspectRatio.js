import React, { PropTypes } from 'react'

const AspectRatio = ({ width, height, children }) => {

  const ratioAsPercentage = `${height / width * 100}%`

  const divStyle = {
    position: 'relative',
    height: 0,
    paddingBottom: ratioAsPercentage
  }

  const innerDivStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }

  return (
    <div style={divStyle}>
      <div style={innerDivStyle}>
        {children}
      </div>
    </div>
  )
}

AspectRatio.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
}

export default AspectRatio
