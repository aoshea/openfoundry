import React, { Component } from 'react';
import $ from 'jquery';
import { replaceNonAlphaNumeric } from '../../util/util.js';

export default class FontSpecimen extends Component {

  constructor() {
    super()

    this.onScrollFinish = this.onScrollFinish.bind(this);
  }

  onScrollFinish() {

    console.log('onScrollFinsh');

    let { onCompleteScroll } = this.props;
    onCompleteScroll && onCompleteScroll();
  }

  componentDidUpdate() {
    console.log('font specimen componentDidUpdate');
    console.log(this.props);
  }

  componentDidMount() {

    var inner = $('.of-font-specimen');
    var self = this;

    $('.of-font-specimen-wrapper').on('scroll', function (e) {

      let innerHeight = inner.height();
      let scrollY = window.innerHeight + e.target.scrollTop;

      let isBottom = scrollY >= innerHeight;

      if (isBottom) {
        self.onScrollFinish();
        $('.of-font-specimen-wrapper').off('scroll');
      }
    });
  }

  componentWillUnmount() {
    $('.of-font-specimen-wrapper').off('scroll');
  }

  render() {

    let { font } = this.props;

    let creator;
    let creatorLink;

    let styleDesc;

    let foundry;

    let foundBy;
    let foundByLink;

    let fontName;

    let specimenClassName;

    let aboutText;

    let fontClassName;

    if (font) {
      creator = font['font-creator'];
      creatorLink = font['font-creator-link'];

      styleDesc = font['font-style'];

      foundry = font['font-foundry'];
      foundBy = font['info-discoverer'];

      fontName = font['font-name'];

      specimenClassName = 'of-font-specimen-image specimen-' + replaceNonAlphaNumeric(font['font-id']);

      let classification = font['info-classification'];
      let discoverer = foundBy;

      let about1 = fontName + ' was created by ' + creator;
      let about2 = foundry ? 'and is currently distributed by ' + foundry : '.';
      let about3 = 'It was submitted to us by ' + discoverer + '.' + styleDesc + ' is a ' + classification + ' cut of the ' + fontName + ' family.';

      aboutText = about1 + about2 + about3;

      fontClassName = font['font-id'];
    }

    console.log('specimenClassName', specimenClassName);

    return (
      <div className="of-font-specimen-wrapper">
        <div className="of-font-specimen">
          <div className="of-font-specimen-spacer-top"></div>

          { specimenClassName && <div className={specimenClassName}></div> }

          <div className="of-font-specimen-content">
            <h3>Specimen Artwork by</h3>
            { creatorLink
              ? <a href={creatorLink}><h4>{creator}</h4></a>
              : <h4 className={fontClassName}>{creator}</h4>
            }
          </div>

          { styleDesc
            && <div className="of-font-specimen-content"><h3>Style</h3><h4 className={fontClassName}>{styleDesc}</h4></div>
          }

          <div className="of-font-specimen-content">
            <h3>Characters</h3>
            <h4 className={fontClassName}>!@£$%^&*()</h4>
          </div>

          { foundry
            && <div className="of-font-specimen-content"><h3>Typedesigner, Foundry</h3><a><h4 className={fontClassName}>{foundry}</h4></a></div>
          }

          { foundBy
            && <div className="of-font-specimen-content"><h3>Found by</h3><h4>{foundBy}</h4></div>
          }

          <div className="of-font-specimen-content">
            <h3>About</h3>
            <p>{aboutText}</p>
          </div>

          <div className="of-font-specimen-content">
            <button>Source</button>
          </div>

          <div className="of-font-specimen-spacer-bottom"></div>
        </div>
      </div>
    )
  }
}