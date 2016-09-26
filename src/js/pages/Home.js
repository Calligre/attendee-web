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

  componentDidMount() {
    NotificationStore.getAll();
    EventStore.getAll();
  };

  componentWillMount() {
    NotificationStore.on("received", this.getNotifications);
    NotificationStore.on("error", this.showNotificationStoreError);
    EventStore.on("received", this.getEvents);
    EventStore.on("error", this.showEventStoreError);
  };

  componentWillUnmount() {
    NotificationStore.removeListener("received", this.getNotifications);
    NotificationStore.removeListener("error", this.showNotificationStoreError);
    EventStore.removeListener("received", this.getEvents);
    EventStore.removeListener("error", this.showEventStoreError);
  };

  removeNotification (id) {
    this.setState({
      notifications: this.state.notifications.filter(n => n.key !== id)
    })
  };

  getNotifications() {
    var unexpired = NotificationStore.getUnexpired();
    let temp = [];
    const currTime = moment().unix();
    unexpired.forEach(function(notification) {
      temp.push({
        message: notification.attributes.message,
        key: "notification-" + notification.attributes.id,
        action: 'Dismiss',
        dismissAfter: (notification.attributes.expirytime - currTime) * 1000,
        onClick: () => this.removeNotification("notification-" + notification.attributes.id),
      });
    }.bind(this));

    this.setState({notifications: temp});
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
          onDismiss={notification => this.setState({
            notifications: notifications.filter((n) => n.key !== notification.key)
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


