import { EventEmitter } from 'events';
import AuthService from 'util/AuthService';
import UrlService from 'util/UrlService';

import dispatcher from 'dispatcher';

const $ = require('jquery');
const randomColor = require('randomcolor');

const streamMap = {};
const url = UrlService.getUrl();
const moment = require('moment');

// for the UI
function formatData(event) {
  const value = event;
  value.starttime = moment.unix(value.starttime).valueOf();
  value.endtime = moment.unix(value.endtime).valueOf();
  return value;
}

// for the DB
function formatValues(event) {
  const value = event;
  value.starttime = moment(value.starttime).unix();
  value.endtime = moment(value.endtime).unix();
  return value;
}

class EventStore extends EventEmitter {
  constructor() {
    super();
    this.events = [];
    this.streams = [];
    this.error = null;
    this.streamMap = {};
  }

  getStreams() {
    $.ajax({
      url: `${url}/stream`,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      cache: false,
      success(response) {
        const streams = response.data.map(d => d.attributes.stream);
        dispatcher.dispatch({ type: 'STREAM_GET', stream: streams });
      },
      failure(error) {
        dispatcher.dispatch({ type: 'EVENTS_ERROR', error: error.error });
      },
    });
    return this.events;
  }

  getAll() {
    $.ajax({
      url: `${url}/event`,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      cache: false,
      success(response) {
        const events = response.data;
        $.ajax({
          url: `${url}/user/${AuthService.getCurrentUserId()}/subscription`,
          dataType: 'json',
          headers: {
            Authorization: `Bearer ${AuthService.getToken()}`,
          },
          cache: false,
          success(response2) {
            const subscription = response2.data.map(sub => sub.attributes.event_id);
            dispatcher.dispatch({ type: 'EVENTS_GET', events, subscriptions: subscription });
          },
          failure(error) {
            dispatcher.dispatch({ type: 'EVENTS_ERROR', error: error.error });
          },
        });
      },
      failure(error) {
        dispatcher.dispatch({ type: 'EVENTS_ERROR', error: error.error });
      },
    });
    return this.events;
  }

  updateEvent(data) {
    const event = formatValues(data);

    $.ajax({
      url: `${url}/event/${event.id}`,
      data: JSON.stringify(event),
      type: 'PATCH',
      contentType: 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      success() {
        dispatcher.dispatch({ type: 'EVENT_UPDATE', event });
      },
      error(error) {
        dispatcher.dispatch({ type: 'EVENTS_ERROR', error: error.error });
      },
    });
    return this.events;
  }

  addEvent(data) {
    const event = formatValues(data);
    $.ajax({
      url: `${url}/event`,
      data: JSON.stringify(event),
      type: 'POST',
      contentType: 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      success(response) {
        dispatcher.dispatch({ type: 'EVENT_ADD', event, id: response.data.id });
      },
      error(error) {
        dispatcher.dispatch({ type: 'EVENTS_ERROR', error: error.error });
      },
    });
    return this.events;
  }

  deleteEvent(id) {
    $.ajax({
      url: `${url}/event/${id}`,
      type: 'DELETE',
      contentType: 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      success() {
        dispatcher.dispatch({ type: 'EVENT_DELETE', id });
      },
      error(error) {
        dispatcher.dispatch({ type: 'EVENTS_ERROR', error: error.error });
      },
    });
    return this.events;
  }

  subscribeToEvent(id) {
    $.ajax({
      url: `${url}/user/${AuthService.getCurrentUserId()}/subscription`,
      type: 'POST',
      data: JSON.stringify({ event_id: id }),
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      dataType: 'json',
      cache: false,
      success() {
        dispatcher.dispatch({ type: 'EVENT_SUBSCRIBE', event: id, isSubscribed: true });
      },
      failure(error) {
        dispatcher.dispatch({ type: 'EVENTS_ERROR', error: error.error });
      },
    });
    return this.events;
  }

  unsubscribeToEvent(id) {
    $.ajax({
      url: `${url}/user/${AuthService.getCurrentUserId()}/subscription/${id}`,
      type: 'DELETE',
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      cache: false,
      success() {
        dispatcher.dispatch({ type: 'EVENT_UNSUBSCRIBE', event: id, isSubscribed: false });
      },
      failure(error) {
        dispatcher.dispatch({ type: 'EVENTS_ERROR', error: error.error });
      },
    });
    return this.events;
  }


  handleActions(action) {
    switch (action.type) {
      case 'STREAMS_GET': {
        action.streams.forEach((stream) => {
          streamMap[stream.attributes.stream] = randomColor();
        });
        this.emit('streams');
        break;
      }
      case 'EVENTS_GET': {
        this.events = action.events.map((event) => {
          const attributes = formatData(event.attributes);
          streamMap[attributes.stream] = streamMap[attributes.stream] || randomColor();
          attributes.streamColor = streamMap[attributes.stream];
          attributes.isSubscribed = action.subscriptions.includes(attributes.id);
          return attributes;
        });

        this.emit('received');
        break;
      }
      case 'EVENT_UPDATE': {
        const entry = this.events.find(c => c.id === action.event.id);
        Object.assign(entry, formatData(action.event));
        this.emit('updateEvents');
        break;
      }
      case 'EVENT_ADD': {
        const event = action.event;
        event.id = action.id;
        streamMap[event.stream] = streamMap[event.stream] || randomColor();
        event.streamColor = streamMap[event.stream];
        this.events.push(formatData(event));
        this.emit('addEvents');
        break;
      }
      case 'EVENT_DELETE': {
        const index = this.events.findIndex(c => c.id === action.id);
        if (index > -1) {
          this.events.splice(index, 1);
        }
        this.emit('deleteEvents');
        break;
      }
      case 'STREAM_GET': {
        this.streams = action.stream;
        this.emit('stream');
        break;
      }
      case 'EVENT_SUBSCRIBE':
      case 'EVENT_UNSUBSCRIBE': {
        this.events.forEach((event) => {
          if (event.id === action.event) {
            event.isSubscribed = action.isSubscribed;
          }
        });
        this.emit('subscription');
        break;
      }
      case 'ERROR': {
        this.error = action.error;
        this.emit('error');
        break;
      }
      default: {
        break;
      }
    }
  }

}

const eventStore = new EventStore();
dispatcher.register(eventStore.handleActions.bind(eventStore));

export default eventStore;
