import React, { Component } from 'react'
import $ from 'jquery'
import classNames from 'classnames'
import appDispatcher from 'app-dispatcher'
import { getFontId } from 'util/content_util.js'

export default class FontLikeButton extends Component {

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
    this.handleFontEvent = this.handleFontEvent.bind(this)
    this.handleAppEvent = this.handleAppEvent.bind(this)

    this.state = {
      likes: 0
    }
  }

  handleClick() {
    let { font } = this.props

    if (font.locked) return

    this.onUpdateLikes()
  }

  componentDidMount() {
    this.handleAppEventToken = appDispatcher.register(this.handleAppEvent)
  }

  componentWillUnmount() {
    appDispatcher.unregister(this.handleAppEventToken)

    var { font } = this.props
    if (!font) return
    // font.dispatcher.unregister(this.handleFontModelEventToken)
  }

  handleAppEvent(e) {
    switch (e.actionType) {
      case 'like-data-updated':
        if (!this.isInit) this.init()
        break
    }
  }

  handleFontEvent(e) {
    switch (e.actionType) {
      case 'likes-updated':
        this.setState({
          likes: parseInt(e.likesNum, 10),
          locked: true
        })
    }
  }

  init() {
    var font = this.props.font
    if (!font) return
    this.isInit = true
    this.state.likes = font.likesNum
    this.state.locked = font.locked
    // this.handleFontModelEventToken = font.dispatcher.register(this.handleFontEvent)
  }

  onUpdateLikes(value) {

    const { font } = this.props

    if (font.locked) {
      return
    }

    value = font.likesNum = value || font.likesNum + 1

    $.get('api/like/' + getFontId(font), function (e) {
      // done
      // TODO: Handle error too
    })

    font.locked = true

    font.dispatcher.dispatch({
      actionType: 'likes-updated',
      likesNum: value
    })

    // lets be optimistic
    this.setState({
      likes: parseInt(value, 10),
      locked: true
    })

  }

  render() {

    if (!this.isInit) {
      this.init()
    }

    let btnClass = classNames({
      'like-button': true,
      'like-button-disabled': this.state.locked
    })

    const { likes } = this.state

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
