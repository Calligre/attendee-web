import React from "react";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import EventStore from "stores/EventStore";
var moment = require('moment');

export default class Calendar extends React.Component {


  constructor() {
    super();
    this.getEvents = this.getEvents.bind(this);
    this.updateEvents = this.updateEvents.bind(this);
    this.state = {
      events: [],
    };

    EventStore.getAll();
  }

  componentWillMount() {
    EventStore.on("received", this.getEvents);
  }

  componentWillUnmount() {
    EventStore.removeListener("received", this.getEvents);
  }

  updateEvents(row, cellName, cellValue) {
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
    EventStore.updateEvent(updatedEvent);
  }

  getEvents() {
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
      afterSaveCell: this.updateEvents,
    };

    const dateFormatter = function enumFormatter(cell, row) {
      return moment(cell).format("hh:mma YYYY-MM-DD");
    }

    return (
	  <BootstrapTable data={this.state.events} striped hover deleteRow selectRow={selectRowProp} cellEdit={cellEditProp}>
        <TableHeaderColumn dataField='id' isKey>Event ID</TableHeaderColumn>
        <TableHeaderColumn dataField='name' dataSort filter={ { type: 'TextFilter', delay: 100 } }>
          Event Title
        </TableHeaderColumn>
        <TableHeaderColumn dataField='stream' dataSort filter={ { type: 'TextFilter', delay: 1000 } }>
          Stream
        </TableHeaderColumn>
        <TableHeaderColumn dataField='location' datasort filter={ { type: 'TextFilter', delay: 1000 } }>
          Location
        </TableHeaderColumn>
        <TableHeaderColumn dataField='starttime' datasort dataFormat={ dateFormatter } editable={ { type: 'datetime' } }>
          Start time
        </TableHeaderColumn>
        <TableHeaderColumn dataField='endtime' datasort dataFormat={ dateFormatter } editable={ { type: 'datetime' } }>
          End time
        </TableHeaderColumn>
      </BootstrapTable>
    );
  }

}
