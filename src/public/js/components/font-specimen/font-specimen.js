import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Linkify from 'react-linkify'
import React, { Component, PropTypes } from 'react'
import $ from 'jquery'
import { replaceNonAlphaNumeric, camelCaseToUnderscore } from '../../util/util.js'
import { getAboutText, getShareMessage } from 'util/content_util'
import FontPreviewContainer from 'containers/font-preview-container/font-preview-container'
import FontSpecimenImage from 'components/font-specimen/specimen-image/specimen-image'
import cx from 'classnames'
import Like from 'containers/like/like'

import FontLikeButton from 'components/font-like-button/font-like-button'
import FontShareButton from 'components/font-share-button/font-share-button'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export default class FontSpecimen extends Component {

  static propTypes = {
    font: PropTypes.object.isRequired,
    likes: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onClickSource = this.onClickSource.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.touchStartHandler = this.touchStartHandler.bind(this);

    this.state = {
      isTopPassed: false,
      deltaTop: 0,
      deltaBottom: 0,
      moveToOffset: 0
    };
  }

  onScrollFinish() {
    let { onCompleteScroll } = this.props;
    onCompleteScroll && onCompleteScroll();
  }

  onScroll(e) {

    const inner = this.refs['of-specimen'];

    // raw scroll position
    let scrollTop = window.scrollY;
    // browser window height
    let windowHeight = window.innerHeight;
    // the height of the container (+ virtual top margin)
    let innerHeight = inner.clientHeight + windowHeight * 0.85;
    // 0 - 1 top of the page
    let deltaTop = Math.min(1, scrollTop / windowHeight);
    // 0 - 1 bottom of the page
    let deltaBottom = Math.max(0, Math.max(windowHeight + scrollTop - (innerHeight - windowHeight)) / windowHeight)
    // true if scrolled pass the page header
    let isTopPassed = scrollTop > windowHeight;
    // true if scrolled to the end of the page
    let isBottom = windowHeight + scrollTop >= innerHeight - 1;

    this.setState({
      isTopPassed: isTopPassed,
      deltaBottom: deltaBottom,
      deltaTop: deltaTop
    });

    if (isBottom) {
      this.onScrollFinish();
    }
  }

  componentWillAppear(cb) {
    this.setState({
      moveToOffset: (window.tempOffset - 50) || 0
    });

    this.appearTimeout = setTimeout(cb, 300);
  }

  componentDidAppear() {

    this.refs['of-specimen'].style.visibility = 'visible';
    window.scrollTo(0, 0);

    this.setState({
      moveToOffset: 0
    });

    this.refs['of-specimen'].addEventListener('touchstart', this.touchStartHandler, true);
  }

  touchStartHandler(e) {
    // appDispatcher.dispatch({ actionType: 'specimen-touch-start' })
  }

  componentDidMount() {
    this.timeout = setTimeout(function () {
      $(window).on('scroll', this.onScroll);
    }.bind(this), 1000)
  }

  componentWillUnmount() {
    this.refs['of-specimen'].removeEventListener('touchstart', this.touchStartHandler);
    $(window).off('scroll', this.onScroll);
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    if (this.appearTimeout) {
      clearTimeout(this.appearTimeout)
      this.appearTimeout = null
    }
  }

  onClickSource(scrollTop, offsetTop, e) {

    const { font } = this.props
    const link = font['fontOpenSourceLink'];

    window.open(link);

    e.preventDefault();
    return false;
  }

  render() {

    const { font, likes } = this.props;

    const state = this.state

    const fontId = font.get('id')
    const fontLike = likes.find(o => o.get('fontId') === fontId)
    const likeCount = fontLike ? fontLike.get('likes') : 0

    const previewKey = font.get('fontName');
    const fontName = font.get('fontName');
    const specimenCreator = font.get('specimenCreator');
    const specimenCreatorLink = font.get('specimenCreatorLink');
    const fontClassName = font.get('id');
    const styleDesc = font.get('fontStyle');
    const foundBy = font.get('infoDiscoverer');
    const infoAbout = font.get('infoAbout');
    const infoWeight = font.get('infoWeight');
    const creator = font.get('fontCreator');
    const creatorLink = font.get('fontCreatorLink');
    const foundry = font.get('fontFoundry');
    const foundryLink = font.get('fontFoundryLink');
    const fontDownloadLink = font.get('fontDownloadLink');
    const fontOpenSourceLink = font.get('fontOpenSourceLink');
    const aboutText = getAboutText(font);

    var oFontName = font.get('fontName');
    var oFontStyle = font.get('fontStyle');

    var shareMessage = getShareMessage(font);

    var characterElements = this.characterElements = this.characterElements || ((function () {
      let characterElements = [];
      for (var i = 33; i <= 126; i ++) {
        characterElements.push(<li key={ i } className="character">{ String.fromCharCode(i) }</li>)
      }
      return characterElements;
    })());

    var foundryElement;

    if (foundryLink) {
      foundryElement = <a href={foundryLink}>{foundry}</a>
    } else {
      foundryElement = <span>{foundry}</span>
    }

    const spacerStyle = {
      opacity: 1 - Math.max(0, (state.deltaBottom - 0.5) * 2 - 0.05)
    };

    const holderStyle = {
      visibility: state.isTopPassed ? 'hidden' : 'visible',
      transform: 'translate3d(0,' + state.moveToOffset + 'px,0)',
      transition: Math.abs(state.moveToOffset) < 1 ? 'transform 150ms linear 0ms' : 'none'
    };

    const coverStyle = {
      opacity: !state.deltaTop ? 0 : state.deltaTop
    };

    return (
      <div ref="of-specimen" className="of-specimen">
        <div ref="of-preview-wrapper" style={holderStyle} className='of-preview-wrapper'>
          <FontPreviewContainer
            isSpecimen={true}
            onMoreUpdate={this.onClickSource}
            key={previewKey}
            font={font}
            likeCount={likeCount} />
          <div style={coverStyle} className="of-spec-preview-cover"></div>
        </div>

        <ReactCSSTransitionGroup transitionName="specstate" transitionAppear={true} transitionAppearTimeout={1000} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
        <div className="of-specimen-overlay">

          <FontSpecimenImage font={font} />

          <div className="of-font-specimen-content of-font-specimen-content-first">
            <h3>Specimen Artwork by</h3>
            { specimenCreatorLink
              ? <a href={specimenCreatorLink}><h4 className={fontClassName}>{specimenCreator}</h4></a>
              : <h4 className={fontClassName}>{specimenCreator}</h4>
            }
          </div>

          { styleDesc
            && <div className="of-font-specimen-content"><h3>Style, Weight</h3><h4 className={fontClassName}>{styleDesc}, {infoWeight}</h4></div>
          }
          <div className="of-font-specimen-content of-font-specimen-content-characterset">
            <h3>Characters: Basic Latin</h3>
            <h4 className={fontClassName}>
              <ul>
                { characterElements }
              </ul>
            </h4>
          </div>

          { creator, foundry
            ? <div className="of-font-specimen-content"><h3>Typedesigner, Foundry</h3><h4 className={fontClassName}><a href={creatorLink}>{creator}</a>, {foundryElement}</h4></div>
            : <div className="of-font-specimen-content"><h3>Typedesigner</h3><h4 className={fontClassName}><a href={creatorLink}>{creator}</a></h4></div>
          }
          { foundBy
            && <div className="of-font-specimen-content"><h3>Project Page</h3><a href={fontOpenSourceLink}><h4 className={fontClassName}>{fontOpenSourceLink}</h4></a></div>
          }
          <div className="of-font-specimen-content">
            <div className="of-row">
              <div className="col-7">
                <h3>About</h3>
                <Linkify>
                { infoAbout
                  ? <p>{infoAbout} {aboutText}</p>
                  : <p>{aboutText}</p>
                }
                </Linkify>
              </div>
            </div>
          </div>

          <div className="of-font-specimen-content of-font-specimen-content-last of-specimen-footer">
            <div className="of-row">
              <div className="col-7">
                <h3>Download Font</h3>
                <a href={fontDownloadLink}><button className="of-font-specimen-button">{fontName} {styleDesc}</button></a>
              </div>
              <div className="col-5 social">
                <Like fontId={fontId} likeCount={likeCount} />
                <FontShareButton message={shareMessage} />
              </div>
            </div>
          </div>

          <div style={spacerStyle} className="of-font-specimen-spacer-bottom"></div>

        </div>
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}
