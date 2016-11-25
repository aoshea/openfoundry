import React, { Component, PropTypes } from 'react';
import { setFontSize } from '../../actions/actions.js';
import { Link } from 'react-router';
import { replaceNonAlphaNumeric } from '../../util/util.js';
import FontSlider from 'components/font-slider/font-slider.js';
import FontColours from 'components/font-colours/font-colours.js';
import FontLikeButton from 'components/font-like-button/font-like-button.js';
import FontShareButton from 'components/font-share-button/font-share-button.js';
import FontPreviewText from 'components/font-preview-text/font-preview-text.js';
import FontPreviewFooter from 'components/font-preview-footer/font-preview-footer'
import classNames from 'classnames';
import shuffle from 'shuffle-array';
import { getFontId, getShareMessage, getFullFontName } from 'util/content_util.js';

class FontPreview extends Component {

  static propTypes = {
    onSetFontSize: PropTypes.func.isRequired,
    onSetFontLeading: PropTypes.func.isRequired,
    onSetFontTracking: PropTypes.func.isRequired,
    onSetFontColour: PropTypes.func.isRequired,
    onSetFontTransform: PropTypes.func.isRequired,
    onSetFontBackground: PropTypes.func.isRequired,
    font: PropTypes.object.isRequired,
    rank: PropTypes.number,
    likeCount: PropTypes.number.isRequired,
    isSpecimen: PropTypes.bool
  }

  constructor(props) {

    super(props);

    this.handleMoreClick = this.handleMoreClick.bind(this);

    this.backgroundIndex = FontPreview.getRandomBackground();

    this.onUpdateColour = this.onUpdateColour.bind(this);
    this.onUpdateBackground = this.onUpdateBackground.bind(this);
    this.onUpdateTextTransform = this.onUpdateTextTransform.bind(this);

    this.onSizeSliderUpdate = this.onSizeSliderUpdate.bind(this);
    this.onLeadingSliderUpdate = this.onLeadingSliderUpdate.bind(this);
    this.onTrackingSliderUpdate = this.onTrackingSliderUpdate.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { font: nextFont, likeCount: nextLikeCount } = nextProps
    const { font: prevFont, likeCount: prevLikeCount } = this.props

    if (prevFont.get('settingsFontSize') !== nextFont.get('settingsFontSize')) return true
    if (prevFont.get('settingsLineHeight') !== nextFont.get('settingsLineHeight')) return true
    if (prevFont.get('settingsLetterSpacing') !== nextFont.get('settingsLetterSpacing')) return true
    if (prevFont.get('settingsBackgroundState') !== nextFont.get('settingsBackgroundState')) return true
    if (prevFont.get('settingsColor') !== nextFont.get('settingsColor')) return true
    if (prevFont.get('settingsTextTransform') !== nextFont.get('settingsTextTransform')) return true
    if (prevLikeCount !== nextLikeCount) return true
    return false
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }

  componentDidMount() {
    // Hack in a smaller font for mobiles
    if (window.matchMedia && window.matchMedia("(max-width: 667px)").matches && !this.state.font.scaled) {

      const { onSetFontSize, font } = this.props

      this.timeout = setTimeout(() => {

        onSetFontSize({
          id: font.get('id'),
          value: parseInt(font.get('settingsFontSize') / 2, 10)
        })
      }, 1);
    }
  }

  handleMoreClick(e) {

    const fontPreview = this.refs.fontPreview;
    const offsetTop = fontPreview.getBoundingClientRect().top;

    window.tempOffset = offsetTop;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    const { onMoreUpdate } = this.props;
    onMoreUpdate && onMoreUpdate(scrollTop, offsetTop, e);
  }

  onUpdateBackground(value) {

    const { onSetFontBackground, font } = this.props;

    // Update new random background?
    // if (value === 'image') this.backgroundIndex = FontPreview.getRandomBackground();

    onSetFontBackground({
      id: font.get('id'),
      value
    });
  }

  onUpdateColour(value) {

    const { onSetFontColour, font } = this.props;

    onSetFontColour({
      id: font.get('id'),
      value
    });
  }

  onUpdateTextTransform(value) {

    const { onSetFontTransform, font } = this.props;
    const textTransformValue = value ? 'uppercase' : 'none'

    onSetFontTransform({
      id: font.get('id'),
      value: textTransformValue
    })
  }

  onSizeSliderUpdate(value) {

    const { onSetFontSize, font } = this.props;

    onSetFontSize({
      id: font.get('id'),
      value
    });
  }

  onLeadingSliderUpdate(value) {

    const { onSetFontLeading, font } = this.props;

    onSetFontLeading({
      id: font.get('id'),
      value
    });
  }

