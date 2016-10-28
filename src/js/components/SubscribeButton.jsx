import React from "react";
import EventStore from "stores/EventStore";
import StarEmpty from 'react-icons/lib/md/star-border';
import StarFilled from 'react-icons/lib/md/star';

export default class SubscribeButton extends React.Component {
  constructor(props) {
    super(props);
    this.toggleSubscribed = this.toggleSubscribed.bind(this);
    this.mouseOver = this.mouseOver.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
    this.state = { id: props.id, hover: false, subscribed: props.subscribed};
    this.starFilled = React.createElement(StarFilled, null);
    this.starEmpty = React.createElement(StarEmpty, null);
  }

  mouseOver() {
    this.setState({hover: true});
  }

  mouseOut() {
    this.setState({hover: false});
  }

  toggleSubscribed() {
    if(this.state.subscribed){
      EventStore.unsubscribeToEvent(this.state.id);
      this.setState({subscribed: false});
    } else {
      EventStore.subscribeToEvent(this.state.id);
      this.setState({subscribed: true});
    }
  }

  render() {
    var icon = this.starEmpty;
    if (this.state.hover || this.state.subscribed) {
      icon = this.starFilled;
    }

    return (
      <div className="subscribeButton" onMouseOver={this.mouseOver} onMouseOut={this.mouseOut} onClick={this.toggleSubscribed}>
        {icon}
      </div>
    );
  }
}
