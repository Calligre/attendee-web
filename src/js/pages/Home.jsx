import React from 'react';

import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';

import Events from '../components/Events';
import BroadcastMessage from '../components/BroadcastMessage';

const $ = require('jquery');
const _ = require('lodash');
const moment = require('moment');

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

    const EventComponents = events.map((events) => {
      return <Events key={events.id} name={events.attributes.name} description={events.attributes.description} starttime={events.attributes.starttime} endtime={events.attributes.endtime} location={events.attributes.location} streamColor={events.attributes.streamColor} {...events} />;
    });
    return (
      <div>
        <NotificationStack
          notifications={this.state.messageStack.toArray()}
          onDismiss={notification => this.setState({
            notifications: this.state.messageStack.delete(notification),
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
