import React, { Component } from 'react';
import FontPreviewContainer from '../../components/font-preview-container/font-preview-container.js';
import FontSpecimen from '../../components/font-specimen/font-specimen.js';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import $ from 'jquery';

export default class FontList extends Component {

  constructor() {
    super();

    this.onMoreUpdate = this.onMoreUpdate.bind(this);

    this.state = {
      lastScrollTop: 0
    };
  }

  componentDidUpdate() {
    if (!this.props.fixed) {
      $(window).scrollTop(this.state.lastScrollTop);
    } else {
      // $(window).scrollTop(0);
    }
  }

  onMoreUpdate(scrollTop) {
    this.setState({
      lastScrollTop: scrollTop
    });
  }

  render() {

    const props = this.props;
    const { lastScrollTop } = this.state;

    let fonts = props.fonts.map((font, i) => {
      return (
        <FontPreviewContainer
          rank={ i + 1 }
          key={i}
          onMoreUpdate={this.onMoreUpdate}
          font={font} />
      )
    });

    const fontListClassNames = classNames({
      'of-font-list': true,
      'is-fixed': props.fixed
    });

    // Offset by `.of-main` top offset
    const fontListStyle = {
      top: props.fixed ? (lastScrollTop - 50) * -1 : 0
    };

    return (
      <div style={fontListStyle} ref="list" className={fontListClassNames}>
        {fonts}
        { this.state.specimen ? <FontSpecimen /> : null }
      </div>
    )
  }
}