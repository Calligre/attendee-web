import { EventEmitter } from 'events';

import AuthService from 'util/AuthService';
import AjaxService from 'util/AjaxService';

import dispatcher from 'dispatcher';

const randomColor = require('randomcolor');

const streamMap = {};


class EventStore extends EventEmitter {
  constructor() {
    super();
    this.events = [];
    this.streams = [];
    this.error = null;
    this.streamMap = {};
  }

  getStreams() {
    AjaxService.get({
      endpoint: 'stream',
      success(response) {
        const streams = response.data.map(d => d.attributes.stream);
        dispatcher.dispatch({ type: 'STREAM_GET', stream: streams });
      },
      error(error) {
        dispatcher.dispatch({ type: 'EVENT_ERROR', error: error.error });
      },
    });
    return this.events;
  }

  getAll() {
    AjaxService.get({
      endpoint: 'event',
      success(response) {
        const events = response.data;
        AjaxService.get({
          endpoint: `user/${AuthService.getCurrentUserId()}/subscription`,
          success(response2) {
            const subscription = response2.data.map(sub => sub.attributes.event_id);
            dispatcher.dispatch({ type: 'EVENT_GET', events, subscriptions: subscription });
          },
          error(error) {
            dispatcher.dispatch({ type: 'EVENT_ERROR', error: error.error });
          },
        });
      },
      error(error) {
        dispatcher.dispatch({ type: 'EVENT_ERROR', error: error.error });
      },
    });
    return this.events;
  }

  updateEvent(event) {
    AjaxService.update({
      endpoint: 'event',
      data: event,
      success() {
        dispatcher.dispatch({ type: 'EVENT_UPDATE', event });
      },
      error(error) {
        dispatcher.dispatch({ type: 'EVENT_ERROR', error });
      },
    });
    return this.events;
  }

  addEvent(event) {
    AjaxService.create({
      endpoint: 'event',
      data: event,
      success(response) {
        dispatcher.dispatch({ type: 'EVENT_ADD', event, id: response.data.id });
      },
      error(error) {
        dispatcher.dispatch({ type: 'EVENT_ERROR', error });
      },
    });
    return this.events;
  }

  deleteEvent(id) {
    AjaxService.delete({
      endpoint: 'event',
      id,
      success() {
        dispatcher.dispatch({ type: 'EVENT_DELETE', id });
      },
      error(error) {
        dispatcher.dispatch({ type: 'EVENT_ERROR', error });
      },
    });
    return this.events;
  }

  subscribeToEvent(id) {
    AjaxService.create({
      endpoint: `user/${AuthService.getCurrentUserId()}/subscription`,
      data: { event_id: id },
      success() {
        dispatcher.dispatch({ type: 'EVENT_SUBSCRIBE', event: id, isSubscribed: true });
      },
      error(error) {
        dispatcher.dispatch({ type: 'EVENT_ERROR', error: error.error });
      },
    });
    return this.events;
  }

  unsubscribeToEvent(id) {
    AjaxService.delete({
      endpoint: `user/${AuthService.getCurrentUserId()}/subscription`,
      id,
      success() {
        dispatcher.dispatch({ type: 'EVENT_UNSUBSCRIBE', event: id, isSubscribed: false });
      },
      error(error) {
        dispatcher.dispatch({ type: 'EVENT_ERROR', error: error.error });
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
      case 'EVENT_GET': {
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
      case 'EVENT_UPDATE': {
        const entry = this.events.find(c => c.id === action.event.id);
        Object.assign(entry, action.event);
        this.emit('updateEvents');
        break;
      }
      case 'EVENT_ADD': {
        const event = action.event;
        event.id = action.id;
        streamMap[event.stream] = streamMap[event.stream] || randomColor();
        event.streamColor = streamMap[event.stream];
        this.events.push(event);
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
