import React, { Component } from 'react'
import Helmet from 'react-helmet'
import NewsletterSignup from 'components/newsletter/newsletter'

const Signup = () => {
  return (
    <div className="newsletter-fullscreen">
      <Helmet title={'Open Foundry / Sign Up'} />
      <NewsletterSignup menuOpen={true} />
    </div>)
}

export default Signup
