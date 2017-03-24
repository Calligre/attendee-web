import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import NotificationStore from 'stores/NotificationStore';

export default class Notifications extends React.Component {
  constructor() {
    super();
    this.state = {
      notifications: [],
    };

    NotificationStore.getAll();
  }

  componentWillMount() {
    NotificationStore.on('loaded', this.loadNotifications);
    NotificationStore.on('created', this.loadNotifications);
    NotificationStore.on('error', this.showError);
  }

  componentWillUnmount() {
    NotificationStore.removeListener('loaded', this.loadNotifications);
    NotificationStore.removeListener('created', this.loadNotifications);
    NotificationStore.removeListener('error', this.showError);
  }

  loadNotifications = () => {
    this.setState({ notifications: NotificationStore.notifications });
  }

  showError = () => {
    console.error(NotificationStore.error);
  }

  updateNotification = (row) => {
    NotificationStore.update(row);
  }

  addNotification = (row) => {
    NotificationStore.create(row);
  }

  deleteNotification = (row) => {
    row.forEach(id => NotificationStore.delete(id));
  }

  render() {
    const { notifications, disabled } = this.state;

    if (disabled) {
      return (<div> Notifications have been disabled, please check your preferences. </div>);
    }

    const cellEditProp = {
      mode: 'click',
      blueToSave: true,
      afterSaveCell: this.updateNotification,
    };


    const tableOptions = {
      afterInsertRow: this.addNotification,
      afterDeleteRow: this.deleteNotification,
      handleConfirmDeleteRow: removeAlertOnDelete,
    }

    const selectRowProp = {
      mode: 'checkbox',
    };

    return (
      <BootstrapTable
        data={notifications}
        cellEdit={cellEditProp}
        selectRow={selectRowProp}
        insertRow
        deleteRow
        striped
        hover
        options={tableOptions}>
        <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
        <TableHeaderColumn dataField='link' editable={ { validator: requireNotificationLink } }>Notification Link</TableHeaderColumn>
        <TableHeaderColumn dataField='description'>Description</TableHeaderColumn>
        <TableHeaderColumn isKey hidden hiddenOnInsert autoValue dataField='id'>Id</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

function removeAlertOnDelete(next, dropRowKeys) {
  next();
}

function requireNotificationLink(value) {
  const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
  if (!value) {
    response.isValid = false;
    response.notification.type = 'error';
    response.notification.msg = 'A link to a google notification is required';
    response.notification.title = 'Requested Value';
  }
  return response;
}