  onTrackingSliderUpdate(value) {

    const { onSetFontTracking, font } = this.props;

    onSetFontTracking({
      id: font.get('id'),
      value
    });
  }

  render() {

    const { font, rank, isSpecimen, likeCount } = this.props;

    const fontId = font.get('id');
    const fontName = font.get('fontName');

    // Text body content
    const fontText = font.get('settingsText');
    const fontClassNames = "of-font-preview-text-container " + fontId;

    // Get font sizes and max, min, step
    const fontSize = font.get('settingsFontSize');
    const maxFontSize = 150;
    const minFontSize = 9;
    const stepFontSize = 1;

    // Get line height (leading) values
    const lineHeight = font.get('settingsLineHeight');
    const maxLineHeight = 2;
    const minLineHeight = 0.5;
    const stepLineHeight = 0.05;
    const leadingDigits = 2;

    // Get letter-spacing (tracking)
    const letterSpacing = font.get('settingsLetterSpacing');
    const minLetterSpacing = font.get('settingsLetterSpacingMin');
    const maxLetterSpacing = 1;
    const stepLetterSpacing = 0.05;
    const letterSpacingDigits = 3;

    // Background image / colour
    const backgroundState = font.get('settingsBackgroundState');
    const backgroundIndex = this.backgroundIndex;
    const backgroundStyle = {
      backgroundImage: backgroundState === 'image' ? `url(/data/backgrounds/of-backdrop-0${backgroundIndex}.jpg)` : 'none'
    };

    // FontColours — Colour, text transform etc.
    const color = font.get('settingsColor');
    const uppercase = font.get('settingsTextTransform') === 'uppercase';

    // Create font style object to reflect settings
    const fontStyle = {
      color: `${color}`,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}em`,
      textTransform : font.get('settingsTextTransform'),
      letterSpacing: `${letterSpacing}em`
    };

    // Wrapper class names, used for background image / colour
    const containerClassNames = classNames({
      'of-font-preview-container': true,
      'is-image': backgroundState === 'image',
      'is-black': backgroundState === 'black',
      'white-noimage is-white': backgroundState === 'white',
      'black-image': backgroundState !== 'white',
      'is-fixed': isSpecimen
    });

    const isList = true

    return (
      <div ref="fontPreview" className={containerClassNames} style={backgroundStyle}>
        <div className="of-font-preview-ui">
          <div className="of-grid-container">
            <div className="of-row">
              <FontSlider
                label="size"
                initial={fontSize}
                value={fontSize}
                max={maxFontSize}
                step={stepFontSize}
                min={minFontSize}
                onUpdate={this.onSizeSliderUpdate} />
              <FontSlider
                label="leading"
                initial={lineHeight}
                value={lineHeight}
                fixed={leadingDigits}
                min={minLineHeight}
                max={maxLineHeight}
                step={stepLineHeight}
                onUpdate={this.onLeadingSliderUpdate} />
              <FontSlider
                label="tracking"
                initial={letterSpacing}
                value={letterSpacing}
                fixed={letterSpacingDigits}
                min={minLetterSpacing}
                max={maxLetterSpacing}
                step={stepLetterSpacing}
                onUpdate={this.onTrackingSliderUpdate} />
              <FontColours
                color={color}
                backgroundState={backgroundState}
                uppercase={uppercase}
                onUpdate={this.onUpdateColour}
                onUpdateBackground={this.onUpdateBackground}
                onUpdateTextTransform={this.onUpdateTextTransform} />
              <div className="col-2 more-button-container">
                <Link onClick={this.handleMoreClick} to={`/hot30/${fontId}`}>
                  { isSpecimen
                    ? <span className="more-button source-mode">Source Page</span>
                    : <span className="more-button default-mode">Explore Font</span> }
                </Link>
              </div>
            </div>
          </div>
        </div>
        <FontPreviewText
          fontClassNames={fontClassNames}
          fontStyle={fontStyle}
          content={fontText} />
        <FontPreviewFooter
          rank={rank}
          onMoreClick={this.handleMoreClick}
          font={font}
          likeCount={likeCount}
          isList={isList} />
      </div>
    )
  }
}

FontPreview.getRandomBackground = (function () {

  const numBackgrounds = 41;
  const backgroundList = shuffle(Array(numBackgrounds).fill(0).map((o, i) => i + 1));
  let index = 0;

  const pad2 = n => n < 10 ? "0" + n : n;

  return () => {
    index = (index + 1) % numBackgrounds;
    const bgNum = backgroundList[index];
    return pad2(bgNum);
  }
}());

export default FontPreview