import React from "react";

var moment = require('moment');

export default class Events extends React.Component {
  constructor(props) {
    super();
    this.state = {
      apiBaseURL: props.apiBaseURL,
    };
  }

  render() {
    const { name, description, starttime, endtime, location, streamColor } = this.props;
    
    var streamStyle = {
      borderColor: streamColor
    };

    return (
      <div className="event">
        <div className="time" style={streamStyle}>
          <p className="start">{moment.unix(starttime).format("hh:mma")}</p>
          <p className="end">{moment.unix(endtime).format("hh:mma")}</p>
        </div>
        <div className="details">
          <h4 className="title">{name}</h4>
          <p className="location">{location}</p>
        </div>
      </div>
    );
  }
}
