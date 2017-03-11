import React from "react";

import SearchInput, {createFilter} from 'react-search-input';
import { DateField, TransitionView, Calendar } from 'react-date-picker'
import Select from 'react-select';
import Event from "components/Event";
import EventStore from "stores/EventStore";

require('!style!css!sass!react-date-picker/index.css');

var moment = require('moment');


export default class Events extends React.Component {
	constructor(props) {
		super(props);
    this.getEvents = this.getEvents.bind(this);
		this.getStreams = this.getStreams.bind(this);
    this.searchUpdated = this.searchUpdated.bind(this);

		this.state = {
      events: [],
      streams: [],
      searchTerm: '',
      filterTerms: {
        startDate: moment.now(),
        stream: [],
      }
    };
		EventStore.getAll();
    EventStore.getStreams();
	}

  componentWillMount() {
    EventStore.on("received", this.getEvents);
    EventStore.on("stream", this.getStreams);
    EventStore.on("error", this.showError);
  }

  componentWillUnmount() {
    EventStore.removeListener("received", this.getEvents);
    EventStore.removeListener("error", this.showError);
  }

	getEvents() {
		this.setState({
			events: EventStore.events
    });
  }

  getStreams() {
    this.setState({
      streams: EventStore.streams,
    });
  }

  searchUpdated (term) {
    this.setState({
      searchTerm: term
    })
  }

  filterTimeUpdated = (dateString, data) => {
    var filter = this.state.filterTerms;
    filter['startDate'] = data.dateMoment;
    this.setState({
      filterTerms: filter
    });
  }

  filterStreamUpdated = (data) => {
    var filter = this.state.filterTerms;
    filter['stream'] = (data.length === 0) ? [] : data.split(',');
    this.setState({
      filterTerms: filter
    });
  }

  showError(){
    console.log(EventStore.error)
  }

  render() {
    const { events, searchTerm, filterTerms, streams } = this.state;

    // filtering
    var self = this;
    var filteredEvents = events.filter(createFilter(searchTerm, ['name']));
    filteredEvents = filteredEvents.filter((event) => {
      if(filterTerms['stream'].length > 0 && !filterTerms['stream'].includes(event['stream'])) return false;
      if(moment.unix(event.starttime).isAfter(filterTerms['startDate'])) return false;

      return true;
    });

    // sorting
    const sortedEvents = filteredEvents.sort((a, b) => {
      if(a.starttime == b.starttime){
        if(a.endtime == b.endtime) {
          return a.name < b.name ? -1 : 1;
        }
        return a.endtime < b.endtime ? -1 : 1;
      }
      return a.starttime < b.starttime ? -1 : 1;
    });

    // options
    const streamOptions = (!streams) ? []
      : streams.map(function(stream) {
        return {
          value: stream,
          label: stream,
        };
      }) ;


    const EventComponents = sortedEvents.map((event) => {
        return <Event key={event.id} {...event}/>;
    });

    var format = "YYYY-MM-DD HH:mm";
    var date = moment().format(format);

    return (
      <div>
        <h1>Events</h1>
        <SearchInput className="Select-control search-input" onChange={this.searchUpdated} placeholder="Search for events"/>
        <Select multi simpleValue className="searchBar" value={this.state.filterTerms["stream"]} placeholder="Filter by Stream:" options={streamOptions} onChange={this.filterStreamUpdated} />
        <DateField forceValidDate defaultValue={date} dateFormat={format} onChange={this.filterTimeUpdated} >
          <TransitionView>
            <Calendar style={{padding: 10}}/>
          </TransitionView>
        </DateField>
        <div className="eventsContainer">
          {EventComponents}
        </div>
      </div>
    );
  }
}
