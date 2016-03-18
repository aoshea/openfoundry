import { Router, IndexRoute, Route, IndexLink, IndexRedirect, Link, browserHistory } from 'react-router'
import React, { Component } from 'react';
import Helmet from "react-helmet";
import { render } from 'react-dom';
import classNames from 'classnames';
import FontSpecimen from './components/font-specimen/font-specimen.js';
import FontList from './components/font-list/font-list.js';
import NewcomerPreview from './components/newcomer-preview/newcomer-preview.js';
import Debug from './components/debug/debug.js';
import AboutPage from './components/about/about.js';
import SubmissionPage from './components/submission/submission.js';
import $ from 'jquery';
import Tabletop from 'tabletop';
import ReactTransitionGroup from 'react-addons-transition-group';
import { getFontId, getFullFontName } from 'util/content_util.js';
import appDispatcher from 'app-dispatcher';
import appModel from 'app-model';
import NavBar from 'components/navbar/navbar';
import Perf from 'react-addons-perf';
import PureRenderMixin from 'react-addons-pure-render-mixin';

window.Perf = Perf;

var cache = {
  fonts: null,
  likes: null
};

var isTesting = false;
$(window).on('keyup', function (e) {
  // p key
  if (e.keyCode === 80) {
      if(isTesting = !isTesting){
        Perf.start();
        console.log('start')
      }else{
        console.log('stop')
        Perf.stop();
        Perf.printWasted();
        Perf.printInclusive()
        // Perf.printExclusive()
      }
  }
})

class App extends Component {

  constructor() {
    super()

    this.handleAppEvent = this.handleAppEvent.bind(this);

    this.isScrolled = false;
    this.delta = 100;
    this.lastScrollTop = 100;

    this.state = {
      isLoaded: false,
      fonts: [],
      likes: []
    };
  }

  componentDidMount() {

    var self = this;
    var navbarHeight = 50;

    $(window).on('scroll', function () {
      this.isScrolled = true;
      requestAnimationFrame(this.checkScroll.bind(this))
    }.bind(this));

    this.forceUpdateMenu = true;
    requestAnimationFrame(self.checkScroll.bind(self))

    appDispatcher.register(this.handleAppEvent);

    appDispatcher.dispatch({
      actionType: 'fetch-font-data'
    });

  }

  componentWillUnmount() {

    $(window).off('scroll');
  }

  handleAppEvent(e) {

    switch (e.actionType) {

      case 'font-data-updated':
        this.setState({
          isLoaded: true,
          fonts: e.data
        });
        break;
    }
  }

  checkScroll() {

    var scrollTop = $(window).scrollTop();
    var windowHeight = $(window).height();
    var documentHeight = $(document).height();
    var navbarHeight = 50;

    // scroll more than delta
    if (Math.abs(this.lastScrollTop - scrollTop) <= 100 && !this.forceUpdateMenu) return;

    // if they scrolled down and are past the navbar, add class .up.
    if (scrollTop > this.lastScrollTop && scrollTop > navbarHeight) {
      appDispatcher.dispatch({ actionType: 'show-breadcrumbs' });
    } else if (scrollTop < 200 && location.pathname === '/hot30') {
      appDispatcher.dispatch({ actionType: 'hide-breadcrumbs' });
    }

    this.forceUpdateMenu = false;

    this. lastScrollTop = scrollTop;
  }

  render() {

    let { location } = this.props;

    let rootClassName = classNames({
      'is-loaded': this.state.isLoaded,
      'nav-hidden': this.state.isNavHidden
    });

    return (
      <div className={rootClassName}>
        <NavBar location={location}></NavBar>
        <div className="of-main">
          {this.props.children}
        </div>
      </div>
    )
  }
}

App.contextTypes = {
  location: React.PropTypes.object
};

class Open extends Component {

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    this.handleAppEvent = this.handleAppEvent.bind(this);

    this.state = {
      isSpecimen: false,
      fonts: []
    };
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
    const self = this;

