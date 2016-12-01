import React from 'react'
import AspectRatio from 'components/util/AspectRatio'
import BackgroundImage from 'components/util/BackgroundImage'

const FontSpecimenImage = ({ font }) => {

  const width = font.get('specimenWidth')
  const height = font.get('specimenHeight')
  const src = font.get('specimenImage')

  const backgroundImageClassName = 'of-font-specimen-bgimage'

  return (
    <AspectRatio width={width} height={height}>
      <BackgroundImage className={backgroundImageClassName} src={src} />
    </AspectRatio>
  )
}

export default FontSpecimenImage
