import React, { Component } from 'react'
import { replaceNonAlphaNumeric } from '../../../util/util.js'

export default class FontSpecimenImage extends Component {

  render() {

    const { font } = this.props
    const fontId = font.get('fontId')

    const specimenClassName = 'of-font-specimen-image specimen-' + replaceNonAlphaNumeric(fontId)
    const specimenRatioClassName = 'of-font-specimen-image-wrapper ratio-' + replaceNonAlphaNumeric(fontId)

    return <div className={specimenRatioClassName}><div className={specimenClassName}></div></div>
  }
}
