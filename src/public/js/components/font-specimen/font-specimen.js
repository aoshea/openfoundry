import React, { Component } from 'react';

export default class FontSpecimen extends Component {

  render() {

    let { font } = this.props;
    let creator;
    let creatorLink;

    let styleDesc;

    let foundry;

    let foundBy;
    let foundByLink;

    if (font) {
      creator = font['font-creator'];
      creatorLink = font['font-creator-link'];

      styleDesc = font['font-style'];

      foundry = font['font-foundry'];
      foundBy = font['info-discoverer'];
    }



    return (
      <div className="of-font-specimen">
        <div className="of-font-specimen-spacer-top"></div>

        <div className="of-font-specimen-svg">
          <img src="/img/specimen-bagnard-regular.svg" />
        </div>

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
    )
  }
}