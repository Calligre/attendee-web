import { EventEmitter } from 'events';
import AuthService from 'util/AuthService';
import UrlService from 'util/UrlService';

import dispatcher from 'dispatcher';

const $ = require('jquery');
const url = UrlService.getUrl();
const moment = require('moment');

// for the UI
function formatData(notification) {
  const value = notification;
  value.expirytime = moment.unix(value.expirytime).valueOf();
  return value;
}

// for the DB
function formatValues(notification) {
  const value = notification;
  value.expirytime = moment(value.expirytime).unix();
  return value;
}

class NotificationStore extends EventEmitter {
  constructor() {
    super();
    this.notifications = [];
    this.error = null;
  }

  getAll() {
    const self = this;
    $.ajax({
      url: `${url}/broadcast`,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      cache: false,
      success(response) {
        self.notifications = response.data;
        self.notifications = self.notifications.map((notification) => {
          return formatData(notification.attributes);
        });
        dispatcher.dispatch({ type: 'NOTIFICATIONS_GET', notifications: self.notifications });
      },
      error(error) {
        dispatcher.dispatch({ type: 'ERROR', error: error.error });
      },
    });
    return self.notifications;
  }

  add(data) {
    const notification = JSON.stringify(formatValues(data));
    const self = this;
    $.ajax({
      url: `${url}/broadcast`,
      data: notification,
      type: 'POST',
      contentType: 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      success(response) {
        dispatcher.dispatch({ type: 'NOTIFICATION_ADD', notification, id: response.data.id });
      },
      error(error) {
        dispatcher.dispatch({ type: 'ERROR', error: error.error });
      },
    });
    return self.notifications;
  }


  update(data) {
    const notification = JSON.stringify(formatValues(data));

    $.ajax({
      url: `${url}/broadcast/${notification.id}`,
      data: notification,
      type: 'PATCH',
      contentType: 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      success() {
        dispatcher.dispatch({ type: 'NOTIFICATION_UPDATE', notification });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });

    return this.cards;
  }

  delete(id) {
    $.ajax({
      url: `${url}/broadcast/${id}`,
      type: 'DELETE',
      contentType: 'application/json',
      processData: false,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      success() {
        dispatcher.dispatch({ type: 'NOTIFICATION_DELETE', id });
      },
      error(error) {
        dispatcher.dispatch({ type: 'BRAND_ERROR', error });
      },
    });

    return this.cards;
  }


  getValid() {
    const self = this;
    const currTime = moment().unix();

    // Check Expiry time
    self.notifications = self.notifications.filter(notification => notification.expirytime > currTime);

    // Check if Notifications have already been seen
    const viewedNotifications = JSON.parse(localStorage.getItem('viewedNotifications'));
    if (viewedNotifications) {
      self.notifications = self.notifications.filter(notification => !(viewedNotifications.includes(notification.id)));
    }

    self.notifications = self.notifications.map((notification) => {
      return {
        message: notification.message,
        id: notification.id,
        key: `notification-${notification.id}`,
        expirytime: notification.expirytime,
        action: 'Dismiss',
        dismissAfter: (notification.expirytime - currTime) * 1000,
        onClick: () => this.handleDismiss(notification),
      };
    });
    self.notifications = self.notifications.sort((a, b) => a.expirytime > b.expirytime);
    return self.notifications;
  }

  handleDismiss(notificationParam) {
    const self = this;
    self.notifications = self.notifications.filter(notification => notification.id !== notificationParam.id);

    // Set this notification as viewed so it doesn't appear again
    let viewedNotifications = JSON.parse(localStorage.getItem('viewedNotifications'));
    if (viewedNotifications == null) {
      viewedNotifications = [];
    }
    viewedNotifications.push(notificationParam.id);
    localStorage.setItem('viewedNotifications', JSON.stringify(viewedNotifications));

    dispatcher.dispatch({ type: 'NOTIFICATIONS_GET' });
    return self.notifications;
  }

  handleActions(action) {
    switch (action.type) {
      case 'NOTIFICATIONS_GET': {
        this.emit('received');
        break;
      }
      case 'NOTIFICATION_UPDATE': {
        const entry = this.notifications.find(c => c.id === action.notification.id);
        Object.assign(entry, action.notification);
        this.emit('updateNotifications');
        break;
      }
      case 'NOTIFICATION_ADD': {
        action.notification.id = action.id;
        this.notifications.push(action.notification);
        this.emit('addNotifications');
        break;
      }
      case 'NOTIFICATION_DELETE': {
        const index = this.notifications.findIndex(c => c.id === action.id);
        if (index > -1) {
          this.notifications.splice(index, 1);
        }
        this.emit('deleteNotifications');
        break;
      }
      case 'ERROR': {
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

const notificationStore = new NotificationStore();
dispatcher.register(notificationStore.handleActions.bind(notificationStore));

export default notificationStore;
