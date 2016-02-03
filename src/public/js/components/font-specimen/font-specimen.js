import React, { Component } from 'react';
import $ from 'jquery';
import { replaceNonAlphaNumeric } from '../../util/util.js';
import FontPreviewContainer from '../../components/font-preview-container/font-preview-container.js';
import cx from 'classnames';

export default class FontSpecimen extends Component {

  constructor() {
    super()

    this.onScrollFinish = this.onScrollFinish.bind(this);
    this.state = {
      onEnter: false,
      delta: 0
    };
  }

  onScrollFinish() {
    let { onCompleteScroll } = this.props;
    onCompleteScroll && onCompleteScroll();
  }

  componentDidMount() {

    const { onScrollUpdate } = this.props;

    this.setState({
      onEnter: true
    });

    var scrollableEl = $('.of-spec-scrollable');
    var inner = $('.of-font-specimen');
    var self = this;

    scrollableEl.on('scroll', function (e) {

      let innerHeight = inner.height() + window.innerHeight * 0.8;
      let scrollY = window.innerHeight + e.target.scrollTop;

      let delta = ((scrollY - innerHeight) / window.innerHeight) + 1;
      if (delta > 0) {

        /*
        self.setState({
          delta: delta
        });
        */

        onScrollUpdate && onScrollUpdate(delta);
      }

      let isBottom = scrollY >= innerHeight - 1;

      if (isBottom) {
        self.onScrollFinish();
        scrollableEl.off('scroll');
      }
    });
  }

  componentWillUnmount() {
    $('.of-spec-scrollable').off('scroll');
  }

  render() {

    const props = this.props;
    const state = this.state;

    let { font } = props;

    let creator;
    let creatorLink;

    let specimenCreator;
    let specimenCreatorLink;

    let fontDownloadLink;

    let styleDesc;

    let foundry;

    let foundBy;
    let foundByLink;

    let fontName;

    let fontInfoLicense;
    let fontInfoFamily;
    let fontFoundLink;
    let fontOpenSourceLink;

    let specimenClassName;
    let specimenRatioClassName;

    let aboutText;
    let infoAbout;

    let infoWeight;

    let fontClassName;

    if (font) {

      fontName = font['font-name'];

      creator = font['font-creator'];
      creatorLink = font['font-creator-link'];

      fontDownloadLink = font['font-download-link'];
      styleDesc = font['font-style'];
      foundry = font['font-foundry'];

      specimenCreator = font['specimen-creator'];
      specimenCreatorLink = font['specimen-creator-link'];

      foundBy = font['info-discoverer'];
      infoAbout = font['info-about'];
      infoWeight = font['info-weight'];
      fontInfoLicense = font['info-license'];
      fontInfoFamily = font['info-family'];

      fontOpenSourceLink = font['font-open-source-link'];
      fontFoundLink = font['font-found-link'];

      specimenClassName = 'of-font-specimen-image specimen-' + replaceNonAlphaNumeric(font['font-id']);
      specimenRatioClassName = 'of-font-specimen-image-wrapper ratio-' + replaceNonAlphaNumeric(font['font-id']);

      let classification = font['info-classification'];
      let discoverer = foundBy;

      let about1 = 'It was created by ' + creator;
      let about2 = foundry ? ' and is currently distributed by ' + foundry : '';
      let about3 = '. ';
      let about4 = 'It was submitted to us by ' + discoverer + '.  ' + styleDesc + ' is a ' + classification + ' cut of the ' + fontName + ' family. ';
      let about5 = 'It comes in ' + fontInfoFamily + ' faces. ';
      let about6 = 'It is licensed under the ' + fontInfoLicense + ' and available for contribution, modification or download on its open-source ' + fontOpenSourceLink + ' page. Please find more about ' + fontName + ' here ' + fontFoundLink + '.';

      aboutText = about1 + about2 + about3 + about4 + about5 + about6;

      fontClassName = replaceNonAlphaNumeric(font['font-id']);
    }

    let isSpacerTop = false;
    let previewKey = Math.floor(Math.random() * 999999) + 1;

    let fontSpecimenClassName = cx({
      'of-font-specimen': true,
      enter: state.onEnter
    });

    let spacerStyle = {
      opacity: 1 - state.delta
    };

    let holderStyle = cx({
      'of-spec-holder': true,
      enter: state.onEnter
    });

    return (

      <div className={holderStyle}>
        <div className="of-spec-wrapper">
          <div className="of-spec-scrollable">

            <div className="of-preview-wrapper">
              <FontPreviewContainer
                fixed={true}
                rank={previewKey}
                key={previewKey}
                font={font} />
            </div>

            <div className="of-specimen-wrapper">
              <div className={fontSpecimenClassName}>
                { isSpacerTop && <div className="of-font-specimen-spacer-top"></div> }
                { specimenClassName
                  && <div className={specimenRatioClassName}>
                       <div className={specimenClassName}></div>
                      </div> }
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
                { creator, foundry
                  ? <div className="of-font-specimen-content"><h3>Typedesigner, Foundry</h3><h4 className={fontClassName}><a href={creatorLink}>{creator}</a>, {foundry}</h4></div>
                  : <div className="of-font-specimen-content"><h3>Typedesigner</h3><h4 className={fontClassName}><a href={creatorLink}>{creator}</a></h4></div>
                }
                { foundBy
                  && <div className="of-font-specimen-content"><h3>Project Page</h3><a href={fontOpenSourceLink}><h4 className={fontClassName}>{fontOpenSourceLink}</h4></a></div>
                }
                <div className="of-font-specimen-content">
                  <div className="of-row">
                    <div className="col-6">
                      <h3>About</h3>
                      { infoAbout
                        ? <p>{infoAbout} {aboutText}</p>
                        : <p>{aboutText}</p>
                      }

                    </div>
                  </div>
                </div>
                <div className="of-font-specimen-content of-font-specimen-content-last">
                  <div className="of-row">
                    <div className="col-12">
                      <h3>Download Type</h3>
                      <a href={fontDownloadLink}><button className="of-font-specimen-button">{fontName} {styleDesc}</button></a>
                    </div>
                  </div>
                </div>
                <div style={spacerStyle} className="of-font-specimen-spacer-bottom"></div>

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}