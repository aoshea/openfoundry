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

  propTypes: {
    onSetFontSize: PropTypes.func.isRequired,
    onSetFontLeading: PropTypes.func.isRequired,
    onSetFontTracking: PropTypes.func.isRequired,
    onSetFontColour: PropTypes.func.isRequired,
    onSetFontTransform: PropTypes.func.isRequired,
    onSetFontBackground: PropTypes.func.isRequired,
    font: PropTypes.object.isRequired,
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

    this.isMount = false;
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
    this.isMount = false;
  }

  componentDidMount() {

    this.isMount = true;

    // Hack in a smaller font for mobiles
    /*
    if (window.matchMedia && window.matchMedia("(max-width: 667px)").matches && !this.state.font.scaled) {
      var self = this;
      setTimeout(function () {
        self.onUpdateFontSize(parseInt(self.state.font.fontSize / 2, 10));
      });
    }
    */
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

    const { font, isSpecimen, likeCount } = this.props;

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
          onMoreClick={this.handleMoreClick}
          font={font}
          likeCount={likeCount}
          isList={isList} />
      </div>
    )
  }

  /*
  render() {


    const props = this.props;

    let { font, likes } = props;

    if (!font) {
      return <div> </div>
    }

    let fontId = font.get('id');
    let fontName = replaceNonAlphaNumeric(font.get('fontName')).toLowerCase();

    let oFontName = font.get('fontName');

    let oFontCreator = font.get('fontCreator');
    let oFontCreatorLink = font.get('fontCreatorLink');

    let spanFontCreator = oFontCreatorLink ? <span>{oFontCreator}</span> : <span>{oFontCreator}</span>

    let oFontStyle = font.get('fontStyle');

    // Sort rank
    const rhyphen = " — ";
    const rankSpace = " ";
    const rankComma = ", ";
    const rankPaddedNum = ("0" + props.rank).slice(-2);
    const rankNum = <span>{rankPaddedNum}{rhyphen}</span>
    const rankFontName = <span>{oFontName}{rankSpace}{oFontStyle}</span>
    const rankCreator = spanFontCreator;

    let fontClassName = "of-font-preview-text-container " + fontId;

    // Font size coming from redux state
    let fontSize = parseInt(font.get('settingsFontSize'), 10);

    let lineHeight = parseFloat(this.state.lineHeight || font.get('settingsLineHeight'), 10);
    let letterSpacing = parseFloat(this.state.letterSpacing || font.get('settingsLetterSpacing'), 10);
    let color = this.state.color || font.get('settingsColor');
    let uppercase = this.state.uppercase || font.get('settingsTextTransform') === 'uppercase';

    let maxFontSize = 150;
    let minFontSize = 9;

    let maxLineHeight = 2;
    let minLineHeight = 0.5;

    let minLetterSpacing = parseFloat(font.get('settingsLetterSpacingMin'), 10);
    let maxLetterSpacing = 1;

    let stepFontSize = 1;
    let stepLetterSpacing = 0.025;
    let stepLineHeight = 0.05;

    let shareMessage = getShareMessage(font);


    let textTransform = this.state.uppercase ? "uppercase" : "none";

    let fontStyle = {
      fontSize: `${fontSize}px`,
      letterSpacing: `${this.state.letterSpacing}em`,
      lineHeight: `${this.state.lineHeight}em`,
      color: `${this.state.color}`,
      textTransform : textTransform
    };

    let backgroundState = this.state.background;

    let backgroundStyle = {
      backgroundImage: backgroundState === 2 ? "url(/data/backgrounds/of-backdrop-0" + this.state.backgroundNum + ".jpg)" : "none"
    };

    let letterSpacingDigits = 3;
    let leadingDigits = 2;

    console.log('will apply style', fontStyle);

    const previewClassName = classNames({
      'not-loaded': !font || !font.fontSize, // slide jump ?
      'of-font-preview-container': true,
      'is-image': backgroundState === 2,
      'is-black': backgroundState === 1,
      'white-noimage is-white': backgroundState === 0,
      'black-image': backgroundState !== 0,
      'is-fixed': props.fixed
    });

    var footer = !this.props.isList ? "" : <div className="of-font-preview-footer">
      <div className="of-footer-inner">
        <div className="of-grid-container">
          <div className="of-row">
            <div className="col-10 rank">
              <Link onClick={this.handleMoreClick} to={`/hot30/${fontId}`}>{rankNum}{rankFontName}<span className="creator-rank">{rankComma}{rankCreator}</span></Link>
            </div>
            <div className="col-2 social">
              <FontLikeButton locked={this.state.locked} font={font} /><FontShareButton message={shareMessage} />
            </div>
          </div>
        </div>
      </div>
    </div>;

    return (
      <div ref="fontPreview" className={previewClassName} style={backgroundStyle}>

        <div className="of-font-preview-ui">
          <div className="of-grid-container">
            <div className="of-row">
              <FontSlider label="size"
                initial={fontSize}
                value={fontSize}
                max={maxFontSize}
                step={stepFontSize}
                min={minFontSize}
                onUpdate={this.onUpdateFontSize} />

              <FontSlider
                label="leading"
                initial={lineHeight}
                value={lineHeight}
                fixed={leadingDigits}
                min={minLineHeight}
                max={maxLineHeight}
                step={stepLineHeight}
                onUpdate={this.onUpdateLineHeight} />

              <FontSlider
                label="tracking"
                initial={letterSpacing}
                value={letterSpacing}
                fixed={letterSpacingDigits}
                min={minLetterSpacing}
                max={maxLetterSpacing}
                step={stepLetterSpacing}
                onUpdate={this.onUpdateLetterSpacing} />

              <FontColours
                color={color}
                background={backgroundState}
                uppercase={uppercase}
                onUpdate={this.onUpdateColour}
                onUpdateBackground={this.onUpdateBackground}
                onUpdateTextTransform={this.onUpdateTextTransform} />

              <div className="col-2 more-button-container">
                <Link onClick={this.handleMoreClick} to={`/hot30/${fontId}`}>
                  { props.fixed
                    ? <span className="more-button source-mode">Source Page</span>
                    : <span className="more-button default-mode">Explore Font</span> }
                </Link>
              </div>
            </div>
          </div>
        </div>

        <FontText
          fontClasses={fontClassName}
          fontStyle={fontStyle}
          content={font.get('settingsText')}/>

        { footer }


      </div>
    )
  }
  */
}

FontPreview.getRandomBackground = (function () {

  var numBackgrounds = 41;
  var backgroundList = shuffle(Array(numBackgrounds).fill(0).map((o, i) => i + 1));
  var index = 0;

  let pad2 = n => n < 10 ? "0" + n : n;

  return () => {
    index = (index + 1) % numBackgrounds;
    let bgNum = backgroundList[index];
    return pad2(bgNum);
  }
}());

export default FontPreview