import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import FontLikeButton from 'components/font-like-button/font-like-button'
import FontShareButton from 'components/font-share-button/font-share-button'

export default class FontPreviewFooter extends Component {

  static propTypes = {
    isList: PropTypes.bool.isRequired,
    font: PropTypes.object.isRequired,
    onMoreClick: PropTypes.func.isRequired
  }

  render() {

    const { font, rank, isList, onMoreClick } = this.props

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

    // something to figure out
    const locked = false

    const shareMessage = 'hi'

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
                <FontLikeButton
                  locked={locked}
                  font={font} />
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

