import React, { Component } from 'react';

export default class NewsletterSignup extends Component {

  render() {

    let hideStyle = {
      position: 'absolute',
      left: '-5000px'
    };

    return (
      <div className="newsletter-wrapper">
        <form id="newsletter-form" className="simform" action="submit" method="post">
          <div className="simform-inner">
            <ol className="questions">
              <li><input placeholder="Your E-Mail?" type="email" name="EMAIL" /></li>
            </ol>
            <div style={hideStyle} aria-hidden="true">
              <input type="text" name="b_73b581b4d34df10e79efdd0ab_53d6e63058" tabIndex="-1" value="" />
            </div>
            <button className="submit" type="submit">Send</button>
            <div className="controls">
              <button className="next"></button>
              <div className="progress"></div>
              <span className="number">
                <span className="number-current"></span>
                <span className="number-total"></span>
              </span>
              <span className="error-message"></span>
            </div>
          </div>
          <span className="final-message"></span>
        </form>
      </div>
    )
  }
}