import { EventEmitter } from "events";
import AuthService from "util/AuthService";

import dispatcher from "dispatcher";

var $ = require("jquery");

class PeopleStore extends EventEmitter {
  constructor() {
    super()
    this.people = [];
    this.error = null;
  }

  getAll() {
    $.ajax({
      url: "https://dev.calligre.com/api/user",
      dataType: "json",
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      cache: false,
      success: function(response){
        dispatcher.dispatch({type: "PEOPLE_GET", people: response});
      },
      failure: function(error){
        dispatcher.dispatch({type: "PEOPLE_ERROR", error: error});
      }
    });
    return this.people;
  }

  updatePhoto(id, photo) {
    const self = this;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(photo);
    fileReader.onloadend = function (e) {
      $.ajax({
        url: "https://dev.calligre.com/api/user/" + id + "/photo",
        contentType : 'application/json',
        type: 'put',
        data: JSON.stringify({data: this.result}),
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
        processData: false,
        cache: false,
        success: function(response){
          self.updatePerson({id: id, photo: response.data.url});
          //dispatcher.dispatch({type: "PEOPLE_GET", people: response});
        },
        failure: function(error){
          console.log(error);
          //dispatcher.dispatch({type: "PEOPLE_ERROR", error: error});
        }
      });
      return this.people;
    }
  }

  updatePerson(person) {
    $.ajax({
      url: "https://dev.calligre.com/api/user/" + person.id,
      data : JSON.stringify(person),
      type : 'PATCH',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response){
        console.log(response);
        //dispatcher.dispatch({type: "PEOPLE_GET", people: response});
      },
      failure: function(error){
        console.log(error);
        //dispatcher.dispatch({type: "PEOPLE_ERROR", error: error});
      }
    });
    return this.people;
  }

  handleActions(action) {
    switch(action.type) {
      case "PEOPLE_GET": {
        this.people = action.people.data.map(function(person) {
          return person.attributes;
        });
        this.emit("received");
        break;
      }
      case "PEOPLE_ERROR": {
        this.error = action.error;
        this.emit("error");
        break;
      }
    }
  }
}

const peopleStore = new PeopleStore;
dispatcher.register(peopleStore.handleActions.bind(peopleStore));

export default peopleStore;
