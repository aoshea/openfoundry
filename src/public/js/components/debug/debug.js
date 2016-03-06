import React, { Component } from 'react';
import appDispatcher from 'app-dispatcher';
import { getAboutText, getFullFontName } from 'util/content_util';

export default class Debug extends Component {

  constructor() {
    super()
    this.state = {
      fonts: []
    }

    this.handleAppEvent = this.handleAppEvent.bind(this);
  }

  handleAppEvent(e) {
    switch (e.actionType) {
      case 'font-data-updated':
        this.setState({
          fonts: e.data
        });
        break;
    }
  }

  componentDidMount() {
    this.handleAppEventListener = appDispatcher.register(this.handleAppEvent);
    appDispatcher.dispatch({ actionType: 'fetch-font-data' });
  }

  componentWillUnmount() {
    appDispatcher.unregister(this.handleAppEventListener);
  }

  render() {
    var fonts = this.state.fonts.map(function (font) {
      return <div><h3>{ getFullFontName(font) }</h3>{ getAboutText(font) }</div>
    })
    return <div className="debug-component">{fonts}</div>
  }
}
