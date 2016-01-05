import React, { Component } from 'react';

export default class FontLikeButton extends Component {
  
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick() {
    let { onUpdate } = this.props;    
    onUpdate && onUpdate();
  }
  
  render() {
    return (
      <div>
        <div onClick={ this.handleClick } className="like-button">
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