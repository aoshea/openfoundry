import React, { Component, PropTypes } from 'react'
import FontSpecimenImage from 'components/font-specimen/specimen-image/specimen-image.js'
import Like from 'containers/like/like'
import FontShareButton from 'components/font-share-button/font-share-button'
import { getShareMessage } from 'util/content_util'

export default class SpecimenPreview extends Component {

  static propTypes = {
    fonts: PropTypes.object.isRequired,
    fontId: PropTypes.string.isRequired,
    rank: PropTypes.number.isRequired,
    likeCount: PropTypes.number.isRequired
  }

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
        <div className="of-specimen-preview-header">
          <div className="header-item">{rank}</div>
          <div className="header-item header-title">{specimenCreator}</div>
          <div className="header-item">
            <Like fontId={fontId} likeCount={likeCount} />
            <FontShareButton message={shareMessage} />
          </div>
        </div>
        <div className="of-specimen-preview-image">
          <div className={specimenImageClassName}>
          </div>
        </div>
        <div className="of-specimen-preview-footer">
          <div className="footer-title">{fontName} {fontStyle}</div>
        </div>
      </div>
    )
  }
}
