import React from "react";

import { IndexLink } from "react-router";
import EventStore from "stores/EventStore";
import SubscribeButton from "components/SubscribeButton";

var moment = require('moment');

export default class Event extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { id, name, description, stream, streamColor, isSubscribed, location, starttime, endtime } = this.props;

    var streamStyle = {
      borderColor: streamColor
    };

    var dateFormat = "MM-DD h:mm a";

    return (
      <div className="eventPageEvent">
        <IndexLink to={{ pathname: 'events/' + this.props.id }}>
          <div id={"event-" + id} className="event">
            <div className="time">
              <p className="start">{moment.unix(starttime).format("hh:mma")}</p>
              <p className="end">{moment.unix(endtime).format("hh:mma")}</p>
            </div>
            <div className="details" style={streamStyle}>
              <h4 className="title">{name}</h4>
              <p className="location">{location}</p>
            </div>
          </div>
        </IndexLink>
        <SubscribeButton id={this.props.id} subscribed={this.props.isSubscribed}/>
      </div>
    );
  }
}
