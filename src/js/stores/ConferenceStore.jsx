import AjaxService from 'util/AjaxService';

import dispatcher from 'dispatcher';
import { EventEmitter } from 'events';


class ConferenceStore extends EventEmitter {
  constructor() {
    super();
    this.conferences = [];
    this.error = null;
  }

  getConferences() {
    const self = this;
    AjaxService.get({
      endpoint: 'conference',
      success(response) {
        self.conferences = response.data;
        self.conferences = self.conferences.map(conference => conference.attributes);
        dispatcher.dispatch({ type: 'LOADED_CONFERENCES', conferences: self.conferences });
      },
      error(error) {
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
