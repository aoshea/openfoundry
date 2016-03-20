import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';
import FontPreviewContainer from 'components/font-preview-container/font-preview-container.js';
import FontSpecimen from 'components/font-specimen/font-specimen.js';
import appDispatcher from 'app-dispatcher'

export default class FontList extends Component {

  constructor(props) {

    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onMoreUpdate = this.onMoreUpdate.bind(this);
    this.specimenTouchStartHandler = this.specimenTouchStartHandler.bind(this);
    this.windowTouchEndHandler = this.windowTouchEndHandler.bind(this);
    this.appEventHandler = this.appEventHandler.bind(this);

    this.state = {
      lastScrollTop: 0
    };

    appDispatcher.register(this.appEventHandler)
  }

  appEventHandler(e) {
    switch (e.actionType) {
      case 'specimen-touch-start':
        this.specimenTouchStartHandler();
        break;
    }
  }

  /**
   * Scroll hiccup hack for touch devices Part #1
   */
  specimenTouchStartHandler() {
    // The specimen overlay sends a touch-start event
    if (this.fixed && !this.hasTouch) {
      // If the overlay is still active we attach a touch-end listener to
      // the window object as the overlay may not dispatch in case the user
      // kills the overview by scrolling out.
      window.addEventListener('touchend', this.windowTouchEndHandler, false);
      // let's take note touch now is active (the hack will not apply for
      // mousewheel etc.)
      this.hasTouch = true;
    }
  }

  /**
   * Scroll hiccup hack for touch devices Part #3
   */
  windowTouchEndHandler(e) {

    // clean up the listener in any case
    e.currentTarget.removeEventListener('touchend', this.windowTouchEndHandler)

    // apply the following when a touch-start was sent while the Specimen
    // was open and now a touch-end is received when it's been closed.

    // Note: unfortunately this only happens the second time the user touches
    // the FontList after the transition. It seems to be impossible receiving
    // a touch-end from a detached element (i.e. the unmounted specimen).

    if (!this.fixed && this.hasTouch) {

      // save the current position
      var scrollTop = window.scrollY;

      // wait a frame, unfortunately this is necessary and creates
      // a little flash in some cases
      requestAnimationFrame(function () {

        // remove the css transformation while re-adapting the scrollbar
        this.refs.list.style.transform = 'none'
        window.scrollTo(0, scrollTop - this.translatedSmoothScroll);
        // reset, just in case
        this.translatedSmoothScroll = 0;

      }.bind(this));

    }

    // reset to false and await next touch-start
    this.hasTouch = false;

  }

  componentDidUpdate() {

    if (!this.props.fixed && this.fixed) {

      // The FontList got relative, i.e. active
      this.fixed = false;

      if (!this.hasTouch) {

        // no touch = no problem - just reset scroll position
        window.scrollTo(0, this.state.lastScrollTop);

      } else {

        // Hack Part #2
        // ------------
        // The touch (!hasTouch) wasn't released while the Specimen overview was open
        // so we guess the touch is still active. The scrollTo() would in this case
        // get overriden by the user interaction causing the page to instead jump to
        // the position relative to the touch-start within the specimen page.
        // The hack involves keeping that natural behaviour while translating the
        // whole container to match the "lastScrollTop" position.

        this.translatedSmoothScroll = -this.state.lastScrollTop + window.scrollY;
        this.refs.list.style.transform = 'translateY(' + this.translatedSmoothScroll + 'px)';
      }

    } else if (this.props.fixed && !this.fixed) {

      // FontList got fixed, i.e. inactive
      this.fixed = true;
    }
  }

  onMoreUpdate(scrollTop) {
    // remember the scroll position to land at the
    // same offset when coming back from Specimen
    this.setState({
      lastScrollTop: scrollTop
    });
  }

  render() {

    const props = this.props;
    const isFixed = props.fixed;
    const { lastScrollTop } = this.state;

    var fonts = this.props.fonts || [];

    const renderFonts = this.renderFonts || this.props.fonts.map((font, i) => {
      return (
        <FontPreviewContainer
          rank={ i + 1 }
          key={font.__key}
          isList='true'
          onMoreUpdate={this.onMoreUpdate}
          font={font} />
      )
    });

    if (this.props.fonts.length) {
      this.renderFonts = renderFonts
    }

    const fontListClassNames = classNames({
      'of-font-list-container': true,
      'of-font-list--fixed': isFixed
    });

    // Offset by `.of-main` top offset
    const fontListStyle = {
      // 50px being the height of the nav bar
      transform: isFixed ? 'translateY(' + (50 + (lastScrollTop * -1)) + 'px)' : 'none',
    };

    return (
      <div className={fontListClassNames}>
      <div style={fontListStyle} ref="list" className='of-font-list'>
        {renderFonts}
        { this.state.specimen ? <FontSpecimen /> : null }
      </div>
      </div>
    )
  }
}
