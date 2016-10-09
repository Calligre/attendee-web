var $ = require('jquery');

import React from "react";

import Event  from "../components/Event";

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {type: props.type};
    this.handleDismiss = this.handleDismiss.bind(this);
  };

  handleDismiss() {
    this.setState({
      type: ""
    });
  };

  render() {
    var renderedContent = "";

    const {key, item} = this.props;
    const {type} = this.state;

    switch (type) {
      case "event":
        renderedContent = <Event key={item.id} {...item}/>;
        break;
      default:
        return null;
    }

    return (
      <div class="card">
        <span class='dismiss' onClick={this.handleDismiss}>x</span>
        {renderedContent}
      </div>
    );
  };
}
