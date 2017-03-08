import AuthService from 'util/AuthService';
import React from 'react';

const moment = require('moment');
const $ = require('jquery');

export default class Info extends React.Component {
  constructor() {
    super();

    this.state = {
      logo: '',
      conf_name: 'Loading...',
      location: 'Loading...',
      startDate: moment().unix(),
      endDate: moment().unix(),
      other: 'Loading...',
      twitter: 'Loading...',
      facebook: 'Loading...',
    };
  }

  componentDidMount() {
    const self = this;
    $.ajax({
      url: `${this.props.route.apiBaseURL}/info`,
      dataType: 'json',
      type: 'GET',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },

      cache: true,
      success(response) {
        self.setState({
          logo: response.data.attributes.logo,
          conf_name: response.data.attributes.name,
          location: response.data.attributes.location,
          starttime: response.data.attributes.starttime,
          endtime: response.data.attributes.endtime,
          other: response.data.attributes.other,
          twitter: response.data.attributes.twitter,
          facebook: response.data.attributes.facebook,
        });
      },
    });
  }

  render() {
    const { logo, conf_name, location, starttime, endtime, other, twitter, facebook } = this.state;
    return (
      <div id="conference-info">
        <img className="logo" alt="Logo" src={logo} />
        <h3 className="other">{other}</h3>
        <div className="info-container">
          <h1>You're at: {conf_name}</h1>
          <h2> The location is: {location}</h2>
          <h2> It begins: {moment.unix(starttime).format('ddd MMMM Do YYYY hh:mm')}</h2>
          <h2> and ends: {moment.unix(endtime).format('ddd MMMM Do YYYY hh:mm')}</h2>
          <a href={twitter}> <img alt="Twitter" src="https://abs.twimg.com/favicons/favicon.ico" /></a>
          <a href={facebook}> <img alt="Facebook" src="https://www.facebook.com/rsrc.php/yl/r/H3nktOa7ZMg.ico" /></a>
        </div>
      </div>
    );
  }
}

