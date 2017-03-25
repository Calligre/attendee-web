import { EventEmitter } from 'events';
import AjaxService from 'util/AjaxService';

import dispatcher from 'dispatcher';

class BrandStore extends EventEmitter {
  constructor() {
    super();
    this.branding = {};
    this.contacts = [];
    this.locations = [];
    this.cards = [];
    this.sponsors = [];
    this.error = null;
  }

  getAll = () => {
    this.getBranding();
    this.getCards();
    this.getLocations();
    this.getContacts();
    this.getSponsors();
  }

  getBranding = () => {
    AjaxService.get({
      endpoint: 'info',
      success(response) {
        dispatcher.dispatch({ type: 'BRANDING_GET', branding: response.data.attributes });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
  }

  getCards = () => {
    AjaxService.get({
      endpoint: 'info/card',
      success(response) {
        dispatcher.dispatch({ type: 'CARD_GET', cards: response.data });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
  }

  updateCard = (card) => {
    AjaxService.update({
      endpoint: 'info/card',
      data: card,
      success() {
        dispatcher.dispatch({ type: 'CARD_UPDATE', card });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });

    return this.cards;
  };

  addCard(card) {
    AjaxService.create({
      endpoint: 'info/card',
      data: card,
      success(response) {
        dispatcher.dispatch({ type: 'CARD_ADD', card, id: response.data.id });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });

    return this.cards;
  }

  deleteCard(id) {
    AjaxService.delete({
      endpoint: 'info/card',
      id,
      success() {
        dispatcher.dispatch({ type: 'CARD_DELETE', id });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });

    return this.cards;
  }


  getContacts() {
    AjaxService.get({
      endpoint: 'info/contact',
      success(response) {
        dispatcher.dispatch({ type: 'CONTACT_GET', contacts: response.data });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
  }

  updateContact(contact) {
    AjaxService.update({
      endpoint: 'info/contact',
      data: contact,
      success() {
        dispatcher.dispatch({ type: 'CONTACT_UPDATE', contact });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
    return this.events;
  }

  addContact(contact) {
    AjaxService.create({
      endpoint: 'info/contact',
      data: contact,
      success(response) {
        dispatcher.dispatch({ type: 'CONTACT_ADD', contact, id: response.data.id });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
    return this.contacts;
  }

  deleteContact(id) {
    AjaxService.delete({
      endpoint: 'info/contact',
      id,
      success() {
        dispatcher.dispatch({ type: 'CONTACT_DELETE', id });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
    return this.contacts;
  }

  getLocations() {
    AjaxService.get({
      endpoint: 'info/location',
      success(response) {
        dispatcher.dispatch({ type: 'LOCATION_GET', locations: response.data });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
  }

  updateLocation(location) {
    AjaxService.update({
      endpoint: 'info/location',
      data: location,
      success() {
        dispatcher.dispatch({ type: 'LOCATION_UPDATE', location });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
    return this.events;
  }

  addLocation(location) {
    AjaxService.create({
      endpoint: 'info/location',
      data: location,
      success(response) {
        dispatcher.dispatch({ type: 'LOCATION_ADD', location, id: response.data.id });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
    return this.locations;
  }

  deleteLocation(id){
    AjaxService.delete({
      endpoint: 'info/location',
      id,
      success() {
        dispatcher.dispatch({ type: 'LOCATION_DELETE', id });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
    return this.locations;
  }

  getSponsors() {
    AjaxService.get({
      endpoint: 'info/sponsor',
      success(response) {
        dispatcher.dispatch({ type: 'SPONSOR_GET', sponsors: response.data });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
  }

  updateSponsor(sponsor) {
    AjaxService.update({
      endpoint: 'info/sponsor',
      data: sponsor,
      success() {
        dispatcher.dispatch({ type: 'SPONSOR_UPDATE', sponsor });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
    return this.events;
  }

  addSponsor(sponsor) {
    AjaxService.create({
      endpoint: 'info/sponsor',
      data: sponsor,
      success(response) {
        dispatcher.dispatch({ type: 'SPONSOR_ADD', sponsor, id: response.data.id });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
    return this.sponsors;
  }

  deleteSponsor(id) {
    AjaxService.delete({
      endpoint: 'info/sponsor',
      id,
      success() {
        dispatcher.dispatch({ type: 'SPONSOR_DELETE', id });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
    return this.sponsors;
  }

  saveBranding(data) {
    AjaxService.update({
      endpoint: 'info',
      data,
      success() {
        dispatcher.dispatch({ type: 'BRANDING_SAVED' });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
  }

  handleActions(action) {
    switch (action.type) {
      case 'BRANDING_GET': {
        this.branding = action.branding;
        this.emit('receivedBranding');
        break;
      }
      case 'LOCATION_GET': {
        this.locations = action.locations.map((location) => {
          return location.attributes;
        });
        this.emit('receivedLocations');
        break;
      }
      case 'LOCATION_UPDATE': {
        var entry = this.locations.find(c => c.id === action.location.id);
        Object.assign(entry, action.location);
        this.emit('updateLocations');
        break;
      }
      case 'LOCATION_ADD': {
        action.location.id = action.id;
        this.locations.push(action.location)
        this.emit('addLocations');
        break;
      }
      case 'LOCATION_DELETE': {
        let index = this.locations.findIndex(c => c.id === action.id);
        if (index > -1) {
          this.locations.splice(index, 1);
        }
        this.emit('deleteLocations');
        break;
      }
      case 'CONTACT_GET': {
        this.contacts = action.contacts.map((contact) => {
          return contact.attributes;
        });
        this.emit('receivedContacts');
        break;
      }
      case 'CONTACT_UPDATE': {
        var entry = this.contacts.find(c => c.id === action.contact.id);
        Object.assign(entry, action.contact);
        this.emit('updateContacts');
        break;
      }
      case 'CONTACT_ADD': {
        action.contact.id = action.id;
        this.contacts.push(action.contact)
        this.emit('addContacts');
        break;
      }
      case 'CONTACT_DELETE': {
        let index = this.contacts.findIndex(c => c.id === action.id);
        if (index > -1) {
          this.contacts.splice(index, 1);
        }
        this.emit('deleteContacts');
        break;
      }
      case 'CARD_GET': {
        this.cards = action.cards.map((card) => {
          return card.attributes;
        });
        this.emit('receivedCards');
        break;
      }
      case 'CARD_UPDATE': {
        var entry = this.cards.find(c => c.id === action.card.id);
        Object.assign(entry, action.card);
        this.emit('updateCards');
        break;
      }
      case 'CARD_ADD': {
        action.card.id = action.id;
        this.cards.push(action.card)
        this.emit('addCards');
        break;
      }
      case 'CARD_DELETE': {
        let index = this.cards.findIndex(c => c.id === action.id);
        if (index > -1) {
          this.cards.splice(index, 1);
        }
        this.emit('deleteCards');
        break;
      }
      case 'SPONSOR_GET': {
        this.sponsors = action.sponsors.map((sponsor) => {
          return sponsor.attributes;
        });
        this.emit('receivedSponsors');
        break;
      }
      case 'SPONSOR_UPDATE': {
        var entry = this.sponsors.find(c => c.id === action.sponsor.id);
        Object.assign(entry, action.sponsor);
        this.emit('updateSponsors');
        break;
      }
      case 'SPONSOR_ADD': {
        action.sponsor.id = action.id;
        this.sponsors.push(action.sponsor)
        this.emit('addSponsors');
        break;
      }
      case 'SPONSOR_DELETE': {
        let index = this.sponsors.findIndex(c => c.id === action.id);
        if (index > -1) {
          this.sponsors.splice(index, 1);
        }
        this.emit('deleteSponsors');
        break;
      }
      case 'BRANDING_SAVED': {
        this.emit('savedBranding');
        break;
      }
      case 'BRAND_ERROR': {
        this.error = action.error;
        console.log(`${action.error.status}: ${action.error.statusText}`);
        this.emit('error');
        break;
      }
    }
  }
}

const brandStore = new BrandStore();
dispatcher.register(brandStore.handleActions.bind(brandStore));

export default brandStore;
