import React, { Component } from 'react';
import classNames from 'classnames';

export default class FontLikeButton extends Component {

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    let { locked, onUpdate } = this.props;

    console.log('clicked like, locked', locked);

    if (locked) return;

    onUpdate && onUpdate();
  }

  render() {

    let btnClass = classNames({
      'like-button': true,
      'like-button-disabled': this.props.locked
    });

    return (
      <div className="vote-container">
        <div onClick={ this.handleClick } className={btnClass}>
          <svg xmlns="http://www.w3.org/svg/2000" viewBox="0 0 32 32">
            <path d="M21.1,11.4c1.3,1.4,1.3,3.6,0,4.9L16,21.5l-5.1-5.2c-1.3-1.4-1.3-3.6,0-4.9c1.2-1.2,3.1-1.2,4.3,0l0.8,0.8l0.8-0.8
  C18,10.2,19.9,10.2,21.1,11.4"/>
          </svg>
        </div>
        <span className="num-likes">{this.props.likes}</span>
      </div>
    )
  }
}