import React, { Component } from 'react'
import { Link } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default class NewcomerPreview extends Component {

  render() {

    return (
      <div className="newcomer-preview">
        <ReactCSSTransitionGroup transitionName="newcomer-transition" transitionAppear={true} transitionAppearTimeout={2000} transitionEnterTimeout={0} transitionLeaveTimeout={2000}>
        <ul key="0" className="newcomer-preview-list">
          <li>More</li>
          <li>
            <Link to="/submit">
              <div className="newcomer-card-container">
                <ul className="newcomer-card-list">
                  <li className="newcomer-card-front">Newcomer</li>
                  <li className="newcomer-card-back">Submit</li>
                </ul>
              </div>
            </Link>
          </li>
          <li>Soon.</li>
        </ul>
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}
