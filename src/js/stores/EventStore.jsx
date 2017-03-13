import { EventEmitter } from "events";
import AuthService from "util/AuthService";

import dispatcher from "dispatcher";

var $ = require("jquery");
var randomColor = require('randomcolor');
var streamMap = {};
var url = "https://dev.calligre.com"


class EventStore extends EventEmitter {
  constructor() {
    super()
    this.events = [];
    this.error = null;
  }

  getAll() {
    $.ajax({
      url: url + "/api/event",
      dataType: "json",
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      cache: false,
      success: function(response){
        var events = response.data;
        $.ajax({
          url: url + "/api/user/" + AuthService.getCurrentUserId() + "/subscription",
          dataType: "json",
          headers: {
            "Authorization": "Bearer " + AuthService.getToken()
          },
          cache: false,
          success: function(response){
            var subscription = response.data.map((sub) => {
              return sub.attributes.event_id;
            });
            dispatcher.dispatch({type: "EVENTS_GET", events: events, subscriptions: subscription});
          },
          error: function(error){
            dispatcher.dispatch({type: "EVENTS_ERROR", error: error.error});
          }
        });
      },
      error: function(error){
        dispatcher.dispatch({type: "EVENTS_ERROR", error: error.error});
      }
    });
    return this.events;
  }

  get(id){
    $.ajax({
      url: url + "/api/event/" + id,
      dataType: "json",
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      cache: false,
      success: function(response){
        dispatcher.dispatch({type: "EVENT_GET", event: response.data});
      },
      error: function(error){
        dispatcher.dispatch({type: "EVENTS_ERROR", error: error.error});
      }
    });
    return this.events;
  }

  updateEvent(event){
    $.ajax({
      url: "https://dev.calligre.com/api/event/" + event.id,
      data : JSON.stringify(event),
      type : 'PATCH',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response){
        console.log(response);
      },
      error: function(error){
        console.log(error);
      }
    });
    return this.events;
  };

  addEvent(event){
    $.ajax({
      url: "https://dev.calligre.com/api/event",
      data : JSON.stringify(event),
      type : 'POST',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response){
        console.log(response);
      },
      error: function(error){
        console.log(error);
      }
    });
    return this.events;
  };

  deleteEvent(id){
    $.ajax({
      url: "https://dev.calligre.com/api/event/" + id,
      type : 'DELETE',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response){
        console.log(response);
      },
      error: function(error){
        console.log(error);
      }
    });
    return this.events;
  };

  subscribeToEvent(id){
    $.ajax({
      url: url + "/api/user/" + AuthService.getCurrentUserId() + "/subscription",
      type: "POST",
      data: JSON.stringify({"event_id": id}),
      contentType: "application/json",
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      dataType: 'json',
      cache: false,
      success: function(response){
        dispatcher.dispatch({type: "EVENT_SUBSCRIBE", event: id, isSubscribed: true});
      },
      error: function(error){
        dispatcher.dispatch({type: "EVENTS_ERROR", error: error.error});
      }
    });
  }

  unsubscribeToEvent(id){
    $.ajax({
      url: url + "/api/user/" + AuthService.getCurrentUserId() + "/subscription/" + id,
      type: "DELETE",
      dataType: "json",
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      cache: false,
      success: function(response){
        dispatcher.dispatch({type: "EVENT_UNSUBSCRIBE", event: id, isSubscribed: false});
      },
      error: function(error){
        dispatcher.dispatch({type: "EVENTS_ERROR", error: error.error});
      }
    });
  }


  handleActions(action) {
    switch(action.type) {
      case "EVENTS_GET": {
        action.events.forEach((event) => {
          if(typeof streamMap[event.attributes.stream] == "undefined"){
            streamMap[event.attributes.stream] = randomColor();
          }
        });
        this.events = action.events.map((event) => {
          var attributes = event.attributes;
          attributes["streamColor"] = streamMap[attributes.stream];
          attributes["isSubscribed"] = action.subscriptions.includes(attributes.id);
          return attributes;
        })

        this.emit("received");
        break;
      }
      case "EVENT_GET": {
        this.events.forEach((event) => {
          if(event.id == action.event.id) {
            $.extend(event, action.event.attributes);
          }
        });
        this.emit("received");
        break;
      }
      case "EVENT_SUBSCRIBE":
      case "EVENT_UNSUBSCRIBE": {
        this.events.forEach((event) => {
          if(event.id == action.event) {
            event.isSubscribed = action.isSubscribed;
          }
        });
        this.emit("subscription");
        break;
      }
      case "EVENT_UNSUBSCRIBE": {
        break;
      }
      case "ERROR": {
        this.error = action.error;
        this.emit("error");
        break;
      }
    }
  }

}

const eventStore = new EventStore;
dispatcher.register(eventStore.handleActions.bind(eventStore));

export default eventStore;
