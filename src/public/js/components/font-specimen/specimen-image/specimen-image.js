import React, { Component } from 'react';
import { replaceNonAlphaNumeric } from '../../../util/util.js';

export default class FontSpecimenImage extends Component {

  render() {

    const { font } = this.props;

    const specimenClassName = 'of-font-specimen-image specimen-' + replaceNonAlphaNumeric(font['font-id']);
    const specimenRatioClassName = 'of-font-specimen-image-wrapper ratio-' + replaceNonAlphaNumeric(font['font-id']);

    return <div className={specimenRatioClassName}><div className={specimenClassName}></div></div>
  }
}