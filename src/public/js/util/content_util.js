import React from 'react'
import { replaceNonAlphaNumeric } from './util.js'

const rhyphen = ' — '
const rankSpace = ' '
const rankComma = ', '

export function getFullFontName(font) {
  if (!font) return 'Undefined Font!'

  const fontStyle = font.get('fontStyle')
  const fontName = font.get('fontName')

  return fontName + rankSpace + fontStyle
}

export function getFontId(font) {
  if (!font) return 'Undefined Font!'

  return replaceNonAlphaNumeric(font.get('fontId')).toLowerCase()
}


export function getShareMessage(font) {
  if (!font) return 'Undefined Font!'

  return [getFullFontName(font), ' ', font.get('fontOpenSourceLink'), ' ','via @open_foundry #OFHot30'].join('')
}

export function getAboutText(f) {

  const font = f.toJS()

  // {font-name} was created by {font-creator} [if {font-foundry} = true: and is currently distributed by {Link:font-foundry-link}{font-foundry}{Link:font-foundry-link}] else [ ]. It was initially submitted to us by {Link:info-discoverer-twitter}{info-discoverer}{Link:info-discoverer-twitter}. {font-style} is a {info-classification} cut of the {font-name} family, [if more then 1: which consists of {} different styles: {}.] else [which only consists of a single style.]
	// It is licensed under the {Link:info-license-link}{info-license}{Link:info-license-link} and available for contribution, modification or download on its open-source {} page. Please find more about this Typeface {Link:font-open-source-link}here{Link:font-open-source-link}.
	// Latest Version {info-version}


  const chunk_distributed = font['fontFoundry']
    ? <span> and is currently distributed by <a href={font['fontFoundryLink']}>{font['fontFoundry']}</a></span>
    : null


  const styles = font['infoFamily'].split(/,|and/)

  const chunk_styles = styles.length > 1
    ? <span>which consists of {styles.length} different styles: {font['infoFamily']}</span>
    : <span>which only consists of a single style</span>

  const about = [
    <span key="uid-created">{font['fontName']} was created by {font['fontCreator']} {chunk_distributed}.
    It was initially submitted to us by <a href={font['info-DiscovererTwitter']}>{font['infoDiscoverer']}</a>.&nbsp
    {font['fontStyle']} is a {font['infoClassification']} cut of the {font['fontName']} family,</span>,
    <span key="uid-styles"> {chunk_styles}.</span>,
    <span key="uid-licence">
    <br /><br />
    It is licensed under the <a href={font['infoLicenseLink']}>{font['infoLicense']}</a>&nbsp
    and available for contribution, modification or download on its open-source page.
    Please find more about this Typeface <a href={font['fontOpenSourceLink']}>here</a>.
    <br /><br />
    Latest Version {font['infoVersion']}
    </span>
  ]

  return about
}
