import React, { Component } from 'react';
import FontPreviewContainer from '../../components/font-preview-container/font-preview-container.js';
import FontSpecimen from '../../components/font-specimen/font-specimen.js';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';

export default class FontList extends Component {

  constructor() {
    super();
    this.state = {
      exampleTop: 0
    };
  }

  componentDidUpdate() {
    console.log('font-list componentDidUpdate');

    if (this.props.fixed) {
      document.body.classList.add('noscroll');
    } else {
      document.body.classList.remove('noscroll');
    }
  }

  render() {

    let fonts = this.props.fonts.map((font, i) => {
      return (
        <FontPreviewContainer
        rank={ i + 1 }
          key={i}
          font={font} />
      )
    });

    let fontListClassNames = classNames({
      'of-font-list': true,
      'is-fixed': this.props.fixed
    });

    return (
      <div ref="list" className={fontListClassNames}>
        {fonts}
        { this.state.specimen ? <FontSpecimen /> : null }
      </div>
    )
  }
}