import React, { Component } from 'react';
import $ from 'jquery';

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

    let specimenClassName;
    if (font) {
      creator = font['font-creator'];
      creatorLink = font['font-creator-link'];

      styleDesc = font['font-style'];

      foundry = font['font-foundry'];
      foundBy = font['info-discoverer'];

      specimenClassName = 'of-font-specimen-image specimen-' + font['font-id'];
    }

    return (
      <div className="of-font-specimen-wrapper">
        <div className="of-font-specimen">
          <div className="of-font-specimen-spacer-top"></div>

          { specimenClassName && <div className={specimenClassName}></div> }

          <div className="of-font-specimen-content">
            <h3>Specimen Artwork by</h3>
            { creatorLink
              ? <a href={creatorLink}><h4>{creator}</h4></a>
              : <h4>{creator}</h4>
            }
          </div>

          { styleDesc
            && <div className="of-font-specimen-content"><h3>Style</h3><h4>{styleDesc}</h4></div>
          }

          <div className="of-font-specimen-content">
            <h3>Characters</h3>
            <h4>!@£$%^&*()</h4>
          </div>

          { foundry
            && <div className="of-font-specimen-content"><h3>Typedesigner, Foundry</h3><a><h4>{foundry}</h4></a></div>
          }

          { foundBy
            && <div className="of-font-specimen-content"><h3>Found by</h3><h4>{foundBy}</h4></div>
          }

          <div className="of-font-specimen-content">
            <button>Source</button>
          </div>

          <div className="of-font-specimen-spacer-bottom"></div>
        </div>
      </div>
    )
  }
}