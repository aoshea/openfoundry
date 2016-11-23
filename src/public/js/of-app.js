import React, { Component } from 'react';
import Nav from 'containers/ui/nav';

class OFApp extends Component {
  render() {

    const { params } = this.props
    const { fontId } = params

    return (
      <div className="is-loaded">
        <Nav fontId={fontId} />
        <div className="of-main">{this.props.children}</div>
      </div>
    )
  }
}

export default OFApp;