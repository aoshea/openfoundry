import React, { Component, PropTypes, findDOMNode } from 'react';

let data = window.siteJSON;

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.substr(1);
}

function maxmin(pos, min, max) {
	if (pos < min) { return min; }
	if (pos > max) { return max; }
	return pos;
}

const constants = {
  orientation: {
    horizontal: {
      dimension: 'width',
      direction: 'left',
      coordinate: 'x',
    },
    vertical: {
      dimension: 'height',
      direction: 'top',
      coordinate: 'y',
    }
  }
};

function replaceNonAlphaNumeric(str, replacement) {
  if (replacement === undefined || replacement === null) replacement = '_';
  return str.replace(/[^a-z0-9\.]/gim, replacement);
}

class Slider extends React.Component {
  
  constructor() {
    super();
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleTrackDown = this.handleTrackDown.bind(this);
    this.handleKnobDown = this.handleKnobDown.bind(this);
    this.position = this.position.bind(this);
    this.coordinates = this.coordinates.bind(this);
    this.getPositionFromValue = this.getPositionFromValue.bind(this);
    this.getValueFromPosition = this.getValueFromPosition.bind(this);
    
    this.state = {
      limit: 0,
      grab: 0
    };
  }

  componentDidMount() {
    let { orientation } = this.props;
  	let dimension = capitalize(constants.orientation[orientation].dimension);
  	const sliderPos = findDOMNode(this.refs.slider)['offset' + dimension];
  	const handlePos = findDOMNode(this.refs.handle)['offset' + dimension]
  	this.setState({
  		limit: sliderPos - handlePos,
  		grab: handlePos / 2,
  	});
  }
  
  handleTrackDown(e) {
    let value, { onChange } = this.props;
    if (!onChange) return;

    value = this.position(e);
    onChange && onChange(value);
  }
  
  getPositionFromValue(value) {
    let percentage, pos;
    let { limit } = this.state;
    let { min, max } = this.props;
    percentage = (value - min) / (max - min);
    pos = Math.round(percentage * limit);

    return pos;
  }

  getValueFromPosition(pos) {
    let percentage, value;
    let { limit } = this.state;
    let { orientation, min, max, step } = this.props;
    percentage = (maxmin(pos, 0, limit) / (limit || 1));

    if (orientation === 'horizontal') {
      value = step * Math.round(percentage * (max - min) / step) + min;
    } else {
      value = max - (step * Math.round(percentage * (max - min) / step) + min);
    }
    return value;
  }
  
  position(e) {
    let pos, value, { grab } = this.state;
    let { orientation } = this.props;
    const node = findDOMNode(this.refs.slider);
    const coordinateStyle = constants.orientation[orientation].coordinate;
    const directionStyle = constants.orientation[orientation].direction;
    const coordinate = e['client' + capitalize(coordinateStyle)];
    const direction = node.getBoundingClientRect()[directionStyle];

    pos = coordinate - direction - grab;
    value = this.getValueFromPosition(pos);

    return value;
  }
  
  handleDrag(e) {
    let value, { onChange } = this.props;
    if (!onChange) return;
    value = this.position(e);
    onChange && onChange(value);
  }
  
