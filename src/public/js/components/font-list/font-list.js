import React, { Component } from 'react';
import FontPreviewContainer from '../../components/font-preview-container/font-preview-container.js';
import FontSpecimen from '../../components/font-specimen/font-specimen.js';
import classNames from 'classnames';

export default class FontList extends Component {

  constructor() {
    super()

    this.state = {
      specimen: false
    };
  }

  componentDidMount() {
    this.setState({
      specimen: false
    });
  }

  render() {

    let fonts = this.props.fonts.map((font, i) => {
      console.log(font['font-name'], i);
      return (
        <FontPreviewContainer
          rank={i+1}
          key={i}
          font={font} />
      )
    });

    let fontListClassNames = classNames({
      'of-font-list': true,
      'is-fixed': this.props.fixed,
    });

    return (
      <div className={fontListClassNames}>
        {fonts}
        { this.state.specimen ? <FontSpecimen /> : null }
      </div>
    )
  }
}