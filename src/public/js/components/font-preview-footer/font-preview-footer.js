import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import Like from 'containers/like/like'
import FontShareButton from 'components/font-share-button/font-share-button'
import { getShareMessage } from 'util/content_util'

export default class FontPreviewFooter extends Component {

  static propTypes = {
    rank: PropTypes.number,
    isList: PropTypes.bool.isRequired,
    font: PropTypes.object.isRequired,
    likeCount: PropTypes.number.isRequired,
    onMoreClick: PropTypes.func.isRequired
  }

  render() {

    const { font, rank, isList, likeCount, onMoreClick } = this.props

    // Sort rank
    const rhyphen = " — ";
    const rankSpace = " ";
    const rankComma = ", ";
    const rankPaddedNum = ("0" + rank).slice(-2);
    const rankNum = <span>{rankPaddedNum}{rhyphen}</span>
    const rankFontName = <span>{font.get('fontName')}{rankSpace}{font.get('fontStyle')}</span>
    const fontCreator = font.get('fontCreator')
    const spanFontCreator = font.get('fontCreatorLink') ? <span>{fontCreator}</span> : <span>{fontCreator}</span>
    const rankCreator = spanFontCreator;

    const fontId = font.get('id')

    // something to figure out
    const shareMessage = getShareMessage(font)

    return (
      <div className="of-font-preview-footer">
        <div className="of-footer-inner">
          <div className="of-grid-container">
            <div className="of-row">
              <div className="col-10 rank">
                <Link onClick={onMoreClick} to={`/hot30/${font.get('fontId')}`}>
                  {rankNum}{rankFontName}
                  <span className="creator-rank">{rankComma}{rankCreator}</span>
                </Link>
              </div>
              <div className="col-2 social">
                <Like fontId={fontId} likeCount={likeCount} />
                <FontShareButton
                  message={shareMessage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