  handleDragEnd(e) {
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleDragEnd);
  }
  
  handleKnobDown(e) {
    document.addEventListener('mousemove', this.handleDrag);
  	document.addEventListener('mouseup', this.handleDragEnd);
  }
  
  noop(e) {
    e.stopPropagation();
    e.preventDefault();
  }
  
  coordinates (pos) {
    let value, fillPos, handlePos;
    let { limit, grab } = this.state;
    let { orientation } = this.props;

    value = this.getValueFromPosition(pos);
    handlePos = this.getPositionFromValue(value);
    
    if (orientation === 'horizontal') {
      fillPos = handlePos + grab;
    } else {
      fillPos = limit - handlePos + grab;
    }

    return {
      fill: fillPos,
      handle: handlePos,
    };
  }
  
  render() {
    let dimension, direction, position, coords, fillStyle, handleStyle;
  	let { value, orientation, className, label } = this.props;

    let labelStr = label + " " + value.toFixed(2);
    
  	dimension = constants.orientation[orientation].dimension;
  	direction = constants.orientation[orientation].direction;

  	position = this.getPositionFromValue(value);
  	coords = this.coordinates(position);

  	fillStyle = {[dimension]: `${coords.fill}px`};
  	handleStyle = {[direction]: `${coords.handle}px`};
        
    return <div ref="slider" className="of-font-slider">
    <span className="of-font-slider-track"></span>
    <span ref="fill" onClick={this.noop} onMouseDown={this.handleTrackDown} style={fillStyle} className="of-font-slider-fill"></span>
    <span ref="handle" onClick={this.noop} onMouseDown={this.handleKnobDown} style={handleStyle} className="of-font-slider-handle"><span ref="label" className="of-font-slider-label">{labelStr}</span></span>
    
    </div>
  }
}
Slider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.number,
  label: PropTypes.string,
  orientation: PropTypes.string,
  onChange: PropTypes.func,
  onChange: PropTypes.func
};
Slider.defaultProps = {
  min: 0,
  max: 100,
  step: 1,
  value: 0,
  label: "size",
  orientation: 'horizontal'
}

class FontSlider extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: 0
    };
  }
  
  componentDidMount() {
    this.setState({
      value: this.props.initial
    });
  }

  handleChange(value) {
    let { onUpdate } = this.props;
    
    this.setState({
      value: value
    });
    
    onUpdate && onUpdate(value);
  }

  render() {
    return (
      <div className="col-2">
      <Slider
      value={this.state.value}
      orientation="horizontal"
      label={this.props.label}
      min={this.props.min}
      max={this.props.max}
      step={this.props.step}
      onChange={this.handleChange} />
      </div>
    );
  }
}

