import React, { Component, PropTypes } from 'react'
import { Link, withRouter } from 'react-router'
import FontSpecimenImage from 'components/font-specimen/specimen-image/specimen-image.js'
import Like from 'containers/like/like'
import FontShareButton from 'components/font-share-button/font-share-button'
import { getShareMessage } from 'util/content_util'
import BackgroundImage from 'components/util/BackgroundImage'

class SpecimenPreview extends Component {

  static propTypes = {
    fonts: PropTypes.object.isRequired,
    fontId: PropTypes.string.isRequired,
    rank: PropTypes.number.isRequired,
    likeCount: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props)

    this.scaleUp = this.scaleUp.bind(this)
    this.onLocationChange = this.onLocationChange.bind(this)
    this.onTransitionEnd = this.onTransitionEnd.bind(this)
    this.toggleScale = this.toggleScale.bind(this)

    this.state = {
      scale: 1,
      isOpen: false,
      isScale: false,
      tx: 0,
      ty: 0,
      tSrc: null,
      tWidth: 0,
      tHeight: 0
    }
  }

  componentDidMount() {
    this.props.router.listen(this.onLocationChange)
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }

    this.props.router.unregisterTransitionHook(this.onLocationChange)
  }

  onLocationChange(e) {
    const { scale } = this.state

    console.log(`onLocationChange scale ${scale}`) // eslint-disable-line no-console

    if (e.pathname && e.pathname === '/hot30' && scale > 1) {
      let self = this
      this.timeout = setTimeout(self.toggleScale, 250)
    }
  }

  onTransitionEnd() {

    const { router, fontId } = this.props
    const { scale } = this.state

    console.log(`onTransitionEnd scale ${scale}`) // eslint-disable-line no-console

    if (scale > 1) {
      router.push(`/hot30/${fontId}`)
    } else {
      this.setState({
        isVisible: false
      })
    }
  }

  toggleScale(e) {

    console.log(`onToggleScale`) // eslint-disable-line no-console

    // Transition explained
    // Centre image in viewport
    // Scale up image to fullscreen but top-aligned
    // [ Load specimen page in background ]

    // Get target (either from event or ref)
    let target = this.previewEl
    if (e && e.currentTarget) {
      target = e.currentTarget
    }

    // Get bounding rect of source image
    const rect = target.getBoundingClientRect()

    // Get scale
    const { scale } = this.state
    const newScale = scale === 1 ? window.innerWidth / rect.width : 1

    console.log(`onToggleScale newScale ${newScale}`) // eslint-disable-line no-console

    // New offsets to translate to top left corner
    const tx = scale === 1 ? -rect.left : 0
    const ty = scale === 1 ? -rect.top + 50 : 0

    const { router, fontId } = this.props

    // Handle transition ending
    this.transitionEl.addEventListener('transitionend', this.onTransitionEnd)

    // Update component state
    this.setState({
      scale: newScale,
      isVisible: true,
      tx,
      ty,
      tSrc: target.src,
      tTop: rect.top,
      tLeft: rect.left,
      tWidth: rect.width,
      tHeight: rect.height
    })
  }

  scaleUp(e) {
    const { currentTarget } = e

    e.preventDefault()

    this.toggleScale(e)
  }

  render() {

    const { fontId, fonts } = this.props

    const font = fonts.find(f => f.get('id') === fontId)

    const src = font.get('specimenImage')

    const c = 'of-specimen-preview-bg-image'

    const {
      scale,
      tx, ty,
      isVisible,
      tSrc,
      tWidth,
      tHeight,
      tTop,
      tLeft } = this.state

    const imgStyle = { transform: 'translateX(-50%) translateY(-50%)' }

    let transitionStyle = {
      top: tTop,
      left: tLeft,
      width: tWidth,
      height: tHeight
    }

    transitionStyle.opacity = 1
    transitionStyle.transform = `translateX(${tx}px) translateY(${ty}px) scale3d(${scale}, ${scale}, ${scale})`
    transitionStyle.visibility = isVisible ? 'visible' : 'hidden'

    return (
      <div className="of-specimen-preview">
        <div className="of-specimen-preview-image">
          <Link to={`/hot30/${fontId}`}>
            <div>
              <img ref={(el) => { this.previewEl = el }} style={imgStyle} onClick={this.scaleUp} src={src} />
            </div>
          </Link>
        </div>
        <div className="of-specimen-preview-header">
          {c}
        </div>
        <img ref={(el) => { this.transitionEl = el }} style={transitionStyle} src={tSrc} className="of-preview-image-transition" />
      </div>
    )
  }

  /*
  render() {

    const { fonts, rank, fontId, likeCount } = this.props

    const font = fonts.find(f => f.get('id') === fontId)
    const fontName = font.get('fontName')
    const fontStyle = font.get('fontStyle')

    const specimenCreator = font.get('specimenCreator')
    const specimenImage = <FontSpecimenImage font={font} />
    const specimenImageClassName = `of-specimen-preview-image-inner specimen-${fontId}`

    const shareMessage = getShareMessage(font)

    return (
      <div className="of-specimen-preview">
        <div className="of-specimen-preview-content">
          <div className="of-specimen-preview-header">
            <div className="header-item">{rank}</div>
            <div className="header-item header-title">{specimenCreator}</div>
            <div className="header-item">
              <Like fontId={fontId} likeCount={likeCount} />
              <FontShareButton message={shareMessage} />
            </div>
          </div>

          <div className="of-specimen-preview-image">
            <FontSpecimenImage font={font} />
          </div>

          <div className="of-specimen-preview-footer">
            <div className="footer-title">{fontName} {fontStyle}</div>
          </div>
        </div>
      </div>
    )
  }
  */
}

const decoratedSpecimenPreview = withRouter(SpecimenPreview)
export default decoratedSpecimenPreview
