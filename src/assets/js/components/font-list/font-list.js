import React, { Component } from 'react';
import FontPreviewContainer from '../../components/font-preview-container/font-preview-container.js';

export default class FontList extends Component {  
  render() {
    let fonts = this.props.fonts.map((font, i) => {      
      let config  = font[0], 
          sources = font[1];     
      return (
        <FontPreviewContainer rank={i+1} key={i} name={config.name} creator={config.creator} settings={config.settings} />
      )
    })    
    return <div className="of-font-list">{fonts}</div>
  }
}