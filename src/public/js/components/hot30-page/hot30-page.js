import React, { Component, PropTypes } from 'react'
import ReactTransitionGroup from 'react-addons-transition-group'
import Helmet from 'react-helmet'
import FontList from 'components/font-list/font-list'
import FontSpecimen from 'components/font-specimen/font-specimen.js';

class Hot30Page extends Component {

  static propTypes = {
    onSetFontSize: PropTypes.func.isRequired,
    onSetFontLeading: PropTypes.func.isRequired,
    onSetFontTracking: PropTypes.func.isRequired,
    onSetFontTransform: PropTypes.func.isRequired,
    onSetFontColour: PropTypes.func.isRequired,
    onSetFontBackground: PropTypes.func.isRequired,
    fonts: PropTypes.object.isRequired,
    specimenFontId: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.onCompleteSpecimenScroll = this.onCompleteSpecimenScroll.bind(this)
  }

  onCompleteSpecimenScroll() {
    this.context.router.push('/hot30')
  }

  render() {

    const {
      onSetFontSize,
      onSetFontLeading,
      onSetFontTracking,
      onSetFontTransform,
      onSetFontColour,
      onSetFontBackground,
      fonts,
      specimenFontId } = this.props

    const specimenFont = specimenFontId ? fonts.find(f => f.get('id') === specimenFontId) : null

    return (
      <div>
        <Helmet title={"OpenFoundry / Hot 30"} />
        <FontList
          onSetFontSize={onSetFontSize}
          onSetFontLeading={onSetFontLeading}
          onSetFontTracking={onSetFontTracking}
          onSetFontTransform={onSetFontTransform}
          onSetFontColour={onSetFontColour}
          onSetFontBackground={onSetFontBackground}
          fonts={fonts}
          specimenFont={specimenFont} />
        {specimenFont &&
          <ReactTransitionGroup>
            <FontSpecimen
              onSetFontSize={onSetFontSize}
              onSetFontLeading={onSetFontLeading}
              onSetFontTracking={onSetFontTracking}
              onSetFontTransform={onSetFontTransform}
              onSetFontColour={onSetFontColour}
              onSetFontBackground={onSetFontBackground}
              onCompleteScroll={this.onCompleteSpecimenScroll}
              fontId={specimenFontId}
              font={specimenFont} />
          </ReactTransitionGroup>}
      </div>
    )
  }
}

Hot30Page.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default Hot30Page