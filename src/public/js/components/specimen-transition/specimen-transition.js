import React, { PropTypes } from 'react'

const SpecimenTransition = ({ imageSrc, imageRect, transform, isInitTransition, isBeginTransition }) => {

  if (!isInitTransition && !isBeginTransition) return <div className="empty-transition-container" />

  let transitionStyle = {
    top: imageRect.top,
    left: imageRect.left,
    width: imageRect.width,
    height: imageRect.height,
    opacity: 1,
    visibility: 'visible'
  }

  if (isBeginTransition) {
    transitionStyle.transform = `translate(${transform.transformX}px, ${transform.transformY}px) scale3d(${transform.scale}, ${transform.scale}, ${transform.scale})`
  }

  return (
    <div className="of-specimen-transition">
      <img className="of-preview-image-transition" style={transitionStyle} src={imageSrc} />
    </div>
  )
}

SpecimenTransition.propTypes = {
  imageSrc: PropTypes.string,
  imageRect: PropTypes.object,
  transform: PropTypes.object,
  isInitTransition: PropTypes.bool,
  isBeginTransition: PropTypes.bool
}

export default SpecimenTransition
