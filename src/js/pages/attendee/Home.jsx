import React from 'react';
const $ = require('jquery');

import BroadcastMessage from 'components/BroadcastMessage';
import EventStore from 'stores/EventStore';
import NotificationStore from 'stores/NotificationStore';
import BrandStore from 'stores/BrandStore';
import Card from 'components/Card';
import PreferenceStore from 'stores/PreferenceStore';
import SurveyStore from 'stores/SurveyStore';

import { NotificationStack } from 'react-notification';
const moment = require('moment');

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
      surveys: [],
      sponsors: [],
      preferences: PreferenceStore.getDefaults(),
    };
  }

  componentWillMount() {
    NotificationStore.on('received', this.getNotifications);
    NotificationStore.on('error', this.showNotificationStoreError);
    NotificationStore.getAll();

    EventStore.on('received', this.getEvents);
    EventStore.on('error', this.showEventStoreError);
    EventStore.getAll();

    PreferenceStore.on('loaded', this.loadPreferences);
    PreferenceStore.on('error', this.showPreferenceError);
    PreferenceStore.loadAll();

    BrandStore.on('receivedBranding', this.setBranding);
    BrandStore.on('receivedCards', this.setCards);
    BrandStore.on('receivedLocations', this.setLocations);
    BrandStore.on('receivedContacts', this.setContacts);
    BrandStore.on('receivedSponsors', this.setSponsors);
    BrandStore.getBranding();
    BrandStore.getLocations();
    BrandStore.getContacts();
    BrandStore.getCards();
    BrandStore.getSponsors();

    SurveyStore.on('loaded', this.getSurveys);
    SurveyStore.on('error', this.showSurveyStoreError);
    SurveyStore.getAll();
  }

  componentWillUnmount() {
    PreferenceStore.removeListener('loaded', this.loadPreferences);
    PreferenceStore.removeListener('error', this.showPreferenceError);
    NotificationStore.removeListener('received', this.getNotifications);
    NotificationStore.removeListener('error', this.showNotificationStoreError);
    EventStore.removeListener('received', this.getEvents);
    EventStore.removeListener('error', this.showEventStoreError);
    BrandStore.removeListener('receivedBranding', this.setBranding);
    BrandStore.removeListener('receivedCards', this.setCards);
    BrandStore.removeListener('receivedLocations', this.setLocations);
    BrandStore.removeListener('receivedContacts', this.setContacts);
    SurveyStore.removeListener('loaded', this.getSurveys);
    SurveyStore.removeListener('error', this.showSurveyStoreError);
  }

  getNotifications = () => {
    const validNotifications = NotificationStore.getValid();
    this.setState({ notifications: validNotifications });
  };

  showNotificationStoreError = () => {
    console.log(NotificationStore.error);
  };

  getEvents = () => {
    this.setState({
      events: EventStore.events.filter(event => event.isSubscribed && moment().isBefore(moment(event.starttime))),
    });
  };

  showEventStoreError = () => {
    console.log(EventStore.error);
  }

  loadPreferences = () => {
    this.setState({ preferences: PreferenceStore.preferences });
  }

  showPreferenceError = () => {
    console.error(PreferenceStore.error);
  }

  setBranding = () => {
    const branding = BrandStore.branding;
    branding.starttime = moment(branding.starttime).format('YYYY-MM-DD[T]HH:mm');
    branding.endtime = moment(branding.endtime).format('YYYY-MM-DD[T]HH:mm');
    this.setState({
      branding,
      logo: branding.logo,
    });
  }

  setCards = () => {
    this.setState({ cards: BrandStore.cards });
  }

  setContacts = () => {
    this.setState({ contacts: BrandStore.contacts });
  }

  setLocations = () => {
    this.setState({ locations: BrandStore.locations });
  }

  getSurveys = () => {
    this.setState({ surveys: SurveyStore.surveys });
  };

  showSurveyStoreError = () => {
    console.log(SurveyStore.error);
  }

  setSponsors = () => {
    const sponsors = Array.from(BrandStore.sponsors);
    sponsors.sort((a, b) => a.rank - b.rank);

    let right = 0;
    const sponsorsSplit = [];
    while (sponsors.length > 0) {
      if (sponsors[0].rank != sponsors[right].rank) {
        sponsorsSplit.push(sponsors.splice(0, right));
        right = 0;
      } else if (right == sponsors.length - 1) {
        sponsorsSplit.push(sponsors);
        break;
      } else {
        right++;
      }
    }
    this.setState({ sponsors: sponsorsSplit });
  }

  render() {
    const { messages, events, notifications, logo, branding, locations, cards, contacts, surveys, sponsors, preferences } = this.state;

    let eventCount = 0;
    let EventComponents = [];
    if (preferences.events) {
      events.sort((a, b) => moment(a.starttime).isBefore(moment(b.starttime)) ? -1 : 1);
      const now = moment();
      EventComponents = events.map((event) => {
        const hourDiff = moment(event.starttime).diff(now, 'hours');
        if ((hourDiff >= -1 && hourDiff <= 2) || eventCount < 3) {
          eventCount++;
          return <Card type="event" key={`event-${event.id}`} item={event} />;
        }
      });
    }

    let mapCard = null;
    let confPackageCard = null;
    let socialCard = null;
    let primaryText = {};
    let secondaryText = {};
    if (branding) {
      primaryText = {
        color: branding.color_primary,
      };
      secondaryText = {
        color: branding.color_secondary,
      };
      const map = {
        name: 'Map',
        link: branding.map,
      };
      const confPackage = {
        name: 'Conference Package',
        link: branding.package,
      };

      if (preferences.map && branding.map) {
        mapCard = <Card type="download" item={map} buttonStyle={secondaryText}/>;
      }
      if (preferences.package && branding.package) {
        confPackageCard = <Card type="download" item={confPackage} buttonStyle={secondaryText}/>;
      }
      if (branding.facebook || branding.twitter) {
        socialCard = <Card type="social" headerStyle={primaryText} facebook={branding.facebook} twitter={branding.twitter} />;
      }
    }

    let contentCards = null;
    if (cards !== undefined && cards.length > 0 && preferences.content) {
        
      contentCards = cards.map(content =>
        <Card type="content" item={content.data} buttonStyle={secondaryText} />,
      );
    }

    let locationsCard = null;
    if (locations !== undefined && locations.length > 0 && preferences.location) {
      locationsCard = <Card type="location" item={locations} buttonStyle={secondaryText} />;
    }

    let contactsCard = null;
    if (contacts !== undefined && contacts.length > 0 && preferences.contact) {
      contactsCard = <Card type="contact" item={contacts} buttonStyle={secondaryText} />;
    }

    let surveyCards = null;
    if (surveys !== undefined && surveys.length > 0 && preferences.survey) {
      surveyCards = surveys.map(survey =>
        <Card type="survey" item={survey} buttonStyle={secondaryText} />,
      );
    }

    let sponsorCards = null;
    if (sponsors !== undefined && sponsors.length > 0) {
      sponsorCards = sponsors.map(sublist =>
        <Card type="sponsor" item={sublist} buttonStyle={secondaryText} />,
      );
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
          {contentCards}
          {locationsCard}
          {contactsCard}
          {mapCard}
          {confPackageCard}
          {surveyCards}
          {sponsorCards}
          {socialCard}
        </div>
      </div>
    );
  }
}
