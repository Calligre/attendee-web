import React from "react";

import EventStore from "stores/EventStore";
import SubscribeButton from "components/SubscribeButton";
import { IndexLink } from "react-router";


var moment = require('moment');

export default class Events extends React.Component {
	constructor(props) {
		super(props);
		this.getEvent = this.getEvent.bind(this);

    this.state = { event: undefined };

    EventStore.get(this.props.params.eventId);
	}

  componentWillMount() {
    EventStore.on("received", this.getEvent);
    EventStore.on("subscription", this.getEvent);
    EventStore.on("error", this.showError);
  }

  componentWillUnmount() {
    EventStore.removeListener("received", this.getEvent);
    EventStore.removeListener("subscription", this.getEvent);
    EventStore.removeListener("error", this.showError);
  }

	getEvent() {
    var id = this.props.params.eventId;
    var event = EventStore.events.filter((event) => {
      return event.id == id;
    })[0]
    this.setState({
      event: event
    })
	}


  showError(){
    console.log(EventStore.error)
  }

  render() {
    if(typeof this.state.event == "undefined") {
      return (<div></div>);
    }

    const { event } = this.state;
    const { id, name, description, stream, streamColor, isSubscribed, location, starttime, endtime } = event;


    var streamStyle = {
      borderColor: streamColor
    };

    /*<IndexLink to={{ pathname: 'events?stream=' + stream }}>
      <div class="stream" style={streamStyle}></div>
    </IndexLink>*/

    return (
        <div id={"event-" + id} class="event-item">
          <div className="nameContainer" style={streamStyle}>
            <div class="header">
              <div class="dates">
                <h4 class="date">{moment.unix(starttime).format("h:mm a")}</h4>
                <h4 class="date">{moment.unix(endtime).format("h:mm a")}</h4>
              </div>
              <h1 className="primaryText">{name}</h1>
            </div>
            <SubscribeButton className="isSubscribed" id={this.state.event.id} subscribed={isSubscribed}/>
          </div>
          <div class="info">
            <div id="avoidSubscribeButton"></div>
            <h2 className="secondaryText location">{location}</h2>
            <div class="description">{description}</div>
          </div>                
        </div>                
    );
  }
}
