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

  var fontName = font['font-name'];

  var creator = font['font-creator'];
  var creatorLink = font['font-creator-link'];

  var fontDownloadLink = font['font-download-link'];
  var styleDesc = font['font-style'];
  var foundry = font['font-foundry'];

  var specimenCreator = font['specimen-creator'];
  var specimenCreatorLink = font['specimen-creator-link'];

  var foundBy = font['info-discoverer'];
  var infoAbout = font['info-about'];
  var infoWeight = font['info-weight'];
  var fontInfoLicense = font['info-license'];
  var fontInfoFamily = font['info-family'];

  var fontOpenSourceLink = font['font-open-source-link'];
  var fontFoundLink = font['font-found-link'];

  var classification = font['info-classification'];

	// {font-name} was created by {font-creator} [if {font-foundry} = true: and is currently distributed by {Link:font-foundry-link}{font-foundry}{Link:font-foundry-link}] else [ ]. It was initially submitted to us by {Link:info-discoverer-twitter}{info-discoverer}{Link:info-discoverer-twitter}. {font-style} is a {info-classification} cut of the {font-name} family, [if more then 1: which consists of {} different styles: {}.] else [which only consists of a single style.]

	// It is licensed under the {Link:info-license-link}{info-license}{Link:info-license-link} and available for contribution, modification or download on its open-source {} page. Please find more about this Typeface {Link:font-open-source-link}here{Link:font-open-source-link}.

	// Latest Version {info-version}


  var about1 = 'It was created by ' + creator;
  var about2 = foundry ? ' and is currently distributed by ' + foundry : '';
  var about3 = '. ';
  var about4 = 'It was submitted to us by ' + foundBy + '.  ' + styleDesc + ' is a ' + classification + ' cut of the ' + fontName + ' family. ';
  var about5 = 'It comes in ' + fontInfoFamily + ' faces. ';
  var about6 = 'It is licensed under the ' + fontInfoLicense + ' and available for contribution, modification or download on its open-source ' + fontOpenSourceLink + ' page. Please find more about ' + fontName + ' here ' + fontFoundLink;

  var res = about1 + about2 + about3 + about4 + about5 + about6;

  return res;
}
