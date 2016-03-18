import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactTransitionGroup from 'react-addons-transition-group';
import Linkify from 'react-linkify';
import React, { Component } from 'react';
import $ from 'jquery';
import { replaceNonAlphaNumeric } from '../../util/util.js';
import { getAboutText, getShareMessage } from 'util/content_util.js';
import FontPreviewContainer from 'components/font-preview-container/font-preview-container.js';
import FontSpecimenImage from 'components/font-specimen/specimen-image/specimen-image.js';
import cx from 'classnames';

import FontLikeButton from 'components/font-like-button/font-like-button.js';
import FontShareButton from 'components/font-share-button/font-share-button.js';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import appDispatcher from 'app-dispatcher'

var idleTimeout = {
  id: null,
  delay: 1000
};

export default class FontSpecimen extends Component {

  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onClickSource = this.onClickSource.bind(this);
    this.onScroll = this.onScroll.bind(this);

    this.state = {
      isTopPassed: false,
      delta: 0,
      moveToOffset: 0
    };
  }

  onScrollFinish() {
    let { onCompleteScroll } = this.props;
    onCompleteScroll && onCompleteScroll();
  }

  onScroll(e) {
    const { onScrollUpdate } = this.props;

    var inner = $('.of-specimen');

    if (inner.length === 0) return;

    let scrollTop = window.scrollY;
    let innerHeight = inner.height() + window.innerHeight * 0.85;
    let scrollY = window.innerHeight + scrollTop;

    // 1 - 0 by the end of the page (i.e. absolute scroll)
    let delta = ((scrollY - innerHeight) / window.innerHeight) + 1;
    // 0 - 1 by the beginning of the page (i.e. 100% of screen)
    let deltaScreen = Math.max(0, 2 - Math.max(1, scrollY / window.innerHeight));

    if (delta > 0) {
      onScrollUpdate && onScrollUpdate(delta);
    }

    let isTopPassed = scrollTop > window.innerHeight;

    if (!this.state.isTopPassed && isTopPassed) {
      this.state.isTopPassed = true
      this.refs['of-preview-wrapper'].style.visibility = 'hidden';
    }

    if (this.state.isTopPassed && !isTopPassed) {
      this.state.isTopPassed = false
      this.refs['of-preview-wrapper'].style.visibility = 'visible';
    }

    let isBottom = scrollY >= innerHeight - 1;

    if (isBottom) {
      this.onScrollFinish();
    }
  }

  componentWillAppear(cb) {
    this.setState({
      moveToOffset: (window.tempOffset - 50) || 0
    });

    setTimeout(cb, 300);
  }

  componentDidAppear() {
    this.setState({
      moveToOffset: 0
    });
  }

  componentDidMount() {
    $(window).on('scroll', this.onScroll);
  }

  componentWillUnmount() {
    $(window).off('scroll', this.onScroll);
  }

  onClickSource(scrollTop, offsetTop, e) {

    const { font } = this.props
    const link = font['font-open-source-link'];

    window.open(link);

    e.preventDefault();
    return false;
  }

  render() {

    const { font } = this.props;
    const state = this.state;

    if (!font) return <div>nothing here</div>

    const previewKey = font['font-name'];
    const fontName = font['font-name'];
    const specimenCreator = font['specimen-creator'];
    const specimenCreatorLink = font['specimen-creator-link'];
    const fontClassName = replaceNonAlphaNumeric(font['font-id']);
    const styleDesc = font['font-style'];
    const foundBy = font['info-discoverer'];
    const infoAbout = font['info-about'];
    const infoWeight = font['info-weight'];
    const creator = font['font-creator'];
    const creatorLink = font['font-creator-link'];
    const foundry = font['font-foundry'];
    const foundryLink = font['font-foundry-link'];
    const fontDownloadLink = font['font-download-link'];
    const fontOpenSourceLink = font['font-open-source-link'];
    const aboutText = getAboutText(font);

    var oFontName = font['font-name'];
    var oFontStyle = font['font-style'];

    var shareMessage = getShareMessage(font);

    var characterElements = []
    for (var i = 33; i <= 126; i ++) {
      characterElements.push(<li key={ i } className="character">{ String.fromCharCode(i) }</li>)
    }

    var foundryElement;

    if (foundryLink) {
      foundryElement = <a href={foundryLink}>{foundry}</a>
    } else {
      foundryElement = <span>{foundry}</span>
    }

    const spacerStyle = {
      opacity: 1 - Math.max(0, (state.delta - 0.5) * 2 - 0.05)
    };

    const holderStyle = {
      transform: 'translate3d(0,' + state.moveToOffset + 'px,0)',
      transition: Math.abs(state.moveToOffset) < 1 ? 'transform 150ms linear 50ms' : 'none'
    };

    const coverStyle = {
      opacity: !state.deltaScreen ? 0 : Math.min(1, ((1 - state.deltaScreen) - 0.1) * 1.5)
    };

    return (

      <div ref="of-specimen" className='of-specimen'>

        <div ref="of-preview-wrapper" style={holderStyle} className='of-preview-wrapper'>
          <FontPreviewContainer
            fixed={true}
            onMoreUpdate={this.onClickSource}
            rank={previewKey}
            key={previewKey}
            font={font} />
          <div style={coverStyle} className="of-spec-preview-cover"></div>
        </div>

        <ReactCSSTransitionGroup transitionName="specstate" transitionAppear={true} transitionAppearTimeout={2000} transitionEnterTimeout={0} transitionLeaveTimeout={2000}>
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
                <FontLikeButton locked={this.state.locked} font={font} /><FontShareButton message={shareMessage} />
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