class FontBackgroundToggle extends Component {
  
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      image: 0
    };
  }
  
  handleClick(e) {
    let { onUpdate, onUpdateColour } = this.props;
    let currentImageState = ++this.state.image % 3;
    console.log(currentImageState);
    this.setState({
      image: currentImageState
    });
    let colour = "#000000";
    if (currentImageState > 0) {
      colour = "#ffffff";
    }
    onUpdate && onUpdate(currentImageState);
    onUpdateColour && onUpdateColour(colour);
  }
  
  render() {
    
    let size = 32;
    let viewBox = [0, 0, size, size].join(' ');
    let imageStyle = {
      display: this.state.image < 2 ? "none" : "block"
    };
    let imageFirstStyle = {
      display: this.state.image > 1 ? "none": "block",
      stroke: this.state.image === 0 ? "black" : "white"
    };
    
    return (
      <svg onClick={this.handleClick} xmlns="http://www.w3.org/svg/2000"
        viewBox={viewBox}>
        <g id="of-font-toggle-no-image" style={imageFirstStyle} fill="none" >
	        <circle cx="16" cy="12.8" r="5.5"/>
          <circle cx="12" cy="19.2" r="5.5"/>
          <circle cx="20" cy="19.2" r="5.5"/>
        </g>
        <g id="of-font-toggle-image" style={imageStyle}>
          <path fill="#0000FF" d="M14,19.2c0-0.3,0-0.6,0.1-0.8c-2.1-0.7-3.7-2.6-4-4.8c-2.4,0.8-4.1,3-4.1,5.7c0,3.3,2.7,6,6,6
          c1.5,0,2.9-0.6,4-1.5C14.8,22.6,14,21,14,19.2z"/>
          <path fill="#00FF00" d="M21.9,13.6c-0.3,2.3-1.9,4.1-4,4.8c0,0.3,0.1,0.5,0.1,0.8c0,1.8-0.8,3.4-2,4.5c1.1,1,2.5,1.5,4,1.5
          c3.3,0,6-2.7,6-6C26,16.6,24.3,14.4,21.9,13.6z"/>
          <path fill="#FF0000" d="M16,14.8c1.1-1,2.5-1.5,4-1.5c0.7,0,1.3,0.1,1.9,0.3c0-0.3,0.1-0.5,0.1-0.8c0-3.3-2.7-6-6-6s-6,2.7-6,6
          c0,0.3,0,0.6,0.1,0.8c0.6-0.2,1.3-0.3,1.9-0.3C13.5,13.2,14.9,13.8,16,14.8z"/>
          <path fill="#00FFFF" d="M18,19.2c0-0.3,0-0.6-0.1-0.8c-0.6,0.2-1.3,0.3-1.9,0.3s-1.3-0.1-1.9-0.3c0,0.3-0.1,0.5-0.1,0.8
          c0,1.8,0.8,3.4,2,4.5C17.2,22.6,18,21,18,19.2z"/>
          <path fill="#FF00FF" d="M14.1,18.4c0.2-1.4,0.9-2.7,1.9-3.6c-1.1-1-2.5-1.5-4-1.5c-0.7,0-1.3,0.1-1.9,0.3
          C10.4,15.8,12,17.7,14.1,18.4z"/>
          <path fill="#FFFF00" d="M16,14.8c1,0.9,1.7,2.2,1.9,3.6c2.1-0.7,3.7-2.6,4-4.8c-0.6-0.2-1.3-0.3-1.9-0.3
          C18.5,13.2,17.1,13.8,16,14.8z"/>
          <path fill="#FFFFFF" d="M16,14.8c-1,0.9-1.7,2.2-1.9,3.6c0.6,0.2,1.3,0.3,1.9,0.3s1.3-0.1,1.9-0.3C17.7,17,17,15.7,16,14.8z"/>
        </g>
      </svg>
    )
  }
}

class FontColourBox extends Component {
  
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: ''
    };
  }
  
  handleChange(e) {
    let hex = e.target.value, { onUpdate } = this.props;
    
    if (hex.substr(0, 1) !== '#') {
      hex = '#' + hex;      
    }
    
    hex = hex.substr(0, 7);
    
    this.setState({
      value: hex
    });
    
    onUpdate && onUpdate(hex);
  }
  
  render() {
    let hexValue = this.state.value.substr(1);
    
    return (
      <div className="of-font-colour-input">
        <input type="text" value={hexValue} defaultValue={this.props.initial} onChange={this.handleChange} placeholder="000000" />
      </div>
    )
  }
}

class FontUppercase extends Component {
  
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      uppercase: false
    };
  }
  
  handleClick(e) {
    let { onUpdate } = this.props;
    let uppercase = !this.state.uppercase;
    
    this.setState({
      uppercase: uppercase
    });
    
    onUpdate && onUpdate(uppercase)
  }
  
  render() {
    
    let size = 32;
    let viewBox = [0, 0, size, size].join(' ');
    let onStyle = {
      display: this.state.uppercase ? "block" : "none"
    };
    let offStyle = {
      display: this.state.uppercase ? "none" : "block"
    };
  
    return (
      <svg onClick={this.handleClick} xmlns="http://www.w3.org/svg/2000"
        viewBox={viewBox}>
        <g id="of-font-uppercase-on" style={onStyle} >
          <path d="M10,21.6v-9.3H6.7v-1.9h8.8v1.9h-3.3v9.3H10z M19.8,21.6v-9.3h-3.3v-1.9h8.8v1.9H22v9.3H19.8z"/>
        </g>
        <g id="of-font-uppercase-off" style={offStyle}>
          <path d="M10.8,21.6v-9.3H7.5v-1.9h8.8v1.9h-3.3v9.3H10.8z M24.3,13.5v1.7h-1.5v3.3c0,0.7,0,1,0,1.2c0,0.1,0.1,0.2,0.2,0.3
	c0.1,0.1,0.2,0.1,0.4,0.1c0.2,0,0.5-0.1,0.9-0.2l0.2,1.7c-0.5,0.2-1.1,0.3-1.7,0.3c-0.4,0-0.7-0.1-1-0.2c-0.3-0.1-0.5-0.3-0.7-0.5
	c-0.1-0.2-0.2-0.5-0.3-0.8c0-0.2-0.1-0.7-0.1-1.5v-3.5h-1v-1.7h1v-1.6l2.1-1.2v2.8H24.3z"/>
        </g>
      </svg>
    )
  }
}

