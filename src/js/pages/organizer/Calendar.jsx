import React from "react";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import EventStore from "stores/EventStore";
var moment = require('moment');

export default class Calendar extends React.Component {

  constructor() {
    super();
    this.state = {
      events: [],
    };

    EventStore.getAll();
  }

  componentWillMount() {
    EventStore.on("received", this.getEvents);
    EventStore.on("error", this.showError);
  }

  componentWillUnmount() {
    EventStore.removeListener("received", this.getEvents);
    EventStore.removeListener("error", this.showError);
  }

  showError = () => {
    console.log(EventStore.error)
  }

  generateEvent = (row) => {
    var updatedEvent = {
      id: -1,
      name: "",
      location: "",
      stream: "",
      starttime: "",
      endttime: "",
    }
    for (const prop in row) {
      if (prop == "starttime" || prop == "endtime") {
        updatedEvent[prop] = moment(row[prop]).unix();
      } else {
        updatedEvent[prop] = row[prop];
      }
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
      EventStore.deleteEvent(rowKeys[key])
    }
  }

  getEvents = () => {
    this.setState({
      events: EventStore.events.map((event) => {
        event.starttime = moment.unix(event.starttime).format("YYYY-MM-DDTHH:mm");
        event.endtime = moment.unix(event.endtime).format("YYYY-MM-DDTHH:mm");
        return event;
      })
    });
  }

  render() {
    const selectRowProp = {
      mode: 'checkbox'
    };
    const cellEditProp = {
      mode: 'click',
      afterSaveCell: this.updateEvent,
    };
    const options = {
      afterInsertRow: this.addEvent,
      afterDeleteRow: this.deleteEvents,
    };

    const dateFormatter = function enumFormatter(cell, row) {
      return moment(cell).format("hh:mma YYYY-MM-DD");
    }

    return (
      <BootstrapTable data={this.state.events} striped hover insertRow deleteRow selectRow={selectRowProp} cellEdit={cellEditProp} options={options}>
        <TableHeaderColumn dataField='id' isKey hidden hiddenOnInsert autoValue>Event ID</TableHeaderColumn>
        <TableHeaderColumn dataField='name' dataSort filter={ { type: 'TextFilter', delay: 100 } }>
          Event Title
        </TableHeaderColumn>
        <TableHeaderColumn dataField='stream' dataSort filter={ { type: 'TextFilter', delay: 100 } }>
          Stream
        </TableHeaderColumn>
        <TableHeaderColumn dataField='location' dataSort filter={ { type: 'TextFilter', delay: 100 } }>
          Location
        </TableHeaderColumn>
        <TableHeaderColumn dataField='starttime' dataSort dataFormat={ dateFormatter } editable={ { type: 'datetime' } }>
          Start time
        </TableHeaderColumn>
        <TableHeaderColumn dataField='endtime' dataSort dataFormat={ dateFormatter } editable={ { type: 'datetime' } }>
          End time
        </TableHeaderColumn>
        <TableHeaderColumn dataField='description'>Description</TableHeaderColumn>
      </BootstrapTable>
    );
  }

}
