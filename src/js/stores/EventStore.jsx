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
    this.streamMap = {};
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
          failure: function(error){
            dispatcher.dispatch({type: "EVENTS_ERROR", error: error.error});
          }
        });
      },
      failure: function(error){
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
      failure: function(error){
        dispatcher.dispatch({type: "EVENTS_ERROR", error: error.error});
      }
    });
    return this.events;
  }

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
      failure: function(error){
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
      failure: function(error){
        dispatcher.dispatch({type: "EVENTS_ERROR", error: error.error});
      }
    });
  }


  handleActions(action) {
    switch(action.type) {
      case "STREAMS_GET": {
        action.streams.forEach((stream) => {
            streamMap[stream.attributes.stream] = randomColor();
        });
        this.emit("streams");
        break;
      }
      case "EVENTS_GET": {
        this.events = action.events.map((event) => {
          var attributes = event.attributes;
          streamMap[attributes.stream] = streamMap[attributes.stream] || randomColor();
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
