import React from "react";
import EventStore from "stores/EventStore";
import StarEmpty from 'react-icons/lib/md/star-border';
import StarFilled from 'react-icons/lib/md/star';

export default class SubscribeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: props.id, subscribed: props.subscribed};
    this.starFilled = React.createElement(StarFilled, null);
    this.starEmpty = React.createElement(StarEmpty, null);
  }

  toggleSubscribed = () => {
    if(this.state.subscribed){
      EventStore.unsubscribeToEvent(this.state.id);
      this.setState({subscribed: false});
    } else {
      EventStore.subscribeToEvent(this.state.id);
      this.setState({subscribed: true});
    }
  }

  render() {
    return (
      <div className="subscribeButton" onClick={this.toggleSubscribed}>
        { this.state.subscribed ? this.starFilled : this.starEmpty }
      </div>
    );
  }
}
