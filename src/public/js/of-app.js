import React, { Component } from 'react';

class OFApp extends Component {
  render() {
    const appMessage = 'app message';
    return (
      <div>
        {appMessage}
        {this.props.children}
      </div>
    )
  }
}

export default OFApp;