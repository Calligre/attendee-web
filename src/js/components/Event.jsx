import React from 'react';

import { IndexLink } from 'react-router';
import SubscribeButton from '../components/SubscribeButton';

const moment = require('moment');

export default class Event extends React.Component {

  render() {
    const { id, name, streamColor, location, starttime, endtime, isSubscribed } = this.props.event;

    const streamStyle = {
      borderColor: streamColor,
    };


    return (
      <div className="eventPageEvent">
        <IndexLink to={{ pathname: `events/${id}` }}>
          <div id={`event-${id}`} className="event">
            <div className="time" style={streamStyle}>
              <p className="start">{moment.unix(starttime).format('hh:mma')}</p>
              <p className="end">{moment.unix(endtime).format('hh:mma')}</p>
            </div>
            <div className="details">
              <h4 className="title">{name}</h4>
              <p className="location">{location}</p>
            </div>
          </div>
        </IndexLink>
        <SubscribeButton id={id} subscribed={isSubscribed} />
      </div>
    );
  }
}

Event.propTypes = {
  event: React.PropTypes.shape({
    id: React.PropTypes.number,
    name: React.PropTypes.string,
    streamColor: React.PropTypes.string,
    isSubscribed: React.PropTypes.bool,
    location: React.PropTypes.string,
    starttime: React.PropTypes.number,
    endtime: React.PropTypes.number,
  }),
};

