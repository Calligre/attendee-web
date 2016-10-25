import React from "react";
var $ = require('jquery');
var _ = require('lodash');

import BroadcastMessage from "../components/BroadcastMessage";
import Events from "../components/Events";

import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';
var moment = require('moment');

export default class Featured extends React.Component {
  constructor(props) {
    super(props);
    this.getEvents = this.getEvents.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
    this.state = {
      notifications: [],
      events: [],
      apiBaseURL: props.route.apiBaseURL,
    };
  };
  
  addNotification (message) {
    const currTime = moment().unix();
    if (currTime > message.expirytime) {
      return;
    }
    var self = this;
    return this.setState({
      messageStack: this.state.messageStack.add({
        message: message.message,
        key: message.id,
        dismissAfter: (message.expirytime - currTime) * 1000
      })
    });
  }

  removeNotification (count) {
    this.setState({
      messageStack: this.state.messageStack.filter(n => n.key !== count)
    })
  }


  componentDidMount() {
    var self = this;
    this.broadcastRequest = $.get(this.state.apiBaseURL + "/broadcast", function (result) {
      this.setState({
        messages: result.data.map(function(message) {
          return message.attributes;
        })
      });

      this.messageStack = new OrderedSet();
      this.state.messages.forEach(function(m) {
        self.addNotification(m);
      });
    }.bind(this));

    var event_ids = [];
    var evnts = [];
    this.eventRequest = $.get(this.state.apiBaseURL + "/user/1/subscription", function (result) {
      for (var i in result.data) {
        event_ids.push({'id': result.data[i].attributes.event_id});
      }

      this.eventsRequest = $.get(this.state.apiBaseURL + "/event", function (result) {
        evnts = _.intersectionBy(result.data, event_ids, 'id');
        self.setState({
          events: evnts,
        });
      });

    }.bind(this));
  }

  componentWillUnmount() {
    this.broadcastRequest.abort();
    this.eventRequest.abort();
  }

  render() {
    const { messages, events, notifications } = this.state;

    const EventComponents = events.map((events) => {
      return <Events key={events.id} name={events.attributes.name} description={events.attributes.description} starttime={events.attributes.starttime} endtime={events.attributes.endtime} location={events.attributes.location} streamColor={events.attributes.streamColor} {...events}/>;
    });
    return (
      <div>
        <NotificationStack
          notifications={this.state.messageStack.toArray()}
          onDismiss={notification => this.setState({
            notifications: this.state.messageStack.delete(notification)
          })}
        />
        <h2>Your Upcoming Events</h2>
        <div>
          {EventComponents}
        </div>
      </div>
    );
  };
}
