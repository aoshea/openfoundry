import React, { Component, PropTypes } from 'react'

const FontText = ({ fontClassNames, fontStyle, content }) => {
  return (
    <div
      className={fontClassNames}
      style={fontStyle}
      ref={e => (e !== null ? (e.contentEditable = true) : e)}>
      {content}
    </div>
  )
}

FontText.propTypes = {
  fontClassNames: PropTypes.string.isRequired,
  fontStyle: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired
}

export default FontText
