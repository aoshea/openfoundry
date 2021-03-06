import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { getFontId, getFullFontName } from 'util/content_util.js'
import NewsletterSignup from 'components/newsletter/newsletter.js'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export default class NavBar extends Component {

  static propTypes = {
    fonts: PropTypes.object.isRequired,
    fontId: PropTypes.string,
    menuOpen: PropTypes.bool.isRequired,
    breadcrumbUp: PropTypes.bool,
    logoUp: PropTypes.bool.isRequired,
    openMenu: PropTypes.func.isRequired,
    closeMenu: PropTypes.func.isRequired,
    locationChange: PropTypes.func.isRequired,
    showBreadcrumbs: PropTypes.func.isRequired,
    hideBreadcrumbs: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this.handleBurgerClick = this.handleBurgerClick.bind(this)
    this.handleMenuClick = this.handleMenuClick.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.state = {}

    this.lastScrollTop = 100
  }

  componentDidMount() {
    this.addScrollListeners()
  }

  componentWillUnmount() {
    this.removeScrollListeners()
  }

  addScrollListeners() {
    window.addEventListener('scroll', this.handleScroll)
  }

  removeScrollListeners() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll(e) {

    const { showBreadcrumbs, hideBreadcrumbs } = this.props

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    // const windowHeight = y = window.innerHeight|| document.documentElement.clientHeight
    const navbarHeight = 50

    // scroll more than delta
    if (Math.abs(this.lastScrollTop - scrollTop) <= 100) return

    let actionType = null

    if (scrollTop > this.lastScrollTop && scrollTop > navbarHeight) {
      // scroll down pass the nav bar
      actionType = 'SHOW_BREADCRUMBS'
    } else if (scrollTop < 200 && window.location.pathname === '/hot30') {
      // scroll up at the top of the page
      actionType = 'HIDE_BREADCRUMBS'
    }

    if (actionType !== null) {
      // need to delay since we could be in the middle of a dispatch
      requestAnimationFrame(() => {
        if (actionType === 'SHOW_BREADCRUMBS') {
          showBreadcrumbs({})
        }
      })
    }

    this.lastScrollTop = scrollTop
  }

  handleAppEvent(e) {

    switch (e.actionType) {

      case 'hide-menu':
        this.setState({
          isNavHidden: true
        })
        break

    }
  }

  handleBurgerClick() {

    const { closeMenu, openMenu, menuOpen } = this.props
    const newMenuOpen = !menuOpen

    return menuOpen
      ? closeMenu({ menuOpen: newMenuOpen })
      : openMenu({ menuOpen: newMenuOpen })
  }

  handleMenuClick() {

    const { menuOpen, locationChange } = this.props

    locationChange({ menuOpen })
  }

  render() {

    const {
      fonts,
      fontId,
      menuOpen,
      breadcrumbUp,
      logoUp } = this.props

    // Define class names based on ui state
    const iconClassName = menuOpen ? 'menu-icon active' : 'menu-icon'
    const listClassName = menuOpen ? 'menu-list open' : 'menu-list'
    const signupClassName = menuOpen ? 'menu-signup open' : 'menu-signup'
    const breadClassName = breadcrumbUp ? 'menu-breadcrumb up' : 'menu-breadcrumb'
    let logoClassName = menuOpen ? 'menu-logo open' : 'menu-logo'
    if (logoUp) {
      logoClassName += ' up'
    }

    // Breadcrumbs are based on location string
    // const pathName = window.location.pathname

    let breadcrumb = ''

    // Get breadcrumb for fonts
    if (fonts && fontId) {
      let breadClassFirstName = breadClassName + ' first-level'
      let matchedFont = fonts.find(f => f.get('id') === fontId)

      breadcrumb = [
        <li className={breadClassFirstName} key="level-1"><Link to="/hot30">Hot30</Link></li>,
        <li className={breadClassName} key="level-2">{matchedFont.get('fontName')}</li>
      ]

    } else {
      breadcrumb = (<li className={breadClassName}>Hot30</li>)
    }

    // Breadcrumbs based on location string if not on fonts(hot30) page
    const pathName = window.location.pathname

    // Override breadcrumb variable if any match
    if (pathName === '/about') {
      breadcrumb = <li className={breadClassName}>About</li>
    } else if (pathName === '/submit') {
      breadcrumb = <li className={breadClassName}>Submit</li>
    } else if (pathName === '/signup') {
      breadcrumb = <li className={breadClassName}>Signup</li>
    }

    return (
      <header className="of-navbar">
        <nav>
          <ul className="menu-header">
            <li onClick={ this.handleBurgerClick } className={iconClassName}>
              <a><span></span></a>
            </li>
            <li className={logoClassName}>
              <Link to="/hot30">
                <span className="open">
                  <svg id="open" x="0px" y="0px" viewBox="719 269.5 54 28">
                    <g>
                      <rect x="720" y="270.5" width="52" height="26"/>
                      <path d="M731.6,277c3.5,0,5.6,2.6,5.6,6c0,3.3-2.1,5.9-5.6,5.9s-5.6-2.6-5.6-5.9C726,279.7,728.1,277,731.6,277z M731.6,286.9 c2.3,0,3.1-1.9,3.1-3.8c0-2-0.8-3.9-3.1-3.9s-3.1,1.9-3.1,3.9C728.5,285,729.3,286.9,731.6,286.9z M738.8,280.5h2.2v1.1h0 c0.5-0.9,1.4-1.3,2.5-1.3c2.6,0,3.8,2.1,3.8,4.4c0,2.2-1.2,4.3-3.6,4.3c-1,0-1.9-0.4-2.5-1.2h0v3.9h-2.3V280.5z M745,284.6 c0-1.3-0.5-2.7-2-2.7c-1.5,0-2,1.3-2,2.7c0,1.3,0.5,2.6,2,2.6C744.5,287.2,745,286,745,284.6z M750.6,285.1c0.1,1.4,0.8,2.1,2,2.1 c0.9,0,1.6-0.6,1.8-1.1h2c-0.6,2-2,2.8-3.9,2.8c-2.6,0-4.2-1.8-4.2-4.4c0-2.5,1.7-4.4,4.2-4.4c2.8,0,4.2,2.4,4,4.9H750.6z M754.3,283.7c-0.2-1.2-0.7-1.8-1.8-1.8c-1.4,0-1.9,1.1-1.9,1.8H754.3z M758,280.5h2.2v1.2h0c0.6-0.9,1.6-1.4,2.5-1.4 c2.4,0,3,1.4,3,3.4v5.1h-2.3v-4.7c0-1.4-0.4-2-1.5-2c-1.2,0-1.8,0.7-1.8,2.4v4.3H758V280.5z"/>
                    </g>
                  </svg>
                </span>
                <span className="foundry">
                  <svg id="foundry" x="0px" y="0px" viewBox="783.2 269.5 76 28">
                    <g>
                      <rect x="784.2" y="270.5" width="74" height="26"/>
                      <path d="M790.7,277.3h8v2.1h-5.5v2.6h4.8v2h-4.8v4.7h-2.5V277.3z M803.7,280.2c2.6,0,4.3,1.7,4.3,4.4c0,2.6-1.7,4.4-4.3,4.4 c-2.6,0-4.3-1.7-4.3-4.4C799.4,282,801.1,280.2,803.7,280.2z M803.7,287.2c1.6,0,2-1.3,2-2.6c0-1.3-0.5-2.7-2-2.7 c-1.5,0-2,1.3-2,2.7C801.7,285.9,802.1,287.2,803.7,287.2z M817.2,288.7H815v-1.2h0c-0.6,0.9-1.6,1.4-2.5,1.4c-2.4,0-3-1.4-3-3.4 v-5.1h2.3v4.7c0,1.4,0.4,2,1.5,2c1.2,0,1.8-0.7,1.8-2.4v-4.3h2.3V288.7z M819.1,280.5h2.2v1.2h0c0.6-0.9,1.6-1.4,2.5-1.4 c2.4,0,3,1.4,3,3.4v5.1h-2.3v-4.7c0-1.4-0.4-2-1.5-2c-1.2,0-1.8,0.7-1.8,2.4v4.3h-2.3V280.5z M834.6,287.7L834.6,287.7 c-0.6,0.9-1.5,1.3-2.5,1.3c-2.5,0-3.7-2.1-3.7-4.4c0-2.2,1.2-4.3,3.7-4.3c1,0,1.9,0.4,2.4,1.2h0v-4.2h2.3v11.4h-2.2V287.7z  M832.6,281.9c-1.5,0-2,1.3-2,2.6c0,1.3,0.6,2.7,2,2.7c1.5,0,2-1.3,2-2.7C834.5,283.2,834,281.9,832.6,281.9z M838.6,280.5h2.2v1.5 h0c0.4-1,1.5-1.8,2.6-1.8c0.2,0,0.4,0,0.5,0.1v2.1c-0.2,0-0.5-0.1-0.8-0.1c-1.7,0-2.2,1.2-2.2,2.7v3.7h-2.3V280.5z M849.5,289.8 c-0.5,1.3-1.3,1.9-2.8,1.9c-0.5,0-0.9,0-1.4-0.1v-1.9c0.4,0,0.9,0.1,1.3,0.1c0.8-0.1,1-0.9,0.8-1.6l-2.9-7.8h2.4l1.9,5.7h0l1.8-5.7 h2.4L849.5,289.8z"/>
                    </g>
                  </svg>
                </span>
                <span className="of">
                  <svg id="of" x="0px" y="0px" viewBox="939.7 269.5 34 28">
                    <g>
                    <rect x="940.7" y="270.5" width="32" height="26"/>
                    <path d="M946.6,281.2c0.3-0.7,0.6-1.4,1.1-1.9c0.5-0.5,1.1-1,1.8-1.3c0.7-0.3,1.5-0.5,2.4-0.5c0.9,0,1.7,0.2,2.4,0.5 s1.3,0.7,1.8,1.3c0.5,0.5,0.8,1.2,1.1,1.9c0.3,0.7,0.4,1.5,0.4,2.4c0,0.8-0.1,1.6-0.4,2.3c-0.3,0.7-0.6,1.3-1.1,1.9 c-0.5,0.5-1.1,1-1.8,1.3s-1.5,0.5-2.4,0.5c-0.9,0-1.7-0.2-2.4-0.5c-0.7-0.3-1.3-0.7-1.8-1.3c-0.5-0.5-0.8-1.2-1.1-1.9 c-0.3-0.7-0.4-1.5-0.4-2.3C946.2,282.7,946.3,281.9,946.6,281.2z M948.9,285c0.1,0.5,0.3,0.9,0.5,1.2c0.2,0.4,0.6,0.7,1,0.9 c0.4,0.2,0.9,0.3,1.4,0.3s1-0.1,1.4-0.3c0.4-0.2,0.7-0.5,1-0.9c0.2-0.4,0.4-0.8,0.5-1.2c0.1-0.5,0.2-0.9,0.2-1.4 c0-0.5-0.1-1-0.2-1.5c-0.1-0.5-0.3-0.9-0.5-1.3s-0.6-0.7-1-0.9s-0.9-0.3-1.4-0.3s-1,0.1-1.4,0.3s-0.7,0.5-1,0.9 c-0.2,0.4-0.4,0.8-0.5,1.3c-0.1,0.5-0.2,1-0.2,1.5C948.7,284,948.8,284.5,948.9,285z M967.3,277.8v2.1h-5.5v2.6h4.8v2h-4.8v4.7h-2.5 v-11.4H967.3z"/>
                    </g>
                  </svg>
                </span>
              </Link>
            </li>

          { breadcrumb }

          </ul>
          <div className={listClassName}>
            <ul>
            <li><Link onClick={ this.handleMenuClick } to="/hot30" activeClassName="active">Hot 30</Link></li>
            <li><Link onClick={ this.handleMenuClick } to="/submit" activeClassName="active">Submit</Link></li>
            <li><Link onClick={ this.handleMenuClick } to="/about" activeClassName="active">About</Link></li>
            <li>
              <a href="http://open-foundry.tumblr.com/">Blog</a>
              <svg x="0px" y="0px" viewBox="0 0 32 32">
                <path id="external-icon" d="M19.7,18.3L17,15.7l-4,4L12.3,19l4-4l-2.6-2.6h6V18.3z"/>
              </svg>
            </li>
            </ul>
          </div>
          <ul className={signupClassName}>
            <li><NewsletterSignup menuOpen={menuOpen}/></li>
          </ul>
        </nav>
      </header>
    )
  }
}
