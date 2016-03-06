import { Router, IndexRoute, Route, IndexLink, IndexRedirect, Link, browserHistory } from 'react-router'
import React, { Component } from 'react';
import Helmet from "react-helmet";
import { render } from 'react-dom';
import { replaceNonAlphaNumeric } from './util/util.js';
import FontSpecimen from './components/font-specimen/font-specimen.js';
import FontList from './components/font-list/font-list.js';
import NewsletterSignup from './components/newsletter/newsletter.js';
import AboutPage from './components/about/about.js';
import SubmissionPage from './components/submission/submission.js';
import $ from 'jquery';
import Tabletop from 'tabletop';
import ReactTransitionGroup from 'react-addons-transition-group';
import { getFontId, getFullFontName } from 'util/content_util.js';
import { Dispatcher } from 'flux';
import appDispatcher from 'app-dispatcher';
import appModel from 'app-model';

var cache = {
  fonts: null,
  likes: null
};

class App extends Component {

  constructor() {
    super()
    this.handleBurgerClick = this.handleBurgerClick.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleAppEvent = this.handleAppEvent.bind(this);

    this.isScrolled = false;
    this.delta = 100;
    this.lastScrollTop = 100;

    this.state = {
      isLoaded: false,
      isMenuOpen: false,
      isLogoUp: false,
      isBreadCrumbUp: false,
      fonts: [],
      likes: []
    };
  }

