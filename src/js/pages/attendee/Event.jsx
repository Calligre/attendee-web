import React from 'react';

import EventStore from 'stores/EventStore';
import SubscribeButton from 'components/SubscribeButton';


const moment = require('moment');

export default class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = { event: undefined };

    EventStore.getAll();
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

  componentDidUpdate(prevProps, prevState) {
    let oldId = -1;
    let newId = -1;
    if (prevProps.params.hasOwnProperty('eventId')) {
      oldId = prevProps.params.eventId;
    }
    if (this.props.params.hasOwnProperty('eventId')) {
      newId = this.props.params.eventId;
    }
    if (oldId != newId) {
      this.getEvent();
    }
  }

  getEvent = () => {
    const id = parseInt(this.props.params.eventId);
    const event = EventStore.events.filter(e => e.id === id)[0];
    this.setState({
      event,
    });
  }


  showError() {
    console.error(EventStore.error);
  }

  render() {
    if (typeof this.state.event === 'undefined') {
      return (<div />);
    }

    const { event } = this.state;
    const {
      id,
      name,
      description,
      streamColor,
      isSubscribed,
      location,
      starttime,
      endtime,
    } = event;


    const streamStyle = {
      borderColor: streamColor,
    };

    return (
      <div id={`event-${id}`} className="event-item">
        <div className="nameContainer" style={streamStyle}>
          <div className="header">
            <div className="dates">
              <h4 className="date outlined">{moment.unix(starttime).format('MMM Do')}</h4>
              <h4 className="date outlined">{moment.unix(starttime).format('h:mm a')}</h4>
              <h4 className="date outlined">{moment.unix(endtime).format('h:mm a')}</h4>
            </div>
            <h1 className="primaryText outlined">{name}</h1>
          </div>
          <SubscribeButton className="isSubscribed" id={this.state.event.id} subscribed={isSubscribed} />
        </div>
        <div className="info">
          <div id="avoidSubscribeButton" />
          <h2 className="secondaryText location">{location}</h2>
          <div className="description">{description}</div>
        </div>
      </div>
    );
  }
}
Event.propTypes = {
  params: React.PropTypes.shape({
    eventId: React.PropTypes.string,
  }),
};
