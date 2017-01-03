import React, { Component, PropTypes } from 'react'

class BackgroundImage extends Component {

  constructor(props) {
    super(props)

    this.onLoad = this.onLoad.bind(this)
    this.onError = this.onError.bind(this)
    this.getClassNameFromState = this.getClassNameFromState.bind(this)

    this.state = {
      isLoaded: false,
      isError: false
    }
  }

  componentDidMount() {
    const { src } = this.props

    this.imageEl = new Image()
    this.imageEl.src = src
    if (this.imageEl.complete) {
      return this.onLoad()
    }

    this.imageEl.onload = this.onLoad
    this.imageEl.onerror = this.onError
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.src !== this.props.src) return true
    if (nextState.isLoaded !== this.state.isLoaded) return true
    if (nextState.isError !== this.state.isError) return true
    return false
  }

  componentWillUnmount() {
    this.imageEl.onload = this.imageEl.onerror = null
    this.imageEl = null
  }

  onLoad() {
    this.setState({ isLoaded: true })
  }

  onError() {
    this.setState({ isError: true })
  }

  camelCaseDash(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }

  getClassNameFromState(stateKey) {
    return this.state[stateKey] ? this.camelCaseDash(stateKey) : ''
  }

  render() {
    const { src, className, ...props } = this.props

    const divStyle = {
      backgroundImage: `url(${src})`
    }

    const propClassNames = className ? className.split(' ') : []
    const combinedClassNames = propClassNames.concat(
      Object.keys(this.state).map(this.getClassNameFromState)
    ).join(' ')

    return (
      <div className={combinedClassNames} style={divStyle} {...props}>
        {this.props.children}
      </div>
    )
  }
}

BackgroundImage.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string
}

export default BackgroundImage
