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
    this.state = {
      notifications: [],
      events: [],
      apiBaseURL: props.route.apiBaseURL,
      logo: '',
      cards: [],
      locations: [],
      contacts: [],
    };

    BrandStore.on('receivedBranding', this.setBranding);
    BrandStore.on('receivedCards', this.setCards);
    BrandStore.on('receivedLocations', this.setLocations);
    BrandStore.on('receivedContacts', this.setContacts);
    BrandStore.getBranding();
    BrandStore.getLocations();
    BrandStore.getContacts();
    BrandStore.getCards();
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

  getNotifications = () => {
    let validNotifications = NotificationStore.getValid();
    this.setState({notifications: validNotifications});
  };

  showNotificationStoreError = () => {
    console.log(NotificationStore.error);
  };

  getEvents = () => {
    this.setState({
      events: EventStore.events.filter(event => event.isSubscribed && moment().isBefore(moment(event.starttime)))
    });
  };

  showEventStoreError = () => {
    console.log(EventStore.error)
  }
  
  setBranding = () => {
    let branding = BrandStore.branding;
    branding['starttime'] = moment.unix(branding['starttime']).format('YYYY-MM-DD[T]HH:mm');
    branding['endtime'] = moment.unix(branding['endtime']).format('YYYY-MM-DD[T]HH:mm');
    this.setState({
      branding: branding,
      logo: branding.logo,
    });
  }
  
  setCards = () => {
    this.setState({cards: BrandStore.cards});
  }
  
  setContacts = () => {
    this.setState({contacts: BrandStore.contacts});
  }

  setLocations = () => {
    this.setState({locations: BrandStore.locations});
  }

  render() {
    if (localStorage.getItem('redirect_after_login')) {
      return (<div></div>)
    }
    const { messages, events, notifications, logo, branding, locations, cards, contacts} = this.state;

    var eventCount = 0;
    const EventComponents = events.map((event) => {
      if (moment().diff(moment(event.starttime), "hours") < 2 || eventCount < 3) {
        eventCount++;
        return <Card type="event" key={"event-" + event.id} item={event}/>;
      }
    });

    let mapCard = null;
    let confPackageCard = null;
    if (branding) {
      const map = {
        "name" : "Map",
        "link" : branding.map,
      };
      const confPackage = {
        "name" : "Conference Package",
        "link" : branding.package,
      };

      mapCard = <Card type="download" item={map}/>;
      confPackageCard = <Card type="download" item={confPackage}/>;
    }

    let contentCards = null;
    if (cards !== undefined && cards.length > 0) {
      contentCards = cards.map((content) =>
        <Card type="content" item={content}/>
      );
    }

    let locationsCard = null;
    if (locations !== undefined && locations.length > 0) {
      locationsCard = <Card type="location" item={locations}/>;
    }

    let contactsCard = null;
    if (contacts !== undefined && contacts.length > 0) {
      contactsCard = <Card type="contact" item={contacts}/>;
    }

    return (
      <div>
        <NotificationStack
          notifications={notifications}
          onDismiss={() => {}}
        />
        <img className="logo" alt="Logo" src={logo} />
        {EventComponents.length > 0 &&
          <h2 className="secondaryText">Your Upcoming Events</h2>
        }
        <div>
          {EventComponents}
        </div>
        {locationsCard != null && contactsCard != null && mapCard != null && confPackageCard != null && contentCards != null &&
          <h2 className="secondaryText">Conference Information</h2>
        }
        <div>
          {locationsCard}
          {contactsCard}
          {mapCard}
          {confPackageCard}
          {contentCards}
        </div>
      </div>
    );
  };
}
