import React, { Component } from 'react';

export default class FontSpecimen extends Component { 
  
  render() {
        
    let f = this.props.font;
    let { creator } = f;
    let creatorLink = f["creator-link"];

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
      
        <div className="of-font-specimen-content">
          <h3>Style</h3>
          <h4>Bold Italic</h4>
        </div>
      
        <div className="of-font-specimen-content">
          <h3>Characters</h3>
          <h4>!@£$%^&*()</h4>
        </div>
      
        <div className="of-font-specimen-content">
          <h3>Typedesigner, Foundry</h3>
          <a><h4>Simon Niedermeier, Unfun</h4></a>
        </div>
      
        <div className="of-font-specimen-content">
          <h3>Found by</h3>
          <a><h4>Open Foundry</h4></a>
        </div>
      
        <div className="of-font-specimen-content">
          <button>Source</button>
        </div>      
          
        <div className="of-font-specimen-spacer-bottom"></div>
      </div>
    )
  }
}