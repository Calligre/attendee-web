import React from "react";
var $ = require('jquery');
var _ = require('lodash');

import BroadcastMessage from "components/BroadcastMessage";
import EventStore from "stores/EventStore";
import NotificationStore from "stores/NotificationStore";
import BrandStore from 'stores/BrandStore';
import Card from "components/Card";

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
      logo: '',
    };

    BrandStore.on('receivedBranding', this.setBranding);
    BrandStore.getBranding();
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
      events: EventStore.events.filter(event => event.isSubscribed && moment().isBefore(moment(event.starttime)))
    });
  };

  showEventStoreError(){
    console.log(EventStore.error)
  }
  
  setBranding = () => {
    let branding = BrandStore.branding;
    branding['starttime'] = moment.unix(branding['starttime']).format('YYYY-MM-DD[T]HH:mm');
    branding['endtime'] = moment.unix(branding['endtime']).format('YYYY-MM-DD[T]HH:mm');
    this.setState(branding);
  }

  render() {
    if (localStorage.getItem('redirect_after_login')) {
      return (<div></div>)
    }
    const { messages, events, notifications, logo} = this.state;

    var eventCount = 0;
    const EventComponents = events.map((event) => {
      if (moment().diff(moment(event.starttime), "hours") < 2 || eventCount < 3) {
        eventCount++;
        return <Card type="event" key={"event-" + event.id} item={event}/>;
      }
    });

    const locations = [
      {
        "name": "Conference",
        "address": "Davis Center (DC)",
      },
      {
        "name": "Hotel",
        "address": "Waterloo Inn - 999 King St.",
      },
    ];

    const contacts = [ 
      {
        "name": "Clarisse Schneider",
        "phone": "519-729-1893",
      },
      {
        "name": "Kieran Broekhoven",
        "phone": "519-572-1785",
      },
      {
        "name": "Police",
        "phone": "911",
      }
    ];

    const downloads = [
      {
        "name": "Map",
        "description": "Map of the UWaterloo Campus",
        "link": "https://uwaterloo.ca/map/pdf/map_bw.pdf",
      },
      {
        "name": "Conference Package",
        "link": "https://uwaterloo.ca/map/pdf/map_bw.pdf",
      },
    ];

    const downloadCards = downloads.map((download) =>
      <Card type="download" item={download}/>
    );

    return (
      <div>
        <NotificationStack
          notifications={notifications}
          onDismiss={() => {}}
        />
        <img className="logo" alt="Logo" src={logo} />
        <h2 className="secondaryText">Your Upcoming Events</h2>
        <div>
          {EventComponents}
        </div>
        <h2 className="secondaryText">Conference Information</h2>
        <div>
         <Card type="location" item={locations}/>
         <Card type="contact" item={contacts}/>
         <Card type="content" item="I hope you're having a great day!"/>
         {downloadCards}
        </div>
      </div>
    );
  };
}
