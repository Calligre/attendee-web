import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import NotificationStore from 'stores/NotificationStore';

const moment = require('moment');


export default class Notifications extends React.Component {
  constructor() {
    super();
    this.state = {
      notifications: [],
    };

    NotificationStore.getAll();
  }

  componentWillMount() {
    NotificationStore.on('received', this.loadNotifications);
    NotificationStore.on('created', this.loadNotifications);
    NotificationStore.on('addNotifications', this.loadNotifications);
    NotificationStore.on('deleteNotifications', this.loadNotifications);
    NotificationStore.on('updateNotifications', this.loadNotifications);
    NotificationStore.on('error', this.showError);
  }

  componentWillUnmount() {
    NotificationStore.removeListener('received', this.loadNotifications);
    NotificationStore.removeListener('created', this.loadNotifications);
    NotificationStore.removeListener('addNotifications', this.loadNotifications);
    NotificationStore.removeListener('deleteNotifications', this.loadNotifications);
    NotificationStore.removeListener('updateNotifications', this.loadNotifications);
    NotificationStore.removeListener('error', this.showError);
  }

  loadNotifications = () => {
    this.setState({ notifications: NotificationStore.notifications });
  }

  showError = () => {
    console.error(NotificationStore.error);
  }

  updateNotification = (row) => {
    NotificationStore.update(data);
  }

  addNotification = (row) => {
    NotificationStore.add(row);
  }

  deleteNotification = (row) => {
    row.forEach(id => NotificationStore.delete(id));
  }

  formatExpiry = (cell) => {
    const format = 'MMM DD, YYYY hh:mm a';
    return moment(cell).format(format);
  }

  insertModal = (columns, validateState, ignoreEditable) => {
    return (<InsertModalBody columns={columns} validateState={validateState} ignoreEditable={ignoreEditable} />);
  }

  trClassFormat = (row) => {
    const temp = moment().diff(moment(row.expirytime));
    return temp > 0 ? "tr-expired" : null;  // return class name.
  }

  render() {
    const { notifications } = this.state;

    const cellEditProp = {
      mode: 'click',
      blueToSave: true,
      afterSaveCell: this.updateNotification,
    };


    const tableOptions = {
      afterInsertRow: this.addNotification,
      afterDeleteRow: this.deleteNotification,
      handleConfirmDeleteRow: this.removeAlertOnDelete,
      insertModalBody: this.insertModal,
      defaultSortName: 'expirytime',
      defaultSortOrder: 'desc',

    };

    const selectRowProp = {
      mode: 'checkbox',
    };

    const timeEditor = (onUpdate, props) => (<TimeEditor onUpdate={onUpdate} {...props} />);


    return (
      <BootstrapTable
        data={notifications}
        cellEdit={cellEditProp}
        selectRow={selectRowProp}
        insertRow
        deleteRow
        hover
        options={tableOptions}
        trClassName={ this.trClassFormat }
        id="notification-table"
      >
        <TableHeaderColumn dataField="message">Message</TableHeaderColumn>
        <TableHeaderColumn dataField="expirytime" customEditor={{ getElement: timeEditor }} dataFormat={this.formatExpiry}>Expiration Time</TableHeaderColumn>
        <TableHeaderColumn isKey hidden hiddenOnInsert autoValue dataField="id">Id</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

function removeAlertOnDelete(next) {
  next();
}

class TimeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: moment(props.defaultValue).format('YYYY-MM-DDTHH:mm') };
  }
  focus() {
    this.refs.inputRef.focus();
  }
  render() {
    return (
      <span>
        <input
          ref="inputRef"
          type="datetime-local"
          value={this.state.value}
          onKeyDown={this.props.onKeyDown}
          onChange={(ev) => { this.setState({ value: ev.currentTarget.value }); }}
        />
      </span>
    );
  }
}

class InsertModalBody extends React.Component {
  getFieldValue() {
    const newRow = {
      expirytime: moment(this.refs.expirytime.value, 'YYYY-MM-DDTHH:mm').valueOf(),
      message: this.refs.message.value,
      id: moment(),
    };
    return newRow;
  }

  render() {
    return (
      <div className="modal-body">
        <div>
         <div className="form-group" key="message">
            <label>Message</label>
            <input
              ref="message"
              type="text"
              className="form-control editor edit-text"
            />
        </div>
         <div className="form-group" key="expirytime">
            <label>Expiration Time</label>
            <input
              ref="expirytime"
              type="datetime-local"
              className="form-control editor edit-text"
            />
          </div>
        </div>
      </div>
    );
  }
}
