import React from "react";

import SearchInput, {createFilter} from 'react-search-input';
import { DateField, TransitionView, Calendar } from 'react-date-picker'
import Select from 'react-select';
import Event from "../components/Event";
import EventStore from "../stores/EventStore";

require('!style!css!sass!react-date-picker/index.css');

var moment = require('moment');


export default class Events extends React.Component {
	constructor(props) {
		super(props);
		this.getEvents = this.getEvents.bind(this);
    this.searchUpdated = this.searchUpdated.bind(this);
    this.timeUpdated = this.filterUpdated.bind(this, 'startDate');

		this.state = { events: [], searchTerm: '', filterTerms: this.props.location.query};
		EventStore.getAll()
	}

  componentWillMount() {
    EventStore.on("received", this.getEvents);
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

  searchUpdated (term) {
    this.setState({
      searchTerm: term
    })
  }

  filterUpdated(key, dateString, data) {
    var filter = this.state.filterTerms;
    filter[key] = data.dateMoment;
    this.setState({
      filterTerms: filter
    });
  }

  showError(){
    console.log(EventStore.error)
  }

  render() {
    const { events, searchTerm, filterTerms } = this.state;


    var self = this;
    var filteredEvents = events.filter(createFilter(searchTerm, ['name']));
    filteredEvents = filteredEvents.filter((event) => {
      if(typeof filterTerms['stream'] != 'undefined' && event['stream'] != filterTerms['stream']) return false;
      if(typeof filterTerms['startDate'] != 'undefined' && moment.unix(event.starttime).format("MM-DD h:mm a") < filterTerms['startDate']) return false;

      return true;
    });


    const sortedEvents = filteredEvents.sort((a, b) => {
      if(a.starttime == b.starttime){
        if(a.endtime == b.endtime) {
          return a.name < b.name ? -1 : 1;
        }
        return a.endtime < b.endtime ? -1 : 1;
      }
      return a.starttime < b.starttime ? -1 : 1;
    });

    const EventComponents = sortedEvents.map((event) => {
        return <Event key={event.id} {...event}/>;
    });

    var format = "YYYY-MM-DD HH:mm";
    var date = moment().format(format);

    return (
      <div>
        <h1>Events</h1>
        <SearchInput className="Select-control search-input" onChange={this.searchUpdated} placeholder="Search for events"/>
        <DateField forceValidDate defaultValue={date} dateFormat={format} onChange={this.timeUpdated} >
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
