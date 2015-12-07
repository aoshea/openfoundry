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

    let labelStr = label + " " + value;
    
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
      value: this.props.initial * 100
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
      <div className="of-grid-container"><div className="of-row"><div className="col-2">
      <Slider
      value={this.state.value}
      orientation="horizontal"
      label="size"
      onChange={this.handleChange} />
      </div>
      </div>
      </div>
    );
  }
}

class FontPreviewContainer extends Component {
  
  constructor() {
    super();
    
    this.onUpdateSize = this.onUpdateSize.bind(this);
    
    this.state = {
      size: 0
    };
  }
  
  componentDidMount() {
    let fontSize = parseInt(this.props.settings['font-size'], 10);
    
    this.setState({
      size: fontSize
    });
  }
  
  onUpdateSize(value) {
    this.setState({
      size: value
    });
  }
  
  render() {
    
    let fontClassName = replaceNonAlphaNumeric(this.props.name).toLowerCase();
    let fontSize = parseInt(this.props.settings['font-size'], 10);
    let maxFontSize = 100;
    let fontSizePercentage = fontSize / maxFontSize;

    let fontStyle = { "fontSize" : `${this.state.size}px` };
        
    return <div className="of-font-preview-container">
    <FontSlider initial={fontSizePercentage} onUpdate={this.onUpdateSize} />
    <div data-font={this.props.name} style={fontStyle} className={"of-font-preview-text-container " + fontClassName}>
    {this.props.name} . {this.props.creator}
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