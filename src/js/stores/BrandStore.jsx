import { EventEmitter } from 'events';
import AuthService from 'util/AuthService';
import dispatcher from 'dispatcher';

const $ = require('jquery');

const url = 'https://dev.calligre.com';

class BrandStore extends EventEmitter {
  constructor() {
    super();
    this.branding = {};
    this.error = null;
  }


  getBranding() {
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
      case 'BRANDING_SAVED': {
        this.emit('savedBranding');
        break;
      }
      case 'ERROR':
      default: {
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
