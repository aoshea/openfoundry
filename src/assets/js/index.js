import React from 'react';

let data = window.siteJSON;

class FontPreview extends React.Component {
  render() {
    return <div className="fontPreview">
    <div className="fontName">{this.props.name}</div>
    <div className="fontCreator">{this.props.creator}</div>
    </div>    
  }
}

class FontList extends React.Component {  
  render() {
    
    let fonts = this.props.fonts.map((font, i) => {
      let config  = font[0];
      let sources = font[1];
      
      return (
        <FontPreview key={i} name={config.name} creator={config.creator} />
      )
    })
    
    return <div className="fontPreview">{fonts}</div>
  }
}

React.render(
  <FontList fonts={data} />,
  document.body
);