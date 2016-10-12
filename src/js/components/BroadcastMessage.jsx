import React from 'react';

export default class BroadcastMessage extends React.Component {

  render() {
    const { text } = this.props;

    return (
      <div id="Broadcast">
        <p>{text}</p>
      </div>
    );
  }
}

BroadcastMessage.propTypes = {
  text: React.PropTypes.string,
};
