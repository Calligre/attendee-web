import { EventEmitter } from "events";

import dispatcher from "../dispatcher";

var $ = require("jquery");
var moment = require('moment');
var url = "https://dev.calligre.com"

class NotificationStore extends EventEmitter {
  constructor() {
    super()
    this.notifications = [];
    this.error = null;
  }

  getAll() {
    var self = this;
    $.ajax({
      url: url + "/api/broadcast",
      dataType: "json",
      cache: false,
      success: function(response) {
        self.notifications = response.data;
        dispatcher.dispatch({type: "NOTIFICATIONS_GET", notifications: self.notifications});
      },
      failure: function(error){
        dispatcher.dispatch({type: "ERROR", error: error.error});
      }
    });
    return self.notifications;
  }

  getUnexpired() {
    var self = this;
    var tempNotifications = [];
    const currTime = moment().unix();
    self.notifications.forEach((notification) => {
      if (currTime > notification.attributes.expirytime) {
        return;
      }
      tempNotifications.push(notification);
    });
    self.notifications = tempNotifications;
    return self.notifications;
  }

  handleActions(action) {
    switch(action.type) {
      case "NOTIFICATIONS_GET": {
        this.emit("received");
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

const notificationStore = new NotificationStore;
dispatcher.register(notificationStore.handleActions.bind(notificationStore));

export default notificationStore;