    this.handleAppEventListener = appDispatcher.register(this.handleAppEvent);

    if (appModel.parsedFonts) {
      this.setState({ fonts: appModel.parsedFonts });
    } else {
      appDispatcher.dispatch({ actionType: 'fetch-font-data' });
    }
  }

  componentWillUnmount() {
    appDispatcher.unregister(this.handleAppEventListener);
  }

  componentDidUpdate() {
    let { location } = this.props;
    let { isSpecimen} = this.state;

    let pathName = location.pathname;

    if (isSpecimen) {
      if (pathName === '/hot30') this.setState({ isSpecimen: false });
    } else {
      if (pathName !== '/hot30') this.setState({ isSpecimen: true });
    }
  }

  render() {
    const { fonts, likes, isSpecimen } = this.state;

    return (
      <div>
        <Helmet title={"OpenFoundry / Hot 30"} />
        <NewcomerPreview />
        <FontList fixed={isSpecimen} fonts={fonts} />
        {this.props.children}
      </div>
    )
  }
}

Open.contextTypes = {
  location: React.PropTypes.object
};

class Specimen extends Component {

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    this.onComplete = this.onComplete.bind(this);
    this.navigateToOpen = this.navigateToOpen.bind(this);
    this.handleAppEvent = this.handleAppEvent.bind(this);

    this.state = {
      fonts: []
    };
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
    this.handleAppEventListener = appDispatcher.register(this.handleAppEvent);
    if (appModel.parsedFonts) {
      this.setState({ fonts: appModel.parsedFonts });
    } else {
      appDispatcher.dispatch({ actionType: 'fetch-font-data' });
    }
  }

  componentWillUnmount() {
    appDispatcher.unregister(this.handleAppEventListener);
  }

  render() {
    let { fontId } = this.props.params;

    if (!this.state.fonts) return <div>Loading...</div>

    let matches = this.state.fonts.filter(function (font) {
      return getFontId(font) === fontId;
    });

    let match = matches.length ? matches[0] : null;

    return  <ReactTransitionGroup>
            <Helmet title={"Open Foundry / Hot 30 / " + getFullFontName(match)} />
            <FontSpecimen
                         onCompleteScroll={this.onComplete}
                         font={match}
                         key={0}
                         fontId={fontId} />

            </ReactTransitionGroup>
  }
}

Specimen.contextTypes = {
  router: React.PropTypes.object.isRequired
}

class About extends Component {
  render() {
    return <div>
              <Helmet title={"Open Foundry / About"} />
              <AboutPage />
           </div>
  }
}

class Submission extends Component {
  render() {
    return <div>
              <Helmet title={"Open Foundry / Submit"} />
              <SubmissionPage />
           </div>
  }
}

class Signup extends Component {
  render() {
    return <div className='newsletter-fullscreen'>
              <Helmet title={"Open Foundry / Signup"} />

              <NewsletterSignup menuOpen={true} />

           </div>
  }
}

browserHistory.listen(function (location) {
  // need to render <Helmet> before retrieving pages title
  setTimeout(function () {
    if (!window.ga) return;
    window.ga('send', 'pageview', location.pathname);

    if (location.pathname === '/hot30') {
      appDispatcher.dispatch({
        actionType: 'hide-breadcrumbs'
      });
    } else {
      appDispatcher.dispatch({
        actionType: 'show-breadcrumbs'
      });
    }

    if (location.pathname === '/signup') {
      appDispatcher.dispatch({ actionType: 'hide-menu' })
    }
  }, 50);

  appDispatcher.dispatch({ actionType: 'location-changed', location: location })

});


render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/hot30" />
      <Route path="/hot30" component={Open}>
        <Route path=":fontId" component={Specimen} />
      </Route>
      <Route path="submit" component={Submission} />
      <Route path="about" component={About} />
      <Route path="signup" component={Signup} />
      <Route path="/debug" component={Debug} />
    </Route>
  </Router>
),
document.querySelector('.of-container')
);
