import { connect } from 'react-redux'
import NavBar from 'components/navbar/navbar.js'
import {
  openMenu,
  closeMenu,
  locationChange,
  showBreadcrumbs,
  hideBreadcrumbs } from './actions'

const mapStateToProps = (state, ownProps) => {
  return {
    fonts: state.fonts.get('fonts'),
    menuOpen: state.ui.get('menuOpen'),
    breadcrumbUp: state.ui.get('breadcrumpUp'),
    logoUp: state.ui.get('logoUp'),
    fontId: ownProps.fontId
  }
}

const mapDispatchToProps = {
  openMenu,
  closeMenu,
  locationChange,
  showBreadcrumbs,
  hideBreadcrumbs
}

const Nav = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar)

export default Nav
