import React from "react";

var moment = require('moment');
var $ = require('jquery');

export default class Info extends React.Component {
  constructor() {
    super();

    this.state = {
      logo: "/splash",
      confName: "Loading...",
      location: "Loading...",
      startDate: moment().unix(),
      endDate: moment().unix(),
      other: "Loading...",
      twitter: "Loading...",
      facebook: "Loading...",
    };
  }

  componentDidMount() {
    this.serverRequest = $.get(this.props.route.apiBaseURL + "/info", function (result) {
      this.setState({
        logo: result.data.attributes.logo,
        confName: result.data.attributes.name,
        location: result.data.attributes.location,
        starttime: result.data.attributes.starttime,
        endtime: result.data.attributes.endtime,
        other: result.data.attributes.other,
        twitter: result.data.attributes.twitter,
        facebook: result.data.attributes.facebook,
      });
    }.bind(this));
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }


  render() {
    const {logo, confName, location, starttime, endtime, other, twitter, facebook} = this.state;
    return (
      <div id="conference-info">
        <img class="logo" src={logo} />
        <h3 class="other">{other}</h3>
        <div class="info-container">
          <h1>You're at: {confName}</h1>
          <h2> The location is: {location}</h2>
          <h2> It begins: {moment.unix(starttime).format("ddd MMMM Do YYYY hh:mm")}</h2>
          <h2> and ends: {moment.unix(endtime).format("ddd MMMM Do YYYY hh:mm")}</h2>
          <a href={twitter}> <img src="https://abs.twimg.com/favicons/favicon.ico" /></a>
          <a href={facebook}> <img src="https://www.facebook.com/rsrc.php/yl/r/H3nktOa7ZMg.ico" /></a>
        </div>
      </div>
    );
  }
}

