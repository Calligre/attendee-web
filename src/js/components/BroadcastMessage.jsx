import React from "react";

export default class BroadcastMessage extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    const { text } = this.props;

    return (
      <div id="Broadcast">
        <p>{text}</p>
      </div>
    );
  }
}