import React, { Component } from 'react'
import { replaceNonAlphaNumeric } from '../../../util/util.js'

export default class FontSpecimenImage extends Component {

  render() {

    const { font } = this.props
    const id = font.get('id')

    const specimenClassName = `of-font-specimen-image specimen-${id}`
    const specimenRatioClassName = `of-font-specimen-image-wrapper ratio-${id}`

    return <div className={specimenRatioClassName}><div className={specimenClassName}></div></div>
  }
}
