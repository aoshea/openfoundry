import React, { Component } from 'react';
import { Link } from 'react-router';
import { replaceNonAlphaNumeric } from '../../util/util.js';
import FontSlider from '../../components/font-slider/font-slider.js';
import FontColours from '../../components/font-colours/font-colours.js';
import FontLikeButton from '../../components/font-like-button/font-like-button.js';
import FontShareButton from '../../components/font-share-button/font-share-button.js';
import FontText from './font-text/font-text.js';
import $ from 'jquery';
import classNames from 'classnames';

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

    if (!font) return;

    let fontSize = parseInt(font['settings-font-size'], 10);
    let lineHeight = parseFloat(font['settings-line-height'], 10);
    let letterSpacing = parseFloat(font['settings-letter-spacing'], 10);
    let color = font['settings-color'];
    let likes = 0;
    let backgroundState = font['settings-background-state'];
    let background = 0;
    let backgroundNum = 0;

    let uppercase = font['settings-text-transform'] === 'uppercase';

    if (backgroundState === 'image') {
      // If image, set random background image index with backgroundNum
      background = 2;
      backgroundNum = FontPreviewContainer.getRandomBackground(); // (parseInt(Math.random() * 9, 10) + 1);
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
      locked: false,
      uppercase: uppercase
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

    var scrollTop = $(window).scrollTop();

    const { onMoreUpdate } = this.props;
    onMoreUpdate && onMoreUpdate(scrollTop);
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
      backgroundNum: FontPreviewContainer.getRandomBackground()
    });
  }

  onUpdateTextTransform(value) {
    this.setState({
      uppercase: value
    });
  }

  render() {

    const props = this.props;

    let { font } = props;

    if (!font) {
      return <div>No font id</div>
    }

    let fontId = replaceNonAlphaNumeric(font['font-id']).toLowerCase();
    let fontName = replaceNonAlphaNumeric(font['font-name']).toLowerCase();
    let rankPadded = ("0" + this.props.rank).slice(-2);

    let rhyphen = " —";
    let rankSpace = " ";

    let oFontName = font['font-name'];

    let oFontCreator = font['font-creator'];
    let oFontCreatorLink = font['font-creator-link'];
    let spanFontCreator = oFontCreatorLink ? <span><a href={oFontCreatorLink}>{oFontCreator}</a></span> : <span>{oFontCreator}</span>

    let oFontStyle = font['font-style'] + ', ';

    let rankLabel = <div><span>{rankPadded}</span><span>{rhyphen} </span><span>{oFontName}</span><span>{rankSpace}</span><span>{oFontStyle}</span>{spanFontCreator}</div>

    let fontClassName = "of-font-preview-text-container " + fontId;

    let fontSize = parseInt(font['settings-font-size'], 10);
    let lineHeight = parseFloat(font['settings-line-height'], 10);
    let letterSpacing = parseFloat(font['settings-letter-spacing'], 10);
    let color = font['settings-color'];

    let maxFontSize = 150;
    let minFontSize = 9;

    let maxLineHeight = 2;
    let minLineHeight = 0.5;

    let minLetterSpacing = parseFloat(font['settings-letter-spacing-min'], 10);
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
      backgroundImage: backgroundState === 2 ? "url(data/backgrounds/of-backdrop-0" + this.state.backgroundNum + ".jpg)" : "none"
    };

    let letterSpacingDigits = 3;
    let leadingDigits = 2;

    const previewClassName = classNames({
      'of-font-preview-container': true,
      'is-image': backgroundState === 2,
      'is-black': backgroundState === 1,
      'white-noimage is-white': backgroundState === 0,
      'black-image': backgroundState !== 0,
      'is-fixed': props.fixed
    });

    return (
      <div className={previewClassName} style={backgroundStyle}>

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
                fixed={leadingDigits}
                min={minLineHeight}
                max={maxLineHeight}
                step={stepLineHeight}
                onUpdate={this.onUpdateLineHeight} />

              <FontSlider
                label="kerning"
                initial={letterSpacing}
                fixed={letterSpacingDigits}
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
                <Link onClick={this.handleMoreClick} to={`/hot30/${fontId}`}>
                  { props.fixed
                    ? <span className="more-button source-mode">Source &lsaquo; &rsaquo;</span>
                    : <span className="more-button default-mode">More</span> }
                </Link>
              </div>
            </div>
          </div>
        </div>

        <FontText
          fontClasses={fontClassName}
          fontStyle={fontStyle}
          content={font['settings-text']}/>

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

var numBackgrounds = 41;

FontPreviewContainer.getRandomBackground = function () {
  let randNum = --numBackgrounds;
  if (randNum < 0) randNum = 0;

  var num = Math.floor(Math.random() * randNum) + 1;
  var len = num.toString().length;
  if (len < 2) num = "0" + num;
  return num;

};