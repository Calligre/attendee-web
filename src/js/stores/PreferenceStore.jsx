import { EventEmitter } from 'events';
import AuthService from 'util/AuthService';
import UrlService from 'util/UrlService';
import AjaxService from 'util/AjaxService';

import dispatcher from 'dispatcher';

const $ = require('jquery');

const url = UrlService.getUrl();


class PreferenceStore extends EventEmitter {
  constructor() {
    super();
    this.preferences = this.getDefaults();
    this.error = null;
  }

  getDefaults() {
    return {
      newsfeed: true,
      facebook: true,
      twitter: true,
      reposts: true,
      events: true,
      content: true,
      contact: true,
      location: true,
      map: true,
      package: true,
      survey: true,
    };
  }

  loadAll() {
    AjaxService.get({
      endpoint: 'preference',
      success(response) {
        dispatcher.dispatch({ type: 'PREFERENCES_GET', preferences: response.data.attributes });
      },
      error(error) {
        dispatcher.dispatch({ type: 'PREFERENCES_ERROR', error: error.error });
      },
    });
    return this.preferences;
  }

  update(key, value) {
    AjaxService.update({
      endpoint: 'preference',
      data: { [key]: value },
      success() {
        dispatcher.dispatch({ type: 'PREFERENCES_UPDATE', key, value });
      },
      error(error) {
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
        break;
      }
    }
  }


}


const preferenceStore = new PreferenceStore();
dispatcher.register(preferenceStore.handleActions.bind(preferenceStore));

export default preferenceStore;
