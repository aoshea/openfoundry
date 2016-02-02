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

    const props = this.props;

    let fonts = props.fonts.map((font, i) => {
      return (
        <FontPreviewContainer
          fixed={props.fixed}
          rank={ i + 1 }
          key={i}
          font={font} />
      )
    });

    const fontListClassNames = classNames({
      'of-font-list': true,
      'is-fixed': props.fixed
    });

    return (
      <div ref="list" className={fontListClassNames}>
        {fonts}
        { this.state.specimen ? <FontSpecimen /> : null }
      </div>
    )
  }
}