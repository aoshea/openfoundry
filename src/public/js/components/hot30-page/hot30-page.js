import React, { Component, PropTypes } from 'react'
import ReactTransitionGroup from 'react-addons-transition-group'
import Helmet from 'react-helmet'
import FontList from 'components/font-list/font-list'
import FontSpecimen from 'components/font-specimen/font-specimen'
import SpecimenTransitionContainer from 'containers/specimen-transition-container/specimen-transition-container'

class Hot30Page extends Component {

  static propTypes = {
    fonts: PropTypes.object.isRequired,
    likes: PropTypes.object.isRequired,
    isGridView: PropTypes.bool.isRequired,
    specimenFontId: PropTypes.string,
    specimenOffset: PropTypes.number.isRequired,
    exitSpecimen: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.onCompleteSpecimenScroll = this.onCompleteSpecimenScroll.bind(this)
  }

  onCompleteSpecimenScroll() {
    this.context.router.push('/hot30')
  }

  render() {

    const {
      fonts,
      likes,
      isGridView,
      exitSpecimen,
      specimenOffset,
      specimenFontId } = this.props

    // TODO Add reselect to cache selectors such as these
    //      Prevent unnecessary computation in render
    //      Admittedly very little performance gain in most cases
    const specimenFont = specimenFontId ? fonts.find(f => f.get('id') === specimenFontId) : null

    const viewClassName = isGridView ? 'of--grid-view' : 'of--list-view'

    return (
      <div className={viewClassName}>
        <Helmet title={'OpenFoundry / Hot 30'} />
        <FontList
          isGridView={isGridView}
          fonts={fonts}
          likes={likes}
          specimenFont={specimenFont}
          specimenOffset={specimenOffset} />
        {specimenFont &&
          <ReactTransitionGroup>
            <FontSpecimen
              onCompleteScroll={this.onCompleteSpecimenScroll}
              exitSpecimen={exitSpecimen}
              fontId={specimenFontId}
              font={specimenFont}
              isGridView={isGridView}
              likes={likes} />
          </ReactTransitionGroup>}
        <SpecimenTransitionContainer />
      </div>
    )
  }
}

Hot30Page.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default Hot30Page
