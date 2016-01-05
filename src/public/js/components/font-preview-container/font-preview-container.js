import React, { Component } from 'react';
import { replaceNonAlphaNumeric } from '../../util/util.js';
import FontSlider from '../../components/font-slider/font-slider.js';
import FontColours from '../../components/font-colours/font-colours.js';
import FontLikeButton from '../../components/font-like-button/font-like-button.js';
import $ from 'jquery';

export default class FontPreviewContainer extends Component {
  
  constructor() {
    super();
    
    this.onUpdateSize = this.onUpdateSize.bind(this);
    this.onUpdateLineHeight = this.onUpdateLineHeight.bind(this);
    this.onUpdateLetterSpacing = this.onUpdateLetterSpacing.bind(this);
    this.onUpdateColour = this.onUpdateColour.bind(this);
    this.onUpdateBackground = this.onUpdateBackground.bind(this);
    this.onUpdateTextTransform = this.onUpdateTextTransform.bind(this);
    this.onUpdateLikes = this.onUpdateLikes.bind(this);
    
    this.state = {
      size: 0,
      likes: 0,
      letterSpacing: 0,
      lineHeight: 0,
      color: '#000',
      background: 0,
      uppercase: false
    };
  }
  
  componentDidMount() {
        
    let fontSize = parseInt(this.props.settings['font-size'], 10);
    let lineHeight = parseFloat(this.props.settings['line-height'], 10);
    let letterSpacing = parseFloat(this.props.settings['letter-spacing'], 10);
    let color = this.props.settings['color'];
    let likes = parseInt(this.props.votes.fontlist, 10);
    let backgroundState = this.props.settings['background-state'];
    let background = 0;
    let backgroundNum = 0;
    if (backgroundState === 'image') {
      background = 2;
      backgroundNum = ( parseInt(Math.random()*9, 10)+1 );
    } else if (backgroundState === 'black') {
      background = 1;
    } else {
      background = 0;
    }
    
    this.setState({
      size: fontSize,
      likes: likes,
      lineHeight: lineHeight,
      letterSpacing: letterSpacing,
      color: color,
      background: background,
      backgroundNum: backgroundNum,
      locked: false
    });
    
    // AJAX request for the real vote 
    $.get('api/fonts/' + replaceNonAlphaNumeric(this.props.name), function(res) {
            
      if (res && res.fontId) {
        let likes = parseInt(res.likes, 10);
        let locked = res.locked;  
        
        this.setState({
          likes: likes,
          locked: locked
        });
      }
            
    }.bind(this));  
  }
  
  onLikeResult(res) {
    console.log('onLikeResult', res);
  }
  
  onUpdateLikes(value) {
    value = value || this.state.likes + 1;        
        
    $.get('api/like/' + replaceNonAlphaNumeric(this.props.name), this.onLikeResult); 
    
    this.setState({
      likes: parseInt(value, 10)
    });
  }
  
  onUpdateSize(value) {
    this.setState({
      size: parseInt(value, 10)
    });
  }
  
  onUpdateLetterSpacing(value) {
    this.setState({
      letterSpacing: value.toFixed(3)
    });
  }
  
  onUpdateLineHeight(value) {
    this.setState({
      lineHeight: value.toFixed(2)
    });
  }
  
  onUpdateColour(value) {
    this.setState({
      color: value
    });
  }
  
  onUpdateBackground(value) {
    this.setState({
      background: value,
      backgroundNum: ( parseInt(Math.random()*9, 10)+1 )
    });
  }
  
  onUpdateTextTransform(value) {
    this.setState({
      uppercase: value
    });
  }
  
  render() {
    
    let rankPadded = ("0" + this.props.rank).slice(-2); 
    
    let rankLabel = rankPadded + " / " + this.props.name;
    if (this.props.creator) {
      rankLabel += ", " + this.props.creator; 
    } 
    
    let fontClassName = "of-font-preview-text-container " + replaceNonAlphaNumeric(this.props.name).toLowerCase();
    
    let fontSize = parseInt(this.props.settings['font-size'], 10);
    let lineHeight = parseFloat(this.props.settings['line-height'], 10);
    let letterSpacing = parseFloat(this.props.settings['letter-spacing'], 10);
    let color = this.props.settings['color'];

    let maxFontSize = 150;
    let minFontSize = 9;
    
    let maxLineHeight = 2;
    let minLineHeight = 0.5;
    
    let minLetterSpacing = 0;
    let maxLetterSpacing = 1;
    
    let stepFontSize = 1;
    let stepLetterSpacing = 0.025;
    let stepLineHeight = 0.05;
    
    let textTransform = this.state.uppercase ? "uppercase" : "none";
    
    let fontStyle = { 
      "fontSize" : `${this.state.size}px`,
      "letterSpacing": `${this.state.letterSpacing}em`,
      "lineHeight": `${this.state.lineHeight}em`,
      "color": `${this.state.color}`,
      "textTransform": textTransform
    };
    
    let backgroundState = this.state.background;
        
    let backgroundStyle = {
      "backgroundImage": backgroundState === 2 ? "url(data/backgrounds/of-backdrop-00" + this.state.backgroundNum + ".jpg)" : "none"
    };
    
    let backgroundClassName = backgroundState === 0 ? "of-font-preview-container" : "of-font-preview-container black-image";
    
    return (
      <div className={backgroundClassName} style={backgroundStyle}>
        
        <div className="of-font-preview-ui">
          <div className="of-grid-container">
            <div className="of-row">
              <FontSlider label="size" 
                initial={fontSize} 
                max={maxFontSize} 
                step={stepFontSize} 
                min={minFontSize} 
                onUpdate={this.onUpdateSize} />
              
              <FontSlider 
                label="leading" 
                initial={lineHeight} 
                min={minLineHeight}
                max={maxLineHeight} 
                step={stepLineHeight} 
                onUpdate={this.onUpdateLineHeight} />
              
              <FontSlider 
                label="kerning" 
                initial={letterSpacing} 
                min={minLetterSpacing} 
                max={maxLetterSpacing} 
                step={stepLetterSpacing}          
                onUpdate={this.onUpdateLetterSpacing} />
              
              <FontColours 
                initial={color} 
                background={backgroundState} 
                onUpdate={this.onUpdateColour} 
                onUpdateBackground={this.onUpdateBackground} 
                onUpdateTextTransform={this.onUpdateTextTransform} />
            
              <div className="col-2 offset-1 more-button-container"><span className="more-button">More</span></div>
            </div>
          </div>
        </div>
      
        <div className={fontClassName} style={fontStyle}>
          {this.props.settings.text}
        </div>
                              
        <div className="of-font-preview-footer">
          <div className="of-footer-inner">
            <div className="of-grid-container">
              <div className="of-row">
                <div className="col-4 rank">{rankLabel}</div>
          
                <div className="col-2 offset-5 rank vote-container">
                  <FontLikeButton locked={this.state.locked} likes={this.state.likes} onUpdate={this.onUpdateLikes} />                  
                </div>
              </div>
            </div>
          </div>
        </div>
      
      </div>
    )
  }
}
