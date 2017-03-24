import React from 'react';
import Event from 'components/Event';

import Clear from 'react-icons/lib/fa/times-circle';

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = { type: props.type };
  }

  render() {
    let renderedContent = '';

    const { item } = this.props;
    const { type } = this.state;

    let buttonStyle = this.props.buttonStyle || {};
    let headerStyle = this.props.headerStyle || {};

    switch (type) {
      case 'event':
        renderedContent = <Event key={item.id} {...item} />;
        break;
      case 'content':
        renderedContent = <div className="contentCard cardContent">{item}</div>;
        break;
      case 'sponsor':
        renderedContent = <SponsorCard data={item} headerStyle={headerStyle}/>;
        break;
      case 'contact':
        renderedContent = <ContactCard data={item} headerStyle={headerStyle}/>;
        break;
      case 'location':
        renderedContent = <LocationCard data={item} headerStyle={headerStyle} buttonStyle={buttonStyle}/>;
        break;
      case 'download':
        renderedContent = <DownloadCard data={item} headerStyle={headerStyle} buttonStyle={buttonStyle}/>;
        break;
      case 'social':
        let facebook = this.props.facebook || null;
        let twitter = this.props.twitter || null;
        renderedContent = <SocialCard facebook={facebook} twitter={twitter} headerStyle={headerStyle}/>;
        break;
      case 'survey':
        renderedContent = <SurveyCard data={item} headerStyle={headerStyle} buttonStyle={buttonStyle}/>;
        break;
      default:
        return null;
    }

    return (
      <div className="card">
        {renderedContent}
      </div>
    );
  }; 
}

var ContactCard = React.createClass({
  render: function() {
    var contactNodes = this.props.data.map(function(contact) {
      return (
        <div className="contact" key={contact.id}>
          <h3>{contact.name}</h3>
          <p>{contact.phone}</p>
        </div>
      );
    });
    return (
      <div className="contactCard cardContent">
        <h2 className="primaryText" style={this.props.headerStyle}>Important Contacts</h2>
        {contactNodes}
      </div>
    );
  }
});

var LocationCard = React.createClass({
  render: function() {
    var locationNodes = this.props.data.map(function(confLocation) {
      return (
        <div className="location" key={confLocation.id}>
          <h3>{confLocation.name}</h3>
          <p>{confLocation.address}</p>
        </div>
      );
    });
    return (
      <div className="locationCard cardContent">
        <h2 className="primaryText" style={this.props.headerStyle}>Locations</h2>
        {locationNodes}
      </div>
    );
  }
});

var DownloadCard = React.createClass({
  render: function() {
    return (
      <div className="downloadCard cardContent">
        <h2 className="primaryText" style={this.props.headerStyle}>{this.props.data.name}</h2>
        <a href={this.props.data.link} download>
          <button className="secondaryBackground" style={this.props.buttonStyle}>Download</button>
        </a>
      </div>
    );
  }
});

var SocialCard = React.createClass({
  render: function() {
    let facebookLink = null;
    let twitterLink = null;
    if (this.props.facebook) {
      facebookLink = <a href={this.props.facebook} className="socialLink"><img src="https://cdn4.iconfinder.com/data/icons/social-media-2110/64/Facebook-01-128.png"/> </a>;
    }
    if (this.props.twitter) {
      twitterLink = <a href={this.props.twitter} className="socialLink"><img src="https://cdn4.iconfinder.com/data/icons/social-media-2110/64/Twitter-01-128.png"/> </a>;
    }
    return (
      <div className="socialCard cardContent">
        <h2 className="primaryText" style={this.props.headerStyle}>Connect With Us</h2>
        {facebookLink}
        {twitterLink}
      </div>
    );
  }
});

var SurveyCard = React.createClass({
  render: function() {
    return (
      <div className="surveyCard cardContent">
        <h2 className="primaryText" style={this.props.headerStyle}>{this.props.data.name}</h2>
        <p>{this.props.data.description}</p>
        <a href={this.props.data.link} target="_blank">
          <button className="secondaryBackground" style={this.props.buttonStyle}>Take Survey</button>
        </a>
      </div>
    );
  }
});

var SponsorCard = React.createClass({
  render: function() {
    let sponsors = this.props.data.map(sponsor =>
        <div className="sponsorContainer">
          <a href={sponsor.website}>
            <img src={sponsor.logo}/>
          </a>
          <h3>{sponsor.name}</h3>
        </div>
    );
    return (
      <div className="sponsorCard cardContent">
        <h2 className="primaryText" style={this.props.headerStyle}>{this.props.data[0].level} Sponsors</h2>
        {sponsors}
      </div>
    );
  }
});

