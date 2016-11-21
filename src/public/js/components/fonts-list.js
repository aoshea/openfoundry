import React, { PropTypes, Component } from 'react'

class FontsList extends Component {

  propTypes: {
    fonts: PropTypes.array
  }

  render() {
    const { fonts } = this.props;
    console.log('fonts', fonts.first().get('font-id'))

    return (
      <div>
        {fonts.map(font =>
          <div key={font.get('font-id')}>
            {font.get('font-name')}
          </div>
        )}
      </div>
    )
  }
}

export default FontsList