  componentDidMount() {

    var self = this;
    var navbarHeight = 50;

    $(window).on('scroll', function () {
      self.isScrolled = true;
      requestAnimationFrame(self.checkScroll.bind(self))
    });

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

      case 'show-breadcrumbs':
        this.setState({
          isMenuOpen: false,
          isLogoUp: true,
          isBreadCrumbUp: false
        });
        break;

      case 'hide-breadcrumbs':
        this.setState({
          isLogoUp: false,
          isBreadCrumbUp: true
        });
        break;

      case 'font-data-updated':
        this.setState({
          isLoaded: true,
          fonts: e.data
        });
        break;
    }
  }

  handleBurgerClick() {
    let { isMenuOpen } = this.state;

    isMenuOpen = !isMenuOpen;
    this.setState({
      isMenuOpen: isMenuOpen,
      isBreadCrumbUp: isMenuOpen,
      isLogoUp: !isMenuOpen
    });
  }

  handleMenuClick() {
    let { isMenuOpen } = this.state;

    if (isMenuOpen) {
      this.setState({
        isMenuOpen: false,
        isBreadCrumbUp: false,
        isLogoUp: true
      });
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

    let iconClassName = this.state.isMenuOpen ? 'menu-icon active' : 'menu-icon';
    let listClassName = this.state.isMenuOpen ? 'menu-list open' : 'menu-list';
    let signupClassName = this.state.isMenuOpen ? 'menu-signup open' : 'menu-signup';
    let logoClassName = this.state.isMenuOpen ? 'menu-logo open' : 'menu-logo';
    let breadClassName = this.state.isBreadCrumbUp ? 'menu-breadcrumb up' : 'menu-breadcrumb';
    let rootClassName = this.state.isLoaded ? 'is-loaded' : '';


    if (this.state.isLogoUp) {
      logoClassName += ' up';
    }

    let { location } = this.props;

    let pathName = location.pathname;

    let breadcrumb = '';

    // matches specimen page and extracts ID
    var matchSpecimen = pathName.match(/\/hot30\/(.*)/i);

    if (pathName === '/hot30') {

      breadcrumb = <li className={breadClassName}>Hot30</li>;

    } else if (matchSpecimen && matchSpecimen.length === 2) {
      // add an extra class so hot30 can grey out
      var breadClassFirstName = breadClassName + ' first-level';
      // font list needs to be loaded to match the name
      if (this.state.fonts) {
        // map id -> font
        let font = this.state.fonts.find(function(o){
          return replaceNonAlphaNumeric(o['font-id']).toLowerCase() === matchSpecimen[1]
        });
        // extract the full font name
        var fontName = !!font ? getFullFontName(font) : "";
      }
      // setup breadcrumbs
      breadcrumb = [
        <li className={breadClassFirstName} key='level-1'><Link to="/hot30">Hot30</Link></li>,
        <li className={breadClassName} key='level-2'>{fontName}</li>
      ];

    } else if (pathName === '/about') {
      breadcrumb = <li className={breadClassName}>About</li>;
    } else if (pathName === '/submit') {
      breadcrumb = <li className={breadClassName}>Submit</li>;
    }

    return (
      <div className={rootClassName}>
        <header className="of-navbar">
          <nav>
            <ul className="menu-header">
              <li onClick={ this.handleBurgerClick } className={iconClassName}>
                <a><span></span></a>
              </li>
              <li className={logoClassName}>
                <Link to="/hot30">
                  <span className="open">
                    <svg id="open" x="0px" y="0px" viewBox="719 269.5 54 28" enable-background="new 719 269.5 54 28">
                      <g>
                        <rect x="720" y="270.5" width="52" height="26"/>
                        <path d="M731.6,277c3.5,0,5.6,2.6,5.6,6c0,3.3-2.1,5.9-5.6,5.9s-5.6-2.6-5.6-5.9C726,279.7,728.1,277,731.6,277z M731.6,286.9 c2.3,0,3.1-1.9,3.1-3.8c0-2-0.8-3.9-3.1-3.9s-3.1,1.9-3.1,3.9C728.5,285,729.3,286.9,731.6,286.9z M738.8,280.5h2.2v1.1h0 c0.5-0.9,1.4-1.3,2.5-1.3c2.6,0,3.8,2.1,3.8,4.4c0,2.2-1.2,4.3-3.6,4.3c-1,0-1.9-0.4-2.5-1.2h0v3.9h-2.3V280.5z M745,284.6 c0-1.3-0.5-2.7-2-2.7c-1.5,0-2,1.3-2,2.7c0,1.3,0.5,2.6,2,2.6C744.5,287.2,745,286,745,284.6z M750.6,285.1c0.1,1.4,0.8,2.1,2,2.1 c0.9,0,1.6-0.6,1.8-1.1h2c-0.6,2-2,2.8-3.9,2.8c-2.6,0-4.2-1.8-4.2-4.4c0-2.5,1.7-4.4,4.2-4.4c2.8,0,4.2,2.4,4,4.9H750.6z M754.3,283.7c-0.2-1.2-0.7-1.8-1.8-1.8c-1.4,0-1.9,1.1-1.9,1.8H754.3z M758,280.5h2.2v1.2h0c0.6-0.9,1.6-1.4,2.5-1.4 c2.4,0,3,1.4,3,3.4v5.1h-2.3v-4.7c0-1.4-0.4-2-1.5-2c-1.2,0-1.8,0.7-1.8,2.4v4.3H758V280.5z"/>
                      </g>
                    </svg>
                  </span>
                  <span className="foundry">
                    <svg id="foundry" x="0px" y="0px" viewBox="783.2 269.5 76 28" enable-background="new 783.2 269.5 76 28">
                      <g>
                        <rect x="784.2" y="270.5" width="74" height="26"/>
                        <path d="M790.7,277.3h8v2.1h-5.5v2.6h4.8v2h-4.8v4.7h-2.5V277.3z M803.7,280.2c2.6,0,4.3,1.7,4.3,4.4c0,2.6-1.7,4.4-4.3,4.4 c-2.6,0-4.3-1.7-4.3-4.4C799.4,282,801.1,280.2,803.7,280.2z M803.7,287.2c1.6,0,2-1.3,2-2.6c0-1.3-0.5-2.7-2-2.7 c-1.5,0-2,1.3-2,2.7C801.7,285.9,802.1,287.2,803.7,287.2z M817.2,288.7H815v-1.2h0c-0.6,0.9-1.6,1.4-2.5,1.4c-2.4,0-3-1.4-3-3.4 v-5.1h2.3v4.7c0,1.4,0.4,2,1.5,2c1.2,0,1.8-0.7,1.8-2.4v-4.3h2.3V288.7z M819.1,280.5h2.2v1.2h0c0.6-0.9,1.6-1.4,2.5-1.4 c2.4,0,3,1.4,3,3.4v5.1h-2.3v-4.7c0-1.4-0.4-2-1.5-2c-1.2,0-1.8,0.7-1.8,2.4v4.3h-2.3V280.5z M834.6,287.7L834.6,287.7 c-0.6,0.9-1.5,1.3-2.5,1.3c-2.5,0-3.7-2.1-3.7-4.4c0-2.2,1.2-4.3,3.7-4.3c1,0,1.9,0.4,2.4,1.2h0v-4.2h2.3v11.4h-2.2V287.7z  M832.6,281.9c-1.5,0-2,1.3-2,2.6c0,1.3,0.6,2.7,2,2.7c1.5,0,2-1.3,2-2.7C834.5,283.2,834,281.9,832.6,281.9z M838.6,280.5h2.2v1.5 h0c0.4-1,1.5-1.8,2.6-1.8c0.2,0,0.4,0,0.5,0.1v2.1c-0.2,0-0.5-0.1-0.8-0.1c-1.7,0-2.2,1.2-2.2,2.7v3.7h-2.3V280.5z M849.5,289.8 c-0.5,1.3-1.3,1.9-2.8,1.9c-0.5,0-0.9,0-1.4-0.1v-1.9c0.4,0,0.9,0.1,1.3,0.1c0.8-0.1,1-0.9,0.8-1.6l-2.9-7.8h2.4l1.9,5.7h0l1.8-5.7 h2.4L849.5,289.8z"/>
                      </g>
                    </svg>
                  </span>
                </Link>
              </li>

      { breadcrumb }

            </ul>
            <ul className={listClassName}>
              <li><Link onClick={ this.handleMenuClick } to="/hot30" activeClassName="active">Hot 30</Link></li>
              <li><Link onClick={ this.handleMenuClick } to="/submit" activeClassName="active">Submit</Link></li>
              <li><Link onClick={ this.handleMenuClick } to="/about" activeClassName="active">About</Link></li>
              <li>
                <a href="http://open-foundry.tumblr.com/">Blog</a>
                <svg x="0px" y="0px" viewBox="0 0 32 32" enable-background="new 0 0 32 32">
                  <path id="external-icon" d="M19.7,18.3L17,15.7l-4,4L12.3,19l4-4l-2.6-2.6h6V18.3z"/>
                </svg>
              </li>
            </ul>
            <ul className={signupClassName}>
              <li><NewsletterSignup menuOpen={ this.state.isMenuOpen }/></li>
            </ul>
          </nav>
        </header>

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

  constructor() {
    super();

    this.handleAppEvent = this.handleAppEvent.bind(this);

    this.state = {
      isSpecimen: false,
      fonts: [],
      likes: []
    };
  }

  handleAppEvent(e) {
    switch (e.actionType){
      case 'font-data-updated':
          this.setState({
            fonts: e.data
          });
        break;
      case 'like-data-updated':
        this.setState({
          likes: e.data
        });
        break;
    }
  }

  componentDidMount() {
    const self = this;

    this.handleAppEventListener = appDispatcher.register(this.handleAppEvent);
    appDispatcher.dispatch({ actionType: 'fetch-font-data' });

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
        <FontList fixed={isSpecimen} likes={likes} fonts={fonts} />
        {this.props.children}
      </div>
    )
  }
}

Open.contextTypes = {
  location: React.PropTypes.object
};

class Specimen extends Component {

  constructor() {
    super();

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
    appDispatcher.dispatch({ actionType: 'fetch-font-data' });
  }

  componentWillUnmount() {
    appDispatcher.unregister(this.handleAppEventListener);
  }

  render() {
    let { fontId } = this.props.params;

    if (!this.state.fonts) return <div>Loading...</div>

    let matches = this.state.fonts.filter(function (font) {
      let id = font['font-id'];
      return replaceNonAlphaNumeric(id).toLowerCase() === fontId;
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

browserHistory.listen(function (location) {
  // need to render <Helmet> before retrieving pages title
  setTimeout(function(){

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
  }, 50);
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
    </Route>
  </Router>
),
document.querySelector('.of-container')
);
