import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import EventStore from 'stores/EventStore';
const moment = require('moment');

export default class Calendar extends React.Component {

  constructor() {
    super();
    this.state = {
      events: [],
    };

    EventStore.getAll();
  }

  componentWillMount() {
    EventStore.on('received', this.getEvents);
    EventStore.on('addEvents', this.getEvents);
    EventStore.on('updateEvents', this.getEvents);
    EventStore.on('deleteEvents', this.getEvents);
    EventStore.on('error', this.showError);
  }

  componentWillUnmount() {
    EventStore.removeListener('received', this.getEvents);
    EventStore.removeListener('addEvents', this.getEvents);
    EventStore.removeListener('updateEvents', this.getEvents);
    EventStore.removeListener('deleteEvents', this.getEvents);
    EventStore.removeListener('error', this.showError);
  }

  showError = () => {
    console.log(EventStore.error);
  }

  generateEvent = (row) => {
    const updatedEvent = {
      id: -1,
      name: '',
      location: '',
      stream: '',
      starttime: '',
      endtime: '',
    };
    for (const prop in row) {
      updatedEvent[prop] = row[prop];
    }
    return updatedEvent;
  }


  updateEvent = (row, cellName, cellValue) => {
    EventStore.updateEvent(this.generateEvent(row));
  }

  addEvent = (row) => {
    EventStore.addEvent(this.generateEvent(row));
  }

  deleteEvents = (rowKeys) => {
    for (const key in rowKeys) {
      EventStore.deleteEvent(rowKeys[key]);
    }
  }

  getEvents = () => {
    this.setState({
      events: EventStore.events,
    });
  }

  insertModal = (columns, validateState, ignoreEditable) => (<InsertModalBody columns={columns} validateState={validateState} ignoreEditable={ignoreEditable} />)

  formatDate = (cell) => {
    const format = 'MMM Do hh:mm a';
    return moment.unix(cell).format(format);
  }

  render() {
    const selectRowProp = {
      mode: 'checkbox',
    };
    const cellEditProp = {
      mode: 'click',
      afterSaveCell: this.updateEvent,
    };
    const options = {
      afterInsertRow: this.addEvent,
      afterDeleteRow: this.deleteEvents,
      insertModalBody: this.insertModal,
      handleConfirmDeleteRow: this.removeAlertOnDelete,
      defaultSortName: 'starttime',
      defaultSortOrder: 'asc',
    };

    const timeEditor = (onUpdate, props) => (<TimeEditor onUpdate={onUpdate} {...props} />);

    return (
      <div>
        <h1 className="primaryText">Calendar</h1>
        <BootstrapTable data={this.state.events} striped hover insertRow deleteRow selectRow={selectRowProp} cellEdit={cellEditProp} options={options}>
          <TableHeaderColumn dataField="id" isKey hidden hiddenOnInsert autoValue>Event ID</TableHeaderColumn>
          <TableHeaderColumn dataField="name" dataSort filter={{ type: 'TextFilter', delay: 100 }}>
            Event Title
          </TableHeaderColumn>
          <TableHeaderColumn dataField="stream" dataSort filter={{ type: 'TextFilter', delay: 100 }}>
            Stream
          </TableHeaderColumn>
          <TableHeaderColumn dataField="location" dataSort filter={{ type: 'TextFilter', delay: 100 }}>
            Location
          </TableHeaderColumn>
          <TableHeaderColumn dataField="starttime" dataSort dataFormat={this.formatDate} customEditor={{ getElement: timeEditor }}>
            Start time
          </TableHeaderColumn>
          <TableHeaderColumn dataField="endtime" dataSort dataFormat={this.formatDate} customEditor={{ getElement: timeEditor }}>
            End time
          </TableHeaderColumn>
          <TableHeaderColumn dataField="description">Description</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}

function removeAlertOnDelete(next) {
  next();
}


class TimeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: moment.unix(props.defaultValue).format('YYYY-MM-DDTHH:mm') };
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
      name: this.refs.name.value,
      stream: this.refs.stream.value,
      location: this.refs.location.value,
      starttime: moment(this.refs.starttime.value, 'YYYY-MM-DDTHH:mm').valueOf(),
      endtime: moment(this.refs.endtime.value, 'YYYY-MM-DDTHH:mm').valueOf(),
      description: this.refs.description.value,
      id: moment(),
    };
    return newRow;
  }

  render() {
    return (
      <div className="modal-body">
        <div>
          <div className="form-group" key="name">
            <label>Name</label>
            <input
              ref="name"
              type="text"
              className="form-control editor edit-text"
            />
          </div>
          <div className="form-group" key="stream">
            <label>Stream</label>
            <input
              ref="stream"
              type="text"
              className="form-control editor edit-text"
            />
          </div>
          <div className="form-group" key="location">
            <label>Location</label>
            <input
              ref="location"
              type="text"
              className="form-control editor edit-text"
            />
          </div>
          <div className="form-group" key="starttime">
            <label>Start Time</label>
            <input
              ref="starttime"
              type="datetime-local"
              className="form-control editor edit-text"
            />
          </div>
          <div className="form-group" key="endtime">
            <label>End Time</label>
            <input
              ref="endtime"
              type="datetime-local"
              className="form-control editor edit-text"
            />
          </div>
          <div className="form-group" key="description">
            <label>Description</label>
            <input
              ref="description"
              type="text"
              className="form-control editor edit-text"
            />
          </div>
        </div>
      </div>
    );
  }
}
