import { EventEmitter } from 'events';
import AjaxService from 'util/AjaxService';

import dispatcher from 'dispatcher';

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
    AjaxService.get({
      endpoint: 'broadcast',
      success(response) {
        dispatcher.dispatch({ type: 'NOTIFICATIONS_GET', notifications: response.data });
      },
      error(error) {
        dispatcher.dispatch({type: "NOTIFICATION_ERROR", error: error.error});
      }
    return self.notifications;
  }

  add(notification) {
    AjaxService.create({
      endpoint: 'broadcast',
      data: formatValues(notification),
      success(response) {
        dispatcher.dispatch({ type: 'NOTIFICATION_ADD', notification, id: response.data.id });
      },
      error(error) {
        dispatcher.dispatch({ type: 'NOTIFICATION_ERROR', error: error.error });
      },
    });
    return this.notifications;
  }


  update(notification) {
    AjaxService.update({
      endpoint: 'broadcast',
      data: formatValues(notification),
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
    AjaxService.delete({
      endpoint: 'broadcast',
      id,
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
    self.notifications = self.notifications.sort((a, b) => {
      return a.expirytime > b.expirytime;
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
        this.notifications = action.notifications.map((notification) => {
          return notification.attributes;
        });
        this.emit('received');
        break;
      }
      case 'NOTIFICATION_UPDATE': {
        const entry = this.notifications.find(c => c.id === action.notification.id);
        Object.assign(entry, formatData(action.notification));
        this.emit('updateNotifications');
        break;
      }
      case 'NOTIFICATION_ADD': {
        action.notification.id = action.id;
        this.notifications.push(formatData(action.notification));
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
      case 'NOTIFICATION_ERROR': {
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
