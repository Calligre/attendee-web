import { EventEmitter } from 'events';
import AuthService from 'util/AuthService';
import dispatcher from 'dispatcher';

const url = 'https://dev.calligre.com';
const $ = require('jquery');

class ConferenceStore extends EventEmitter {
  constructor() {
    super();
    this.conferences = [];
    this.error = null;
  }

  getConferences() {
    const self = this;
    $.ajax({
      url: `${url}/api/conference`,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      cache: false,
      success(response) {
        self.conferences = response.data;
        self.conferences = self.conferences.map(conference => conference.attributes);
        dispatcher.dispatch({ type: 'LOADED_CONFERENCES', conferences: self.conferences });
      },
      failure(error) {
        self.error = error;
        dispatcher.dispatch({ type: 'ERROR', error: self.error });
      },
    });
    return this.conferences;
  }

  handleActions(action) {
    switch (action.type) {
      case 'LOADED_CONFERENCES': {
        this.emit('loadedConferences');
        break;
      }
      case 'ERROR': {
        this.emit('error');
        break;
      }
      default: {
        break;
      }
    }
  }
}

const conferenceStore = new ConferenceStore();
dispatcher.register(conferenceStore.handleActions.bind(conferenceStore));

export default conferenceStore;
