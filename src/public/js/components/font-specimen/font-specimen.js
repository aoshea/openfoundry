import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactTransitionGroup from 'react-addons-transition-group';
import Linkify from 'react-linkify';
import React, { Component } from 'react';
import $ from 'jquery';
import { replaceNonAlphaNumeric } from '../../util/util.js';
import { getAboutText } from 'util/content_util.js';
import FontPreviewContainer from 'components/font-preview-container/font-preview-container.js';
import FontSpecimenImage from 'components/font-specimen/specimen-image/specimen-image.js';
import cx from 'classnames';

import FontLikeButton from 'components/font-like-button/font-like-button.js';
import FontShareButton from 'components/font-share-button/font-share-button.js';

var idleTimeout = {
  id: null,
  delay: 1000
};

export default class FontSpecimen extends Component {

  constructor() {
    super();

    this.onClickSource = this.onClickSource.bind(this);

    this.state = {
      canScroll: false,
      isScroll: false,
      isTopPassed: false,
      delta: 0,
      moveToOffset: 0
    };
  }

  componentDidMount() {
    console.log('FontSpecimen did mount');
    console.log(this.props);
  }

  onClickSource(scrollTop, offsetTop, e) {

    const { font } = this.props
    const link = font['font-open-source-link'];

    window.open(link);

    e.preventDefault();
    return false;
  }

  render() {

    const { font } = this.props;
    const state = this.state;

    if (!font) return <div>nothing here</div>

    const specimenClassName = cx({
      'of-specimen': true
    });

    const previewWrapperClassName = cx({
      'of-preview-wrapper': true,
      'is-scroll': state.isScroll
    });

    const previewKey = font['font-name'];
    const specimenCreator = font['specimen-creator'];
    const specimenCreatorLink = font['specimen-creator-link'];
    const fontClassName = replaceNonAlphaNumeric(font['font-id']);
    const styleDesc = font['font-style'];
    const foundBy = font['info-discoverer'];
    const infoAbout = font['info-about'];
    const infoWeight = font['info-weight'];

    return (
      <div className={specimenClassName}>

        <div className={previewWrapperClassName}>
          <FontPreviewContainer
            fixed={true}
            onMoreUpdate={this.onClickSource}
            rank={previewKey}
            key={previewKey}
            font={font} />
        </div>
        <div className="of-specimen-overlay">

          <FontSpecimenImage font={font} />

          <div className="of-font-specimen-content of-font-specimen-content-first">
            <h3>Specimen Artwork by</h3>
            { specimenCreatorLink
              ? <a href={specimenCreatorLink}><h4 className={fontClassName}>{specimenCreator}</h4></a>
              : <h4 className={fontClassName}>{specimenCreator}</h4>
            }
          </div>

          { styleDesc
            && <div className="of-font-specimen-content"><h3>Style, Weight</h3><h4 className={fontClassName}>{styleDesc}, {infoWeight}</h4></div>
          }
          <div className="of-font-specimen-content of-font-specimen-content-characterset">
            <h3>Characters: Basic Latin</h3>
            <h4 className={fontClassName}>
              <ul>
                <li className="character">&#033;</li>
                <li className="character">&#034;</li>
                <li className="character">&#035;</li>
                <li className="character">&#036;</li>
                <li className="character">&#037;</li>
                <li className="character">&#038;</li>
                <li className="character">&#039;</li>
                <li className="character">&#040;</li>
                <li className="character">&#041;</li>
                <li className="character">&#042;</li>
                <li className="character">&#043;</li>
                <li className="character">&#044;</li>
                <li className="character">&#045;</li>
                <li className="character">&#046;</li>
                <li className="character">&#047;</li>
                <li className="character">&#048;</li>
                <li className="character">&#049;</li>
                <li className="character">&#050;</li>
                <li className="character">&#051;</li>
                <li className="character">&#052;</li>
                <li className="character">&#053;</li>
                <li className="character">&#054;</li>
                <li className="character">&#055;</li>
                <li className="character">&#056;</li>
                <li className="character">&#057;</li>
                <li className="character">&#058;</li>
                <li className="character">&#059;</li>
                <li className="character">&#060;</li>
                <li className="character">&#061;</li>
                <li className="character">&#062;</li>
                <li className="character">&#063;</li>
                <li className="character">&#064;</li>
                <li className="character">&#065;</li>
                <li className="character">&#066;</li>
                <li className="character">&#067;</li>
                <li className="character">&#068;</li>
                <li className="character">&#069;</li>
                <li className="character">&#070;</li>
                <li className="character">&#071;</li>
                <li className="character">&#072;</li>
                <li className="character">&#073;</li>
                <li className="character">&#074;</li>
                <li className="character">&#075;</li>
                <li className="character">&#076;</li>
                <li className="character">&#077;</li>
                <li className="character">&#078;</li>
                <li className="character">&#079;</li>
                <li className="character">&#080;</li>
                <li className="character">&#081;</li>
                <li className="character">&#082;</li>
                <li className="character">&#083;</li>
                <li className="character">&#084;</li>
                <li className="character">&#085;</li>
                <li className="character">&#086;</li>
                <li className="character">&#087;</li>
                <li className="character">&#088;</li>
                <li className="character">&#089;</li>
                <li className="character">&#090;</li>
                <li className="character">&#091;</li>
                <li className="character">&#092;</li>
                <li className="character">&#093;</li>
                <li className="character">&#094;</li>
                <li className="character">&#095;</li>
                <li className="character">&#096;</li>
                <li className="character">&#097;</li>
                <li className="character">&#098;</li>
                <li className="character">&#099;</li>
                <li className="character">&#100;</li>
                <li className="character">&#101;</li>
                <li className="character">&#102;</li>
                <li className="character">&#103;</li>
                <li className="character">&#104;</li>
                <li className="character">&#105;</li>
                <li className="character">&#106;</li>
                <li className="character">&#107;</li>
                <li className="character">&#108;</li>
                <li className="character">&#109;</li>
                <li className="character">&#110;</li>
                <li className="character">&#111;</li>
                <li className="character">&#112;</li>
                <li className="character">&#113;</li>
                <li className="character">&#114;</li>
                <li className="character">&#115;</li>
                <li className="character">&#116;</li>
                <li className="character">&#117;</li>
                <li className="character">&#118;</li>
                <li className="character">&#119;</li>
                <li className="character">&#120;</li>
                <li className="character">&#121;</li>
                <li className="character">&#122;</li>
                <li className="character">&#123;</li>
                <li className="character">&#124;</li>
                <li className="character">&#125;</li>
                <li className="character">&#126;</li>
              </ul>
            </h4>
          </div>

        </div>
      </div>
    )
  }
}