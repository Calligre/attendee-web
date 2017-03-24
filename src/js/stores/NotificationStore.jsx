import { EventEmitter } from "events";
import AuthService from "util/AuthService"
import UrlService from 'util/UrlService';

import dispatcher from "dispatcher";

var $ = require("jquery");
const url = UrlService.getUrl();
var moment = require('moment');

class NotificationStore extends EventEmitter {
  constructor() {
    super()
    this.notifications = [];
    this.error = null;
  }

  getAll() {
    var self = this;
    $.ajax({
      url: `${url}/broadcast`,
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

  add(notification) {
    var self = this;
    $.ajax({
      url: `${url}/broadcast`,
      data : JSON.stringify(notification),
      type : 'POST',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response) {
        dispatcher.dispatch({type: "NOTIFICATIONS_ADD", notifications, id: response.data.id});
      },
      error: function(error){
        dispatcher.dispatch({type: "ERROR", error: error.error});
      }
    });
    return self.notifications;
  }


  update(notification){
    $.ajax({
      url: `${url}/broadcast/${notification.id}`,
      data : JSON.stringify(notification),
      type : 'PATCH',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response){
        dispatcher.dispatch({ type: 'NOTIFICATION_UPDATE', notification });
        console.log(response);
      },
      error: function(error){
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      }
    });

    return this.cards;
  };

  delete(id){
    $.ajax({
      url: `${url}/broadcast/${id}`,
      type : 'DELETE',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      success: function(response){
        dispatcher.dispatch({ type: 'NOTIFICATION_DELETE', id });
      },
      error: function(error){
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      }
    });

    return this.cards;
  };



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
     case 'NOTIFICATION_UPDATE': {
        var entry = this.notifications.find(c => c.id === action.notification.id);
        Object.assign(entry, action.notification);
        this.emit('updateNotifications');
        break;
      }
      case 'NOTIFICATION_ADD': {
        action.notification.id = action.id;
        this.notifications.push(action.notification)
        this.emit('addNotifications');
        break;
      }
      case 'NOTIFICATION_DELETE': {
        let index = this.notifications.findIndex(c => c.id === action.id);
        if (index > -1) {
          this.notifications.splice(index, 1);
        }
        this.emit('deleteNotifications');
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
