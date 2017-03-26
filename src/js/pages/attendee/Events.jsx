import React from 'react';

import SearchInput, { createFilter } from 'react-search-input';
import Input from 'react-toolbox/lib/input';
import Checkbox from 'react-toolbox/lib/checkbox';
import Switch from 'react-toolbox/lib/switch';
import Select from 'react-select';
import Event from 'components/Event';
import EventStore from 'stores/EventStore';

require('!style!css!sass!react-date-picker/index.css');

const moment = require('moment');


export default class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      streams: [],
      searchTerm: '',
      filterTerms: {
        startDate: null,
        endDate: null,
        stream: [],
        myCalendar: false,
      },
    };
    EventStore.getAll();
    EventStore.getStreams();
  }

  componentWillMount() {
    EventStore.on('received', this.getEvents);
    EventStore.on('stream', this.getStreams);
    EventStore.on('error', this.showError);
  }

  componentWillUnmount() {
    EventStore.removeListener('received', this.getEvents);
    EventStore.removeListener('error', this.showError);
  }

  getEvents = () => {
    this.setState({
      events: EventStore.events,
    });
  }

  getStreams = () => {
    this.setState({
      streams: EventStore.streams,
    });
  }

  enableDateFilter = (name, value) => {
    this.setState({ [name] : value });
  }

  searchUpdated = (term) => {
    this.setState({
      searchTerm: term,
    });
  }

  filterTermUpdated = (name, value) => {
    const filter = this.state.filterTerms;
    filter[name] = value;
    this.setState({
      filterTerms: filter,
    });
  }

  filterStreamUpdated = (data) => {
    const filter = this.state.filterTerms;
    filter.stream = (data.length === 0) ? [] : data.split(',');
    this.setState({
      filterTerms: filter,
    });
  }

  showError() {
    console.error(EventStore.error);
  }

  render() {
    const { events, searchTerm, filterTerms, streams, startDateEnabled, endDateEnabled } = this.state;

    // filtering
    let filteredEvents = events.filter(createFilter(searchTerm, ['name']));
    filteredEvents = filteredEvents.filter((event) => {
      if (filterTerms.myCalendar && !event.isSubscribed) {
        return false;
      }
      if (filterTerms.stream.length > 0 && !filterTerms.stream.includes(event.stream)) {
        return false;
      }
      if (startDateEnabled && moment.unix(event.starttime).isBefore(moment(filterTerms.startDate))) {
        return false;
      }
      if (endDateEnabled && moment.unix(event.endtime).isAfter(moment(filterTerms.endDate))) {
        return false;
      }

      return true;
    });

    // sorting
    const sortedEvents = filteredEvents.sort((a, b) => {
      if (a.starttime === b.starttime) {
        if (a.endtime === b.endtime) {
          return a.name < b.name ? -1 : 1;
        }
        return a.endtime < b.endtime ? -1 : 1;
      }
      return a.starttime < b.starttime ? -1 : 1;
    });

    // options
    const streamOptions = (!streams) ? []
      : streams.map(stream => ({ value: stream, label: stream }));


    const EventComponents = sortedEvents.map(event => <Event key={event.id} {...event} />);

    return (
      <div>
        <h1 className="primaryText">Events</h1>
        <SearchInput
          className="Select-control search-input"
          onChange={this.searchUpdated}
          placeholder="Search for events"
        />
        <Select
          multi
          simpleValue
          className="searchBar"
          value={this.state.filterTerms.stream}
          placeholder="Filter by Stream:"
          options={streamOptions}
          onChange={this.filterStreamUpdated}
        />
        <div className="dateFilter">
          <Checkbox
            checked={startDateEnabled}
            label="Events that start after"
            onChange={this.enableDateFilter.bind(this, 'startDateEnabled')}/>
          <Input
            type="datetime-local"
            value={filterTerms.startDate}
            onChange={this.filterTermUpdated.bind(this, 'startDate')}
            disabled={!startDateEnabled}/>
        </div>
        <div className="dateFilter">
          <Checkbox
            checked={endDateEnabled}
            label="Events that end before"
            onChange={this.enableDateFilter.bind(this, 'endDateEnabled')}/>
          <Input
            type="datetime-local"
            value={filterTerms.endDate}
            onChange={this.filterTermUpdated.bind(this, 'endDate')}
            disabled={!endDateEnabled}/>
        </div>
        <Switch
          checked={filterTerms.myCalendar}
          label="Show only my calendar"
          onChange={this.filterTermUpdated.bind(this, 'myCalendar')}/>
        <div className="eventsContainer">
          {EventComponents}
        </div>
      </div>
    );
  }
}
