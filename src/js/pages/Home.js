import React from "react";
var $ = require('jquery');
var _ = require('lodash');

import BroadcastMessage from "../components/BroadcastMessage";
import EventStore from "../stores/EventStore";
import NotificationStore from "../stores/NotificationStore";
import Card from "../components/Card";

import { NotificationStack } from 'react-notification';
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

  componentWillMount() {
    NotificationStore.on("received", this.getNotifications);
    NotificationStore.on("error", this.showNotificationStoreError);
    EventStore.on("received", this.getEvents);
    EventStore.on("error", this.showEventStoreError);
    NotificationStore.getAll();
    EventStore.getAll();
  };

  componentWillUnmount() {
    NotificationStore.removeListener("received", this.getNotifications);
    NotificationStore.removeListener("error", this.showNotificationStoreError);
    EventStore.removeListener("received", this.getEvents);
    EventStore.removeListener("error", this.showEventStoreError);
  };

  getNotifications() {
    let unexpired = NotificationStore.getUnexpired();
    this.setState({notifications: unexpired});
  };

  showNotificationStoreError() {
    console.log(NotificationStore.error);
  };

  getEvents() {
    this.setState({
      events: EventStore.events.filter(event => event.isSubscribed)
    });
  };

  showEventStoreError(){
    console.log(EventStore.error)
  }

  render() {
    const { messages, events, notifications } = this.state;

    const EventComponents = events.map((event) => {
      return <Card type="event" key={"event-" + event.id} item={event}/>;
    });
    return (
      <div>
        <NotificationStack
          notifications={notifications}
          onDismiss={() => {}}
        />
        <h2>Your Upcoming Events</h2>
        <div>
          {EventComponents}
        </div>
      </div>
    );
  };
}