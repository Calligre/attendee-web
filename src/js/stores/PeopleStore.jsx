import { EventEmitter } from 'events';
import AuthService from 'util/AuthService';
import UrlService from 'util/UrlService';

import dispatcher from 'dispatcher';

const $ = require('jquery');

const url = UrlService.getUrl();

class PeopleStore extends EventEmitter {
  constructor() {
    super();
    this.people = [];
    this.error = null;
  }

  create(data) {
    $.ajax({
      url: `${url}/user`,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      type: 'POST',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      cache: false,
      success(response) {
        dispatcher.dispatch({ type: 'PEOPLE_CREATE', people: response });
      },
      error(error) {
        dispatcher.dispatch({ type: 'PEOPLE_ERROR', error });
      },
    });
    return this.people;
  }


  getAll() {
    $.ajax({
      url: `${url}/user`,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      cache: false,
      success(response) {
        dispatcher.dispatch({ type: 'PEOPLE_GET', people: response });
      },
      error(error) {
        dispatcher.dispatch({ type: 'PEOPLE_ERROR', error });
      },
    });
    return this.people;
  }

  updatePhoto(id, photo) {
    const self = this;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(photo);
    fileReader.onloadend = () => {
      $.ajax({
        url: `${url}/user/${id}/photo`,
        contentType: 'application/json',
        type: 'put',
        data: JSON.stringify({ data: this.result }),
        headers: {
          Authorization: `Bearer ${AuthService.getToken()}`,
        },
        processData: false,
        cache: false,
        success(response) {
          self.updatePerson({ id, photo: response.data.url });
        },
        error(error) {
          dispatcher.dispatch({ type: 'PEOPLE_ERROR', error });
        },
      });
      return this.people;
    };
  }

  updatePerson(person) {
    $.ajax({
      url: `${url}/user/${person.id}`,
      data: JSON.stringify(person),
      type: 'PATCH',
      contentType: 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      success() {
        dispatcher.dispatch({ type: 'PEOPLE_UPDATE', person });
      },
      error(error) {
        dispatcher.dispatch({ type: 'PEOPLE_ERROR', error });
      },
    });
    return this.people;
  }

  handleActions(action) {
    switch (action.type) {
      case 'PEOPLE_CREATE': {
        this.people.push(action.person);
        this.emit('added');
        break;
      }
      case 'PEOPLE_UPDATE': {
        const entry = this.people.find(c => c.id === action.person.id);
        Object.assign(entry, action.person);
        this.emit('updated');
        break;
      }
      case 'PEOPLE_GET': {
        this.people = action.people.data.map(person => person.attributes);
        this.emit('received');
        break;
      }
      case 'PEOPLE_ERROR': {
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

const peopleStore = new PeopleStore();
dispatcher.register(peopleStore.handleActions.bind(peopleStore));

export default peopleStore;
