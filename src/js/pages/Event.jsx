import React from 'react';

import EventStore from '../stores/EventStore';
import SubscribeButton from '../components/SubscribeButton';


const moment = require('moment');

export default class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = { event: undefined };

    EventStore.get(this.props.params.eventId);
  }

  componentWillMount() {
    EventStore.on('received', this.getEvent);
    EventStore.on('subscription', this.getEvent);
    EventStore.on('error', this.showError);
  }

  componentWillUnmount() {
    EventStore.removeListener('received', this.getEvent);
    EventStore.removeListener('subscription', this.getEvent);
    EventStore.removeListener('error', this.showError);
  }

  getEvent = () => {
    const id = this.props.params.eventId;
    const event = EventStore.events.filter(e => e.id === id)[0];
    this.setState({
      event,
    });
  }


  showError() {
    console.log(EventStore.error);
  }

  render() {
    if (typeof this.state.event === 'undefined') {
      return (<div />);
    }

    const { event } = this.state;
    const { id, name, description, streamColor, isSubscribed, location, starttime, endtime } = event;


    const streamStyle = {
      borderColor: streamColor,
    };

    return (
      <div id={`event-${id}`} className="event-item">
        <div className="nameContainer" style={streamStyle}>
          <div className="dates">
            <div className="date">{moment.unix(starttime).format('h:mm a')}</div>
            <div className="date">{moment.unix(endtime).format('h:mm a')}</div>
          </div>
          <h1>{name}</h1>
          <SubscribeButton className="isSubscribed" id={this.state.event.id} subscribed={isSubscribed} />
        </div>
        <div className="info">
          <h2 className="location">{location}</h2>
          <div className="description">{description}</div>
        </div>
      </div>
    );
  }
}

Event.propTypes = {
  params: React.PropTypes.shape({
    eventId: React.PropTypes.number.isRequired,
  }),
};
