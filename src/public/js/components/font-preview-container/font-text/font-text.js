import { Component } from 'react';

export default class FontText extends Component {

  render() {
    const props = this.props;

    return <div className={props.fontClasses} style={props.fontStyle} ref={function (e) {if (e != null) e.contentEditable = true;}}>{props.content}</div>;
  }
}