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
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
  }

  getCards = () => {
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
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
  }

  updateCard(card){
    $.ajax({
      url: "https://dev.calligre.com/api/info/card/" + card.id,
      data : JSON.stringify(card),
      type : 'PATCH',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response){
        dispatcher.dispatch({ type: 'CARD_UPDATE', card });
        console.log(response);
      },
      error: function(error){
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      }
    });

    return this.cards;
  };

  addCard(card){
    $.ajax({
      url: "https://dev.calligre.com/api/info/card",
      data : JSON.stringify(card),
      type : 'POST',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response){
        dispatcher.dispatch({ type: 'CARD_ADD', card, id: response.data.id });
      },
      error: function(error){
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      }
    });

    return this.cards;
  };

  deleteCard(id){
    $.ajax({
      url: "https://dev.calligre.com/api/info/card/" + id,
      type : 'DELETE',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response){
        dispatcher.dispatch({ type: 'CARD_DELETE', id });
      },
      error: function(error){
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      }
    });

    return this.cards;
  };


  getContacts = () => {
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
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
  }

  updateContact(contact){
    $.ajax({
      url: "https://dev.calligre.com/api/info/contact/" + contact.id,
      data : JSON.stringify(contact),
      type : 'PATCH',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response){
        dispatcher.dispatch({ type: 'CONTACT_UPDATE', contacts });
      },
      error: function(error){
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      }
    });
    return this.events;
  };

  addContact(contact){
    $.ajax({
      url: "https://dev.calligre.com/api/info/contact",
      data : JSON.stringify(contact),
      type : 'POST',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response){
        dispatcher.dispatch({ type: 'CONTACT_ADD', contact, id: response.data.id });
      },
      error: function(error){
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      }
    });
    return this.contacts;
  };

  deleteContact(id){
    $.ajax({
      url: "https://dev.calligre.com/api/info/contact/" + id,
      type : 'DELETE',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response){
        dispatcher.dispatch({ type: 'CONTACT_DELETE', id });
      },
      error: function(error){
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      }
    });
    return this.contacts;
  };

  getLocations = () => {
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
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
  }

  updateLocation(location){
    $.ajax({
      url: "https://dev.calligre.com/api/info/location/" + location.id,
      data : JSON.stringify(location),
      type : 'PATCH',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response){
        dispatcher.dispatch({ type: 'LOCATION_UPDATE', location });
      },
      error: function(error){
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      }
    });
    return this.events;
  };

  addLocation(location){
    $.ajax({
      url: "https://dev.calligre.com/api/info/location",
      data : JSON.stringify(location),
      type : 'POST',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response){
        dispatcher.dispatch({ type: 'LOCATION_ADD', location, id: response.data.id });
      },
      error: function(error){
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      }
    });
    return this.locations;
  };

  deleteLocation(id){
    $.ajax({
      url: "https://dev.calligre.com/api/info/location/" + id,
      type : 'DELETE',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response){
        dispatcher.dispatch({ type: 'LOCATION_DELETE', id });
      },
      error: function(error){
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      }
    });
    return this.locations;
  };

  getSponsors = () => {
    $.ajax({
      url: `${url}/api/info/sponsor`,
      dataType: 'json',
      type: 'GET',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },

      cache: false,
      success(response) {
        dispatcher.dispatch({ type: 'SPONSOR_GET', sponsors: response.data });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
  }

  updateSponsor(sponsor){
    $.ajax({
      url: "https://dev.calligre.com/api/info/sponsor/" + sponsor.id,
      data : JSON.stringify(sponsor),
      type : 'PATCH',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response){
        dispatcher.dispatch({ type: 'SPONSOR_UPDATE', sponsor });
      },
      error: function(error){
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      }
    });
    return this.events;
  };

  addSponsor(sponsor){
    $.ajax({
      url: "https://dev.calligre.com/api/info/sponsor",
      data : JSON.stringify(sponsor),
      type : 'POST',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response){
        dispatcher.dispatch({ type: 'SPONSOR_ADD', sponsor, id: response.data.id });
      },
      error: function(error){
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      }
    });
    return this.sponsors;
  };

  deleteSponsor(id){
    $.ajax({
      url: "https://dev.calligre.com/api/info/sponsor/" + id,
      type : 'DELETE',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response){
        dispatcher.dispatch({ type: 'SPONSOR_DELETE', id });
      },
      error: function(error){
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      }
    });
    return this.sponsors;
  };

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
          return card.attributes.data;
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
