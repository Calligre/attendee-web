import { EventEmitter } from 'events';
import AuthService from 'util/AuthService';

import dispatcher from 'dispatcher';

const $ = require('jquery');

const url = 'https://dev.calligre.com';


class PreferenceStore extends EventEmitter {
  constructor() {
    super();
    this.preferences = {
      newsfeed: false,
      cards: false,
      info: false,
      facebook: false,
      twitter: false,
      reposts: false,
    };
    this.error = null;
  }

  loadAll() {
    $.ajax({
      url: `${url}/api/preference`,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      cache: false,
      success(response) {
        dispatcher.dispatch({ type: 'PREFERENCES_GET', preferences: response.data.attributes });
      },
      failure(error) {
        dispatcher.dispatch({ type: 'PREFERENCES_ERROR', error: error.error });
      },
    });
    return this.preferences;
  }

  update(key, value) {
    $.ajax({
      url: `${url}/api/preference`,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      type: 'PATCH',
      contentType: "application/json",
      data: JSON.stringify({ [key]: value }),
      cache: false,
      success(response) {
        dispatcher.dispatch({ type: 'PREFERENCES_UPDATE', key: key, value: value });
      },
      failure(error) {
        dispatcher.dispatch({ type: 'PREFERENCES_ERROR', error: error.error });
      },
    });
    return this.preferences;
  }


  handleActions(action) {
    switch (action.type) {
      case 'PREFERENCES_GET': {
        this.preferences = action.preferences;
        this.emit('loaded');
        break;
      }
      case 'PREFERENCES_UPDATE': {
        this.preferences[action.key] = action.value;
        this.emit('loaded');
        break;
      }
      case 'ERROR': {
        this.error = action.error;
        this.emit('error');
        break;
      }
      default: {
        this.error = 'Unknown action';
        console.log(`What kind of action is ${action.type}?`);
        break;
      }
    }
  }


}


const preferenceStore = new PreferenceStore();
dispatcher.register(preferenceStore.handleActions.bind(preferenceStore));

export default preferenceStore;
