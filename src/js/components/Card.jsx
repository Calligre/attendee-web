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

    switch (type) {
      case 'event':
        renderedContent = <Event key={item.id} {...item} />;
        break;
      case 'content':
        renderedContent = <div className="contentCard cardContent">{item}</div>;
        break;
      case 'contact':
        renderedContent = <ContactCard data={item} />;
        break;
      case 'location':
        renderedContent = <LocationCard data={item} />;
        break;
      case 'download':
        renderedContent = <DownloadCard data={item} />;
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
        <div className="contact">
          <h3>{contact.name}</h3>
          <p>{contact.phone}</p>
        </div>
      );
    });
    return (
      <div className="contactCard cardContent">
        <h2 className="primaryText">Important Contacts</h2>
        {contactNodes}
      </div>
    );
  }
});

var LocationCard = React.createClass({
  render: function() {
    var locationNodes = this.props.data.map(function(confLocation) {
      return (
        <div className="location">
          <h3>{confLocation.name}</h3>
          <p>{confLocation.address}</p>
        </div>
      );
    });
    return (
      <div className="locationCard cardContent">
        <h2 className="primaryText">Locations</h2>
        {locationNodes}
      </div>
    );
  }
});

var DownloadCard = React.createClass({
  render: function() {
    return (
      <div className="downloadCard cardContent">
        <h2 className="primaryText">{this.props.data.name}</h2>
        <p>{this.props.data.description}</p>
        <a href={this.props.data.link} download>
          <button className="secondaryBackground">Download</button>
        </a>
      </div>
    );
  }
});
