import React, { Component, PropTypes } from 'react';
import FontBackgroundToggle from '../../components/font-background-toggle/font-background-toggle.js';
import FontUppercase from '../../components/font-uppercase/font-uppercase.js';
import FontColourBox from '../../components/font-colour-box/font-colour-box.js';

const FontColours = ({
  backgroundState,
  onUpdate,
  onUpdateBackground,
  onUpdateTextTransform,
  uppercase,
  color }) => {
  return (
      <div className="col-4 of-font-colour">
        <div className="of-font-background-toggle-container">
          <FontBackgroundToggle
            backgroundState={backgroundState}
            onUpdateColour={onUpdate}
            onUpdate={onUpdateBackground} />
        </div>
        <div className="of-font-uppercase-toggle-container">
          <FontUppercase
            uppercase={uppercase}
            backgroundState={backgroundState}
            onUpdate={onUpdateTextTransform} />
        </div>
        <FontColourBox value={color} onUpdate={onUpdate} />
      </div>
  )
}

FontColours.propTypes = {
  backgroundState: PropTypes.string.isRequired,
  uppercase: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onUpdateBackground: PropTypes.func.isRequired,
  onUpdateTextTransform: PropTypes.func.isRequired
}

export default FontColours
