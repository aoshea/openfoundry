import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import ReactTransitionGroup from 'react-addons-transition-group'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import FontSpecimen from 'components/font-specimen/font-specimen'

class SpecimenPage extends Component {

  propTypes: {
    fonts: PropTypes.array.isRequired,
    fontId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    this.onComplete = this.onComplete.bind(this);
    this.navigateToOpen = this.navigateToOpen.bind(this);
    this.handleAppEvent = this.handleAppEvent.bind(this);

    console.log('SpecimenPage()')
  }

  navigateToOpen() {
    this.context.router.push('/hot30');
  }

  onComplete() {
    this.navigateToOpen();
  }

  handleAppEvent(e) {
    switch (e.actionType) {
      case 'font-data-updated':
        this.setState({
          fonts: e.data
        });
        break;
    }
  }

  componentDidMount() {
    /*
    this.handleAppEventListener = appDispatcher.register(this.handleAppEvent);
    if (appModel.parsedFonts) {
      this.setState({ fonts: appModel.parsedFonts });
    } else {
      appDispatcher.dispatch({ actionType: 'fetch-font-data' });
    }
    */
  }

  componentWillUnmount() {
    // appDispatcher.unregister(this.handleAppEventListener);
  }

  render() {

    const { fontId, fonts } = this.props

    const font = fonts.find(f => fontId === f.get('id'))
    const title = `Open Foundry / Hot 30 / ${font.get('fontName')}`

    return (
      <ReactTransitionGroup>
        <Helmet title={title} />
        <FontSpecimen
           onCompleteScroll={this.onComplete}
           font={font}
           key={0}
           fontId={fontId} />
      </ReactTransitionGroup>
    )
  }
}

SpecimenPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default SpecimenPage