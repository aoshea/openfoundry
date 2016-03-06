import React, { Component } from 'react';
import classNames from 'classnames';
import appDispatcher from 'app-dispatcher';

export default class FontLikeButton extends Component {

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this);
    this.handleFontEvent = this.handleFontEvent.bind(this);
    this.handleAppEvent = this.handleAppEvent.bind(this);

    this.state = {
      likes: 0
    }
  }

  handleClick() {
    let { locked, onUpdate } = this.props;

    console.log('clicked like, locked', locked);

    if (locked) return;

    onUpdate && onUpdate();
  }

  componentDidMount() {
    this.handleAppEventToken = appDispatcher.register(this.handleAppEvent);
  }

  componentWillUnmount() {
    appDispatcher.unregister(this.handleAppEventToken);

    var font = this.props.font;
    if (!font) return;
    font.dispatcher.unregister(this.handleFontModelEventToken);
  }

  handleAppEvent(e) {
    switch (e.actionType) {
      case 'like-data-updated':
      if (!this.isInit) this.init()
        break;
    }
  }

  handleFontEvent(e) {
    switch (e.actionType) {
      case 'likes-updated':
      this.setState({
        likes: e.likesNum
      });
    }
  }

  init() {
    var font = this.props.font;
    if (!font) return;
    this.isInit = true;

    this.state.likes = font.likesNum;
    this.handleFontModelEventToken = font.dispatcher.register(this.handleFontEvent);
  }

  render() {

    if (!this.isInit) {
      this.init()
    }

    let btnClass = classNames({
      'like-button': true,
      'like-button-disabled': this.props.locked
    });

    const { likes } = this.state;

    return (
      <div className="vote-container">
        <div onClick={ this.handleClick } className={btnClass}>
          <svg xmlns="http://www.w3.org/svg/2000" viewBox="0 0 32 32">
            <path d="M21.1,11.4c1.3,1.4,1.3,3.6,0,4.9L16,21.5l-5.1-5.2c-1.3-1.4-1.3-3.6,0-4.9c1.2-1.2,3.1-1.2,4.3,0l0.8,0.8l0.8-0.8
  C18,10.2,19.9,10.2,21.1,11.4"/>
          </svg>
        </div>
        <span className="num-likes">{likes}</span>
      </div>
    )
  }
}
