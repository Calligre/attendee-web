import React from "react";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Select from 'react-select';
import EventStore from "stores/EventStore";
var moment = require('moment');


class StreamEditor extends React.Component {
  constructor(props) {
    super(props);
    this.updateData = this.updateData.bind(this);
    console.log(props);
    this.state = {
      stream: props.defaultValue.stream,
      streams: props.streams,
     };
  }

  focus() {
    console.log("HERE");
    this.refs.inputRef.focus();
  }

  updateData(ev) {
    console.log("UPDATE DATA");
    console.log(ev.target.value);
    // this.props.onUpdate({ stream: ev.target.value });
    this.setState({ stream: ev.currentTarget.value });
  }

  render() {

    const divStyle = {
      zIndex: 20,
    };

    let newthing = this.state.streams.map((opt) => {
      console.log(opt);
      return opt;
    });

    return (
      <span style={divStyle}>
        <select
          ref='inputRef'
          value={ this.state.stream }>
          { this.state.streams.map(opt => (<option key={opt} value={ opt }>{ opt }</option>)) }
        </select>
      </span>
    );
  }
}

/*
      <span>
        <input
          ref='inputRef'
          className={ ( this.props.editorClass || '') + ' form-control editor edit-text' }
          style={ { display: 'inline', width: '50%' } }
          type='text'
          value={ this.state.amount }
          onKeyDown={ this.props.onKeyDown }
          onChange={ (ev) => { this.setState({ amount: parseInt(ev.currentTarget.value, 10) }); } } />

        <button
          className='btn btn-info btn-xs textarea-save-btn'
          onClick={ this.updateData }>
          save
        </button>
      </span>
    );
  }
}
*/




export default class Calendar extends React.Component {

  constructor() {
    super();
    this.state = {
      events: [],
      streams: [],
    };

    EventStore.getAll();
    EventStore.getStreams();
  }

  componentWillMount() {
    EventStore.on("received", this.getEvents);
    EventStore.on('stream', this.getStreams);
    EventStore.on("error", this.showError);
  }

  componentWillUnmount() {
    EventStore.removeListener("received", this.getEvents);
    EventStore.removeListener('stream', this.getStreams);
    EventStore.removeListener("error", this.showError);
  }

  getStreams = () => {
    this.setState({
      streams: EventStore.streams,
    });
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
      mode: 'dbclick',
      blurToSave: true,
      afterSaveCell: this.updateEvent,
    };
    const options = {
      afterInsertRow: this.addEvent,
      afterDeleteRow: this.deleteEvents,
    };

    const dateFormatter = function enumFormatter(cell, row) {
      return moment(cell).format("hh:mma YYYY-MM-DD");
    }

    const createStreamEditor = (onUpdate, props) => (<StreamEditor onUpdate={ onUpdate } {...props} />);

    return (
      <BootstrapTable data={this.state.events} striped hover insertRow deleteRow selectRow={selectRowProp} cellEdit={cellEditProp} options={options}>
        <TableHeaderColumn dataField='id' isKey hidden hiddenOnInsert autoValue>Event ID</TableHeaderColumn>
        <TableHeaderColumn dataField='name' dataSort filter={ { type: 'TextFilter', delay: 100 } }>
          Event Title
        </TableHeaderColumn>
        <TableHeaderColumn dataField='stream' dataSort filter={ { type: 'TextFilter', delay: 100 } }
          customEditor={ { getElement: createStreamEditor, customEditorParameters: { streams: this.state.streams } } }>
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
