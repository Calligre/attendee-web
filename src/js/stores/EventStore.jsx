import { EventEmitter } from 'events';
import AuthService from 'util/AuthService';

import dispatcher from 'dispatcher';

const $ = require('jquery');
const randomColor = require('randomcolor');

const streamMap = {};
const url = 'https://dev.calligre.com';


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
      url: `${url}/api/stream`,
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
      url: `${url}/api/event`,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      cache: false,
      success(response) {
        const events = response.data;
        $.ajax({
          url: `${url}/api/user/${AuthService.getCurrentUserId()}/subscription`,
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

  get(id) {
    $.ajax({
      url: `${url}/api/event/${id}`,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      cache: false,
      success(response) {
        dispatcher.dispatch({ type: 'EVENT_GET', event: response.data });
      },
      failure(error) {
        dispatcher.dispatch({ type: 'EVENTS_ERROR', error: error.error });
      },
    });
    return this.events;
  }

  subscribeToEvent(id) {
    $.ajax({
      url: `${url}/api/user/${AuthService.getCurrentUserId()}/subscription`,
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
      url: `${url}/api/user/${AuthService.getCurrentUserId()}/subscription/${id}`,
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
          const attributes = event.attributes;
          streamMap[attributes.stream] = streamMap[attributes.stream] || randomColor();
          attributes.streamColor = streamMap[attributes.stream];
          attributes.isSubscribed = action.subscriptions.includes(attributes.id);
          return attributes;
        });

        this.emit('received');
        break;
      }
      case 'EVENT_GET': {
        this.events.forEach((event) => {
          if (event.id === action.event.id) {
            $.extend(event, action.event.attributes);
          }
        });
        this.emit('received');
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
        console.error(`How did you even get here, what the hell are you dispacting ${action.type}`);
        break;
      }
    }
  }

}

const eventStore = new EventStore();
dispatcher.register(eventStore.handleActions.bind(eventStore));

export default eventStore;
