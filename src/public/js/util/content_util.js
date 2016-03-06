import React from 'react';
import { replaceNonAlphaNumeric } from './util.js';

const rhyphen = " — ";
const rankSpace = " ";
const rankComma = ", ";

export function getFullFontName(font) {
  if (!!!font) return "Undefined Font!";

  let fontStyle = font['font-style'];
  let fontName = font['font-name'];

  return fontName + rankSpace + fontStyle;
}

export function getFontId(font) {
  if (!!!font) return "Undefined Font!";

  return replaceNonAlphaNumeric(font['font-id']).toLowerCase();
}


export function getShareMessage(font) {
  if (!!!font) return "Undefined Font!";

  return [getFullFontName(font), ' ', font['font-open-source-link'], ' ','via @open_foundry #OFHot30'].join('');
}

export function getAboutText(font) {

  // {font-name} was created by {font-creator} [if {font-foundry} = true: and is currently distributed by {Link:font-foundry-link}{font-foundry}{Link:font-foundry-link}] else [ ]. It was initially submitted to us by {Link:info-discoverer-twitter}{info-discoverer}{Link:info-discoverer-twitter}. {font-style} is a {info-classification} cut of the {font-name} family, [if more then 1: which consists of {} different styles: {}.] else [which only consists of a single style.]
	// It is licensed under the {Link:info-license-link}{info-license}{Link:info-license-link} and available for contribution, modification or download on its open-source {} page. Please find more about this Typeface {Link:font-open-source-link}here{Link:font-open-source-link}.
	// Latest Version {info-version}


  var chunk_distributed = font['font-foundry']
    ? <span> and is currently distributed by <a href={font['font-foundry-link']}>{font['font-foundry']}</a></span>
    : null


  var styles = font['info-family'].split(/,|and/)

  var chunk_styles = styles.length > 1
    ? <span>which consists of {styles.length} different styles: {font['info-family']}</span>
    : <span>which only consists of a single style</span>

  var about = [
    <span>{font['font-name']} was created by {font['font-creator']} {chunk_distributed}.
    It was initially submitted to us by <a href={font['info-discoverer-twitter']}>{font['info-discoverer']}</a>.&nbsp;
    {font['font-style']} is a {font['info-classification']} cut of the {font['font-name']} family,</span>,
    <span> {chunk_styles}.</span>,
    <span>
    <br /><br />
    It is licensed under the <a href={font['info-license-link']}>{font['info-license']}</a>&nbsp;
    and available for contribution, modification or download on its open-source page.
    Please find more about this Typeface <a href={font['font-open-source-link']}>here</a>.
    <br /><br />
    Latest Version {font['info-version']}
    </span>
  ]

  return about;
}
