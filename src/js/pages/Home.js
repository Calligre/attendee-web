import React from "react";
var $ = require('jquery');
var _ = require('lodash');

import BroadcastMessage from "../components/BroadcastMessage";
import EventStore from "../stores/EventStore";
import Card from "../components/Card";

import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';
var moment = require('moment');

var id = 1; //TEMP, TODO: Get the real logged in user's id.

export default class Featured extends React.Component {
  constructor(props) {
    super(props);
    this.getEvents = this.getEvents.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
    this.state = {
      messages: [],
      messageStack: OrderedSet(),
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
  };

  removeNotification (count) {
    this.setState({
      messageStack: this.state.messageStack.filter(n => n.key !== count)
    })
  };

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

    EventStore.getAll();
  };

  componentWillMount() {
    EventStore.on("received", this.getEvents);
    EventStore.on("error", this.showError);
  };

  componentWillUnmount() {
    this.broadcastRequest.abort();
    EventStore.removeListener("error", this.showError);
    EventStore.removeListener("received", this.getEvents);
  };

  getEvents() {
    this.setState({
      events: EventStore.events.filter(event => event.isSubscribed)
    });
  };

  showError(){
    console.log(EventStore.error)
  }

  render() {
    const { messages, events, apiBaseURL } = this.state;

    const EventComponents = events.map((event) => {
      return <Card type="event" key={"event-" + event.id} item={event}/>;
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
