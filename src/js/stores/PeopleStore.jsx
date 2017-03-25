import { EventEmitter } from 'events';
import AjaxService from 'util/AjaxService';

import dispatcher from 'dispatcher';


class PeopleStore extends EventEmitter {
  constructor() {
    super();
    this.people = [];
    this.error = null;
  }

  create(data) {
    AjaxService.create({
      endpoing: 'user',
      data,
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
    AjaxService.get({
      endpoint: 'user',
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
    fileReader.onloadend = function () {
      AjaxService.call({
        endpoint: `user/${id}/photo`,
        type: 'PUT',
        data: { data: this.result },
        success(response) {
          self.updatePerson({ id, photo: response.data.url });
          // dispatcher.dispatch({type: "PEOPLE_GET", people: response});
        },
        error(error) {
          console.log(error);
          // dispatcher.dispatch({type: "PEOPLE_ERROR", error: error});
        },
      });
      return this.people;
    };
  }

  updatePerson(person) {
    AjaxService.update({
      endppoint: 'user',
      data: person,
      success(response) {
        console.log(response);
        // dispatcher.dispatch({type: "PEOPLE_GET", people: response});
      },
      error(error) {
        console.log(error);
        // dispatcher.dispatch({type: "PEOPLE_ERROR", error: error});
      },
    });
    return this.people;
  }

  handleActions(action) {
    switch (action.type) {
      case 'PEOPLE_CREATE':
        this.people.push(action.person);
        this.emit('received');
        break;
      case 'PEOPLE_GET': {
        this.people = action.people.data.map((person) => {
          return person.attributes;
        });
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
