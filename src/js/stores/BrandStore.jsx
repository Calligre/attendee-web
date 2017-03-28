import { EventEmitter } from 'events';
import AuthService from 'util/AuthService';
import UrlService from 'util/UrlService';

import dispatcher from 'dispatcher';

const $ = require('jquery');
const moment = require('moment');
const url = UrlService.getUrl();

// for the UI
function formatData(data) {
  const value = Object.assign({}, data);
  value.starttime = moment.unix(value.starttime).valueOf();
  value.endtime = moment.unix(value.endtime).valueOf();
  return value;
}

// for the DB
function formatValues(data) {
  const value = Object.assign({}, data);
  value.starttime = moment(value.starttime).unix();
  value.endtime = moment(value.endtime).unix();
  return value;
}

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
      url: url + "/info/card/" + card.id,
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
      },
      error: function(error){
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      }
    });

    return this.cards;
  };

  addCard(card){
    $.ajax({
      url: url + "/info/card",
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
      url: url + "/info/card/" + id,
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
      url: url + "/info/contact/" + contact.id,
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
      url: url + "/info/contact",
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
      url: url + "/info/contact/" + id,
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
      url: url + "/info/location/" + location.id,
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
      url: url + "/info/location",
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
      url: url + "/info/location/" + id,
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
      url: `${url}/info/sponsor`,
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
      url: url + "/info/sponsor/" + sponsor.id,
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
      url: url + "/info/sponsor",
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
      url: url + "/info/sponsor/" + id,
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
    const brand = formatValues(data);

    $.ajax({
      url: `${url}/info`,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(brand),
      type: 'PATCH',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      cache: false,
      success() {
        dispatcher.dispatch({ type: 'BRANDING_SAVED', brand: data });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });
  }

  update(key, value) {
    $.ajax({
      url: `${url}/info`,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      type: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify({ [key]: value }),
      cache: false,
      success() {
        dispatcher.dispatch({ type: 'BRANDING_SAVED', key, value });
      },
      failure(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error: error.error });
      },
    });
    return this.branding;
  }

  handleActions(action) {
    switch (action.type) {
      case 'BRANDING_GET': {
        this.branding = formatData(action.branding);
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
        this.branding = Object.assign(this.branding, action.brand);
        this.emit('savedBranding');
        break;
      }
      case 'BRAND_ERROR': {
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
