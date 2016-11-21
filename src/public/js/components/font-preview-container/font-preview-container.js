import React, { Component, PropTypes } from 'react';
import { setFontSize } from '../../actions/actions.js';
import { Dispatcher } from 'flux';
import { Link } from 'react-router';
import { replaceNonAlphaNumeric } from '../../util/util.js';
import FontSlider from 'components/font-slider/font-slider.js';
import FontColours from 'components/font-colours/font-colours.js';
import FontLikeButton from 'components/font-like-button/font-like-button.js';
import FontShareButton from 'components/font-share-button/font-share-button.js';
import FontText from './font-text/font-text.js';
import $ from 'jquery';
import classNames from 'classnames';
import shuffle from 'shuffle-array';
import { getFontId, getShareMessage, getFullFontName } from 'util/content_util.js';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class FontPreviewContainer extends Component {

  propTypes: {
    onSetFontSize: PropTypes.func.isRequired,
    font: PropTypes.object.isRequired
  }

  constructor(props) {

    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    this.onUpdateFontSize = this.onUpdateFontSize.bind(this);
    this.onUpdateLineHeight = this.onUpdateLineHeight.bind(this);
    this.onUpdateLetterSpacing = this.onUpdateLetterSpacing.bind(this);
    this.onUpdateColour = this.onUpdateColour.bind(this);
    this.onUpdateBackground = this.onUpdateBackground.bind(this);
    this.onUpdateTextTransform = this.onUpdateTextTransform.bind(this);
    this.handleFontModelEvent = this.handleFontModelEvent.bind(this)
    this.handleMoreClick = this.handleMoreClick.bind(this);

    this.isMount = false;

    this.checkProps();

  }

  componentWillUnmount() {

    this.state.font && this.state.font.dispatcher.unregister(this.handleFontModelEventToken)
    this.isMount = false;
  }

  checkProps() {

    const { font, likes } = this.props;

    if (!font) return;

    if (!font.dispatcher) {
      // we're using the font object as a model to be reflected
      // by any views referencing it (i.e. list & specimen).
      // This could be done better by implementing Flux entirely,
      // however this seems to work fine for now.
      font.dispatcher = new Dispatcher
    }

    this.handleFontModelEventToken = font.dispatcher.register(this.handleFontModelEvent)

    // get the font settings from the default settings if not changed by the user
    font.fontSize = font.fontSize || parseInt(font.get('settingsFontSize'), 10);
    font.lineHeight = font.lineHeight || parseFloat(font.get('settingsLineHeight'), 10);
    font.letterSpacing = font.letterSpacing || parseFloat(font.get('settingsLetterSpacing'), 10);
    font.color = font.color || font.get('settingsColor');
    font.uppercase = font.uppercase || font.get('settingsTextTransform') === 'uppercase';
    font.backgroundNum = font.backgroundNum || FontPreviewContainer.getRandomBackground();

    if (typeof font.background === 'undefined') {
      // set background to 0, 1, 2
      font.background = ['white', 'black', 'image'].indexOf(font.get('settingsBackgroundState'));
      // safeguard in case of invalid value
      font.background = font.background > -1 ? font.background : 0;
    }

    this.state = {
      font: font,
      // size: font.fontSize,
      likes: likes,
      lineHeight: font.lineHeight,
      letterSpacing: font.letterSpacing,
      color: font.color,
      background: font.background,
      backgroundNum: font.backgroundNum,
      locked: false,
      uppercase: font.uppercase,
      scaled: font.scaled
    };
  }

  componentWillReceiveProps(props) {
    // this.checkProps(props)
  }

  componentDidMount() {

    this.isMount = true;

    // Hack in a smaller font for mobiles
    if (window.matchMedia && window.matchMedia("(max-width: 667px)").matches && !this.state.font.scaled) {
      var self = this;
      setTimeout(function () {
        self.onUpdateFontSize(parseInt(self.state.font.fontSize / 2, 10));
      });
    }
  }

  /**
   * Handles a change on the font model
   * @param  {Event} e Event describing the action and the changed value
   */
  handleFontModelEvent(e) {

    switch (e.actionType) {

      case 'background-update':
        this.setState({
          background: e.background,
          backgroundNum: e.backgroundNum
        });
        break;

      /*
      case 'font-size-update':
        this.setState({
          size: e.fontSize,
          scaled: true
        });
        break;
      */

      case 'letter-spacing-update':
        this.setState({
          letterSpacing: e.letterSpacing
        });
        break;

      case 'line-height-update':
        this.setState({
          lineHeight: e.lineHeight
        });
        break;

      case 'text-transform-update':
        this.setState({
          uppercase: e.uppercase
        });
        break;

      case 'color-update':
        this.setState({
          color: e.color
        });
        break;
    }
  }

  handleMoreClick(e) {

    const fontPreview = this.refs.fontPreview;
    const offsetTop = fontPreview.getBoundingClientRect().top;

    window.tempOffset = offsetTop;

    var scrollTop = $(window).scrollTop();

    const { onMoreUpdate } = this.props;
    onMoreUpdate && onMoreUpdate(scrollTop, offsetTop, e);
  }

  onUpdateFontSize(value) {

    /*
    var font = this.state.font;
    font.fontSize = parseInt(value, 10);
    font.scaled = true;
    font.dispatcher.dispatch({
      actionType: 'font-size-update',
      fontSize: font.fontSize
    });
    */

    const { onSetFontSize, fontX } = this.props;

    const fontId = getFontId(fontX);

    onSetFontSize({
      id: fontId,
      value: parseInt(value, 10)
    })
  }

  onUpdateLetterSpacing(value) {
    var font = this.state.font;
    font.letterSpacing = value.toFixed(3)
    font.dispatcher.dispatch({
      actionType: 'letter-spacing-update',
      letterSpacing: font.letterSpacing
    });
  }

  onUpdateLineHeight(value) {
    var font = this.state.font;
    font.lineHeight = value.toFixed(2)
    font.dispatcher.dispatch({
      actionType: 'line-height-update',
      lineHeight: font.lineHeight
    });
  }

  onUpdateColour(value) {
    var font = this.state.font;
    font.color = value
    font.dispatcher.dispatch({
      actionType: 'color-update',
      color: font.color
    });
  }

  onUpdateBackground(value) {
    var font = this.state.font;
    font.backgroundNum = font.backgroundNum || FontPreviewContainer.getRandomBackground();
    font.background = value;
    font.dispatcher.dispatch({
      actionType: 'background-update',
      background: font.background,
      backgroundNum: font.backgroundNum
    });

  }

  onUpdateTextTransform(value) {
    var font = this.state.font;
    font.uppercase = value;
    font.dispatcher.dispatch({
      actionType: 'text-transform-update',
      uppercase: font.uppercase
    });
  }

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
}

FontPreviewContainer.getRandomBackground = (function () {

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

export default FontPreviewContainer