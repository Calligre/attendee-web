import { EventEmitter } from 'events';
import AuthService from 'util/AuthService';
import dispatcher from 'dispatcher';

const $ = require('jquery');

const url = 'https://dev.calligre.com';

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
      url: `${url}/api/info`,
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
  
  getCards = () => {
    $.ajax({
      url: `${url}/api/info/card`,
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
        console.log(response);
      },
      error: function(error){
        console.error(error);
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
        console.log(response);
      },
      error: function(error){
        console.error(error);
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
        console.log(response);
      },
      error: function(error){
        console.error(error);
      }
    });
    return this.cards;
  };


  getContacts = () => {
    $.ajax({
      url: `${url}/api/info/contact`,
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
        console.log(response);
      },
      error: function(error){
        console.error(error);
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
        console.log(response);
      },
      error: function(error){
        console.error(error);
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
        console.log(response);
      },
      error: function(error){
        console.error(error);
      }
    });
    return this.contacts;
  };

  getLocations = () => {
    $.ajax({
      url: `${url}/api/info/location`,
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
        console.log(response);
      },
      error: function(error){
        console.error(error);
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
        console.log(response);
      },
      error: function(error){
        console.error(error);
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
        console.log(response);
      },
      error: function(error){
        console.error(error);
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
        console.log(`${error.status}: ${error.statusText}`);
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
        console.log(response);
      },
      error: function(error){
        console.error(error);
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
        console.log(response);
      },
      error: function(error){
        console.error(error);
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
        console.log(response);
      },
      error: function(error){
        console.error(error);
      }
    });
    return this.sponsors;
  };

  saveBranding(data) {
    $.ajax({
      url: `${url}/api/info`,
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
          return card.attributes;
        });
        this.emit('receivedCards');
        break;
      }
      case 'SPONSOR_GET': {
        this.sponsors = action.sponsors.map((sponsor) => {
          return sponsor.attributes;
        });
        this.emit('receivedSponsors');
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
