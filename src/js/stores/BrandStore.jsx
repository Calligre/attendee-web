import { EventEmitter } from 'events';
import AuthService from 'util/AuthService';
import UrlService from 'util/UrlService';

import dispatcher from 'dispatcher';

const $ = require('jquery');

const url = UrlService.getUrl();

class BrandStore extends EventEmitter {
  constructor() {
    super();
    this.branding = {};
    this.contacts = [];
    this.locations = [];
    this.cards = [];
    this.error = null;
  }


  getBranding() {
    $.ajax({
      url: `${url}/info`,
      dataType: 'json',
      type: 'GET',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },

      cache: false,
      success(response) {
        dispatcher.dispatch({ type: 'BRANDING_GET', branding: response.data.attributes });
      },
      error(error) {
        console.log(`${error.status}: ${error.statusText}`);
      },
    });
  }

  getCards() {
    $.ajax({
      url: `${url}/info/card`,
      dataType: 'json',
      type: 'GET',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },

      cache: false,
      success(response) {
        dispatcher.dispatch({ type: 'CARD_GET', cards: response.data });
      },
      error(error) {
        console.log(`${error.status}: ${error.statusText}`);
      },
    });
  }

  getContacts() {
    $.ajax({
      url: `${url}/info/contact`,
      dataType: 'json',
      type: 'GET',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },

      cache: false,
      success(response) {
        dispatcher.dispatch({ type: 'CONTACT_GET', contacts: response.data });
      },
      error(error) {
        console.log(`${error.status}: ${error.statusText}`);
      },
    });
  }

  getLocations() {
    $.ajax({
      url: `${url}/info/location`,
      dataType: 'json',
      type: 'GET',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },

      cache: false,
      success(response) {
        dispatcher.dispatch({ type: 'LOCATION_GET', locations: response.data });
      },
      error(error) {
        console.log(`${error.status}: ${error.statusText}`);
      },
    });
  }

  saveBranding(data) {
    $.ajax({
      url: `${url}/info`,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      type: 'PATCH',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      cache: false,
      success() {
        dispatcher.dispatch({ type: 'BRANDING_SAVED' });
      },
      error(error) {
        console.log(`${error.status}: ${error.statusText}`);
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
      case 'CONTACT_GET': {
        this.contacts = action.contacts.map((contact) => {
          return contact.attributes;
        });
        this.emit('receivedContacts');
        break;
      }
      case 'CARD_GET': {
        this.cards = action.cards.map((card) => {
          return card.attributes.data;
        });
        this.emit('receivedCards');
        break;
      }
      case 'BRANDING_SAVED': {
        this.emit('savedBranding');
        break;
      }
      case 'ERROR': {
        this.error = action.error;
        this.emit('error');
        break;
      }
    }
  }
}

const brandStore = new BrandStore();
dispatcher.register(brandStore.handleActions.bind(brandStore));

export default brandStore;
