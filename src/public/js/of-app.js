import React, { Component } from 'react';
import Nav from 'containers/ui/nav';

class OFApp extends Component {
  render() {
    return (
      <div className="is-loaded">
        <Nav />
        <div className="of-main">{this.props.children}</div>
      </div>
    )
  }
}

export default OFApp;