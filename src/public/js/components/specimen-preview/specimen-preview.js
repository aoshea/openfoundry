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
    likeCount: PropTypes.number.isRequired,
    specimenOffset: PropTypes.number.isRequired,
    startTransition: PropTypes.func.isRequired,
    endTransition: PropTypes.func.isRequired,
    initTransition: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.scaleUp = this.scaleUp.bind(this)
    this.navigateToSpecimen = this.navigateToSpecimen.bind(this)
    this.toggleScale = this.toggleScale.bind(this)
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    if (this.startTransitionTimeout) {
      clearTimeout(this.startTransitionTimeout)
      this.startTransitionTimeout = null
    }
  }

  navigateToSpecimen() {

    const { router, fontId, endTransition } = this.props
    router.push(`/hot30/${fontId}`)

    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(endTransition, 300)
  }

  toggleScale(e) {

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

    // Calculate scale
    const newScale = window.innerWidth / rect.width

    // New offsets to translate to top left corner
    const tx = -rect.left
    const ty = -rect.top + 50

    const { router, fontId, initTransition, startTransition } = this.props

    // Go to next page
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(this.navigateToSpecimen, 1000)

    // Kick-off transition after time to init
    if (this.startTransitionTimeout) clearTimeout(this.startTransitionTimeout)
    this.startTransitionTimeout = setTimeout(startTransition, 250)

    initTransition({
      imageSrc: target.src,
      imageRect: rect,
      transform: { transformX: tx, transformY: ty, scale: newScale }
    })
  }

  scaleUp(e) {
    const { currentTarget } = e

    e.preventDefault()
    this.toggleScale(e)
  }

  render() {

    const { fontId, fonts, specimenOffset } = this.props

    const font = fonts.find(f => f.get('id') === fontId)

    const src = font.get('specimenImage')

    const c = 'of-specimen-preview-bg-image'

    const imgStyle = { transform: 'translateX(-50%) translateY(-50%)' }

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
