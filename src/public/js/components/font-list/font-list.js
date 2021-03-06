import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import classNames from 'classnames'
import FontPreviewContainer from 'containers/font-preview-container/font-preview-container'
import SpecimenPreviewContainer from 'containers/specimen-preview-container/specimen-preview-container'
import TogglePreviewContainer from 'containers/toggle-preview-container/toggle-preview-container'

class FontList extends Component {

  static propTypes = {
    fonts: PropTypes.object.isRequired,
    likes: PropTypes.object.isRequired,
    isGridView: PropTypes.bool.isRequired,
    specimenFont: PropTypes.object
  }

  constructor(props) {

    super(props)

    this.onMoreUpdate = this.onMoreUpdate.bind(this)
    this.specimenTouchStartHandler = this.specimenTouchStartHandler.bind(this)
    this.windowTouchEndHandler = this.windowTouchEndHandler.bind(this)

    this.state = {
      lastScrollTop: 0
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
      window.addEventListener('touchend', this.windowTouchEndHandler, false)
      // let's take note touch now is active (the hack will not apply for
      // mousewheel etc.)
      this.hasTouch = true
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
      const scrollTop = window.scrollY

      // wait a frame, unfortunately this is necessary and creates
      // a little flash in some cases
      requestAnimationFrame(function () {

        // remove the css transformation while re-adapting the scrollbar
        this.refs.list.style.transform = 'none'
        window.scrollTo(0, scrollTop - this.translatedSmoothScroll)
        // reset, just in case
        this.translatedSmoothScroll = 0

      }.bind(this))

    }

    // reset to false and await next touch-start
    this.hasTouch = false

  }

  componentDidUpdate() {

    if (!this.props.specimenFont && this.fixed) {

      // The FontList got relative, i.e. active
      this.fixed = false

      if (!this.hasTouch) {

        // no touch = no problem - just reset scroll position
        window.scrollTo(0, this.state.lastScrollTop)

      } else {

        // Hack Part #2
        // ------------
        // The touch (!hasTouch) wasn't released while the Specimen overview was open
        // so we guess the touch is still active. The scrollTo() would in this case
        // get overriden by the user interaction causing the page to instead jump to
        // the position relative to the touch-start within the specimen page.
        // The hack involves keeping that natural behaviour while translating the
        // whole container to match the "lastScrollTop" position.

        this.translatedSmoothScroll = -this.state.lastScrollTop + window.scrollY
        this.refs.list.style.transform = 'translateY(' + this.translatedSmoothScroll + 'px)'
      }

    } else if (this.props.specimenFont && !this.fixed) {

      // FontList got fixed, i.e. inactive
      this.fixed = true
    }
  }

  onMoreUpdate(scrollTop) {
    // remember the scroll position to land at the
    // same offset when coming back from Specimen
    this.setState({
      lastScrollTop: scrollTop
    })
  }

  renderSpecimenPreview(chunked, likes, step) {
    return chunked.map((chunk, i)=> {
      return (
        <div key={i} className="of-font-list-row">
          {chunk.map((f, fi) => {
            const fontId = f.id
            const rank = (i * step) + fi + 1
            const fontLike = likes.find(o => o.get('fontId') === fontId)
            const likeCount = fontLike ? fontLike.get('likes') : 0

            return <SpecimenPreviewContainer key={rank} rank={rank} likeCount={likeCount}fontId={fontId} />
          })}
        </div>
      )
    })
  }

  render() {

    const { lastScrollTop } = this.state

    const {
      fonts,
      likes,
      isGridView,
      specimenFont } = this.props

    let renderFonts = null

    if (isGridView) {
      // Split into chunks of three
      // For arranging the grid
      const fontList = fonts.toJS()
      const fontListLen = fontList.length
      const chunked = []
      const step = 3
      let ci = 0
      let index = 0
      while (index < fontListLen) {
        chunked[ci++] = fontList.slice(index, (index += step))
      }

      renderFonts = this.renderSpecimenPreview(chunked, likes, step)

    } else {

      renderFonts = this.renderFonts || fonts.map((font, i) => {

        const fontId = font.get('id')
        const fontLike = likes.find(o => o.get('fontId') === fontId)
        const likeCount = fontLike ? fontLike.get('likes') : 0
        const isList = true

        const preview = (
          <FontPreviewContainer
            rank={ i + 1 }
            key={fontId}
            likeCount={likeCount}
            isList={isList}
            onMoreUpdate={this.onMoreUpdate}
            font={font} />)

        return preview
      })
    }

    if (fonts.length) {
      this.renderFonts = renderFonts
    }

    const fontListClassNames = classNames({
      'of-font-list-container': true,
      'of-font-list--fixed': specimenFont
    })

    const fontListInnerClassNames = classNames({
      'of-font-list': true,
      'of-font-list--grid': isGridView
    })

    // Offset by `.of-main` top offset
    const fontListStyle = {
      // 50px being the height of the nav bar
      transform: specimenFont ? 'translateY(' + (50 + (lastScrollTop * -1)) + 'px)' : 'none'
    }

    return (
      <div className={fontListClassNames}>
        <div style={fontListStyle} ref="list" className={fontListInnerClassNames}>
          {renderFonts}
        </div>
        <TogglePreviewContainer />
      </div>
    )
  }
}

export default FontList
