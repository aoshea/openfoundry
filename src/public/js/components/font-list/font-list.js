import React, { Component } from 'react';
import FontPreviewContainer from 'components/font-preview-container/font-preview-container.js';
import FontSpecimen from 'components/font-specimen/font-specimen.js';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import $ from 'jquery';
import { replaceNonAlphaNumeric } from '../../util/util.js';
import PureRenderMixin from 'react-addons-pure-render-mixin';


export default class FontList extends Component {


  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onMoreUpdate = this.onMoreUpdate.bind(this);

    this.state = {
      lastScrollTop: 0
    };
  }

  componentDidUpdate() {

    if (!this.props.fixed) {

      // Set scroll top to last position before we left
      $(window).scrollTop(this.state.lastScrollTop);

    } else {

      // Reset scroll top for the specimen page
      $(window).scrollTop(0);
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
    const isFixed = props.fixed;
    const { lastScrollTop } = this.state;

    var fonts = this.props.fonts || [];

    const renderFonts = this.renderFonts || this.props.fonts.map((font, i) => {
      return (
        <FontPreviewContainer
          rank={ i + 1 }
          key={font.__key}
          isList='true'
          onMoreUpdate={this.onMoreUpdate}
          font={font} />
      )
    });

    if (this.props.fonts.length) {
      this.renderFonts = renderFonts
    }

    const fontListClassNames = classNames({
      'of-font-list-container': true,
      'of-font-list--fixed': isFixed
    });

    // Offset by `.of-main` top offset
    const fontListStyle = {
      // 50px being the height of the nav bar
      transform: isFixed ? 'translateY(' + (50 + (lastScrollTop * -1)) + 'px)' : 'none',
    };

    return (
      <div className={fontListClassNames}>
      <div style={fontListStyle} ref="list" className='of-font-list'>
        {renderFonts}
        { this.state.specimen ? <FontSpecimen /> : null }
      </div>
      </div>
    )
  }
}
