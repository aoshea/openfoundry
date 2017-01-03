import React, { Component } from 'react'
import Helmet from 'react-helmet'
import AboutPage from 'components/about-page/about-page'

class About extends Component {
  render() {
    return (<div><Helmet title={'Open Foundry / About'} /><AboutPage /></div>)
  }
}

export default About
