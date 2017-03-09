import { EventEmitter } from "events";
import AuthService from "util/AuthService"

import dispatcher from "dispatcher";

var $ = require("jquery");
var moment = require('moment');
var url = "https://dev.calligre.com";

class NotificationStore extends EventEmitter {
  constructor() {
    super()
    this.notifications = [];
    this.viewedNotifications = JSON.parse(localStorage.getItem("viewedNotifications"));
    this.error = null;
  }

  getAll() {
    var self = this;
    $.ajax({
      url: url + "/api/broadcast",
      dataType: "json",
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      cache: false,
      success: function(response) {
        self.notifications = response.data;
        self.notifications = self.notifications.map((notification) => {
          return notification.attributes;
        });
        dispatcher.dispatch({type: "NOTIFICATIONS_GET", notifications: self.notifications});
      },
      error: function(error){
        dispatcher.dispatch({type: "ERROR", error: error.error});
      }
    });
    return self.notifications;
  }

  getValid() {
    var self = this;
    const currTime = moment().unix();

    // Check Expiry time
    self.notifications = self.notifications.filter((notification) => {
      return notification.expirytime > currTime;
    });

    // Check if Notifications have already been seen
    const viewedNotifications = JSON.parse(localStorage.getItem("viewedNotifications"));
    if (viewedNotifications) {
      self.notifications = self.notifications.filter((notification) => {
        return !(viewedNotifications.includes(notification.id));
      });
    }

    self.notifications = self.notifications.map((notification) => {
      return {
        message: notification.message,
        id: notification.id,
        key: "notification-" + notification.id,
        expirytime: notification.expirytime,
        action: 'Dismiss',
        dismissAfter: (notification.expirytime - currTime) * 1000,
        onClick: () => this.handleDismiss(notification)
      }
    });
    self.notifications = self.notifications.sort((a, b) => {
      return a.expirytime > b.expirytime;
    });
    return self.notifications;
  }

  handleDismiss(notificationParam) {
    var self = this;
    self.notifications = self.notifications.filter((notification) => {
      return notification.id != notificationParam.id;
    });

    // Set this notification as viewed so it doesn't appear again
    let viewedNotifications = JSON.parse(localStorage.getItem("viewedNotifications"));
    if (viewedNotifications == null) {
      viewedNotifications = [];
    }
    viewedNotifications.push(notificationParam.id);
    localStorage.setItem("viewedNotifications", JSON.stringify(viewedNotifications));

    dispatcher.dispatch({type: "NOTIFICATIONS_GET"});
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
