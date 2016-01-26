import React, { Component } from 'react';
import { Link } from 'react-router';
import { replaceNonAlphaNumeric } from '../../util/util.js';
import FontSlider from '../../components/font-slider/font-slider.js';
import FontColours from '../../components/font-colours/font-colours.js';
import FontLikeButton from '../../components/font-like-button/font-like-button.js';
import FontShareButton from '../../components/font-share-button/font-share-button.js';
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

    this.handleMoreClick = this.handleMoreClick.bind(this);

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

    let { font } = this.props;

    let fontSize = parseInt(font['settings-font-size'], 10);
    let lineHeight = parseFloat(font['settings-line-height'], 10);
    let letterSpacing = parseFloat(font['settings-letter-spacing'], 10);
    let color = font['settings-color'];
    let likes = 0;
    let backgroundState = font['settings-background-state'];
    let background = 0;
    let backgroundNum = 0;

    if (backgroundState === 'image') {
      // If image, set random background image index with backgroundNum
      background = 2;
      backgroundNum = (parseInt(Math.random() * 9, 10) + 1);
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
    $.get('api/fonts/' + replaceNonAlphaNumeric(font['font-id']), function (res) {

      if (res.doc && res.doc.fontId) {
        let likes = parseInt(res.doc.likes, 10);
        let locked = res.locked;

        this.setState({
          likes: likes,
          locked: locked
        });
      }

    }.bind(this));
  }

  handleMoreClick(e) {
    console.log('handleMoreClick');
  }

  onLikeResult(res) {
    console.log('onLikeResult', res);
  }

  onUpdateLikes(value) {
    value = value || this.state.likes + 1;

    $.get('api/like/' + replaceNonAlphaNumeric(this.props.font['font-id']), this.onLikeResult);

    this.setState({
      likes: parseInt(value, 10),
      locked: true
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
      backgroundNum: (parseInt(Math.random() * 9, 10) + 1)
    });
  }

  onUpdateTextTransform(value) {
    this.setState({
      uppercase: value
    });
  }

  render() {

    let { font } = this.props;

    let fontId = replaceNonAlphaNumeric(font['font-id']).toLowerCase();
    let fontName = replaceNonAlphaNumeric(font['font-name']).toLowerCase();
    let rankPadded = ("0" + this.props.rank).slice(-2);

    let rankLabel = rankPadded + " – " + font['font-name'];
    if (font['font-creator']) {
      rankLabel += ", " + font['font-creator'];
    }

    let fontClassName = "of-font-preview-text-container " + fontId;

    let fontSize = parseInt(font['settings-font-size'], 10);
    let lineHeight = parseFloat(font['settings-line-height'], 10);
    let letterSpacing = parseFloat(font['settings-letter-spacing'], 10);
    let color = font['settings-color'];

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
      fontSize: `${this.state.size}px`,
      letterSpacing: `${this.state.letterSpacing}em`,
      lineHeight: `${this.state.lineHeight}em`,
      color: `${this.state.color}`,
      textTransform : textTransform
    };

    let backgroundState = this.state.background;

    let backgroundStyle = {
      backgroundImage: backgroundState === 2 ? "url(data/backgrounds/of-backdrop-00" + this.state.backgroundNum + ".jpg)" : "none"
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

              <div className="col-2 more-button-container">
                <Link to={`/open/${fontName}`}>
                  <span className="more-button">More</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className={fontClassName} style={fontStyle}>
          {font['settings-text']}
        </div>

        <div className="of-font-preview-footer">
          <div className="of-footer-inner">
            <div className="of-grid-container">
              <div className="of-row">
                <div className="col-10 rank">{rankLabel}</div>
                <div className="col-2 social">
                  <FontLikeButton locked={this.state.locked} likes={this.state.likes} onUpdate={this.onUpdateLikes} /><FontShareButton />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}
