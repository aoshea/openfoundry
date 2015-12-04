import React from 'react';

let data = window.siteJSON;

function replaceNonAlphaNumeric(str, replacement) {
  if (replacement === undefined || replacement === null) replacement = '_';
  return str.replace(/[^a-z0-9\.]/gim, replacement);
}

class FontPreviewContainer extends React.Component {
  render() {
    
    let fontClassName = replaceNonAlphaNumeric(this.props.name).toLowerCase();
    
    return <div className="of-font-preview-container">
    <div data-font={this.props.name} className={"of-font-preview-text-container " + fontClassName}>
    {this.props.name}
    {this.props.creator}
    </div>
    </div>    
  }
}

class FontList extends React.Component {  
  render() {
    
    let fonts = this.props.fonts.map((font, i) => {
      let config  = font[0];
      let sources = font[1];
      
      return (
        <FontPreviewContainer key={i} name={config.name} creator={config.creator} />
      )
    })
    
    return <div className="of-font-list">{fonts}</div>
  }
}

React.render(
  <FontList fonts={data} />,
  document.body
);