class FontColours extends Component {
  render() {
    return (
      <div className="col-2">
        <FontColourBox initial={this.props.initial} onUpdate={this.props.onUpdate} />
        <div className="of-font-background-toggle-container">
          <FontBackgroundToggle onUpdateColour={this.props.onUpdate} onUpdate={this.props.onUpdateBackground} />
        </div>
        <div className="of-font-uppercase-toggle-container">
          <FontUppercase onUpdate={this.props.onUpdateTextTransform} />
        </div>
      </div>
    )
  }
}

class FontPreviewContainer extends Component {
  
  constructor() {
    super();
    
    this.onUpdateSize = this.onUpdateSize.bind(this);
    this.onUpdateLineHeight = this.onUpdateLineHeight.bind(this);
    this.onUpdateLetterSpacing = this.onUpdateLetterSpacing.bind(this);
    this.onUpdateColour = this.onUpdateColour.bind(this);
    this.onUpdateBackground = this.onUpdateBackground.bind(this);
    this.onUpdateTextTransform = this.onUpdateTextTransform.bind(this);
    
    this.state = {
      size: 0,
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
    
    this.setState({
      size: fontSize,
      lineHeight: lineHeight,
      letterSpacing: letterSpacing,
      color: color,
      background: 0
    });
  }
  
  onUpdateSize(value) {
    this.setState({
      size: value
    });
  }
  
  onUpdateLetterSpacing(value) {
    this.setState({
      letterSpacing: value.toFixed(2)
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
    console.log('update text transform', value);
    this.setState({
      uppercase: value
    });
  }
  
  render() {
    
    let fontClassName = replaceNonAlphaNumeric(this.props.name).toLowerCase();
    
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
           
    return <div className={backgroundClassName} style={backgroundStyle}>
    <div className="of-grid-container"><div className="of-row">
      <FontSlider label="size" initial={fontSize} max={maxFontSize} step={stepFontSize} min={minFontSize} onUpdate={this.onUpdateSize} />
      <FontSlider label="leading" initial={lineHeight} max={maxLineHeight} step={stepLineHeight} min={minLineHeight} onUpdate={this.onUpdateLineHeight} />
      <FontSlider label="kerning" initial={letterSpacing} max={maxLetterSpacing} step={stepLetterSpacing}  min={minLetterSpacing} onUpdate={this.onUpdateLetterSpacing} />
      <FontColours initial={color} onUpdate={this.onUpdateColour} onUpdateBackground={this.onUpdateBackground} onUpdateTextTransform={this.onUpdateTextTransform} />
    </div></div>
    <div data-font={this.props.name} style={fontStyle} className={"of-font-preview-text-container " + fontClassName}>
    {this.props.name} . {this.props.creator}
    </div>
    </div>    
  }
}

class FontList extends Component {  
  render() {
    let fonts = this.props.fonts.map((font, i) => {
      let config  = font[0];
      let sources = font[1];
            
      return (
        <FontPreviewContainer key={i} name={config.name} creator={config.creator} settings={config.settings} />
      )
    })
    
    return <div className="of-font-list">{fonts}</div>
  }
}

React.render(
  <FontList fonts={data} />,
  document.body
);