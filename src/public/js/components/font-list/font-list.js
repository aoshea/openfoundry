import React, { Component } from 'react';
import { replaceNonAlphaNumeric } from '../../util/util.js';
import FontPreviewContainer from '../../components/font-preview-container/font-preview-container.js';
import FontSpecimen from '../../components/font-specimen/font-specimen.js';
import $ from 'jquery';

export default class FontList extends Component {  
  
  constructor() {
    super() 
    
    this.state = {
      specimen: false
    };
  }
  
  componentDidMount() {
    this.setState({
      specimen: false
    });
  }
    
  render() {
    let fonts = this.props.fonts.map((font, i) => {      
      let config  = font[0], 
          sources = font[1];     
      return (
        <FontPreviewContainer rank={i+1} key={i} name={config.name} creator={config.creator} votes={config.votes} settings={config.settings} />
        
      )
    })    
    return (
      <div className="of-font-list">
        {fonts}
        { this.state.specimen ? <FontSpecimen /> : null }
      </div>
    )
  }
}