import React, { Component } from 'react';
import FontPreviewContainer from 'components/font-preview-container/font-preview-container.js';
import FontSpecimen from 'components/font-specimen/font-specimen.js';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import $ from 'jquery';
import { replaceNonAlphaNumeric } from 'util/util.js';


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
    }
  }

  onMoreUpdate(scrollTop) {
    // remember the scroll position to land at the
    // same offset when coming back from Specimen
    this.setState({
      lastScrollTop: scrollTop
    });
  }

  render() {

    const props = this.props;
    const { lastScrollTop } = this.state;

    const fontList = props.fonts.map((font, i) => {
      font.__key = i;
      // Get likes by font id
      const id = replaceNonAlphaNumeric(font['font-id']);
      let likes = 0;
      props.likes.map(function (x) {
        if (x.fontId === id) {
          likes = x.likes;
          return;
        }
      });

      font.likesNum = likes;
      return font;
    });

    // Sort fonts by likes number in ascending order
    fontList.sort((a, b) => {
      return parseFloat(b.likesNum) - parseFloat(a.likesNum);
    });

    const renderFonts = fontList.map((font, i) => {

      return (
        <FontPreviewContainer
          rank={ i + 1 }
          key={font.__key}
          likes={font.likesNum}
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
        {renderFonts}
        { this.state.specimen ? <FontSpecimen /> : null }
      </div>
    )
  }
}
