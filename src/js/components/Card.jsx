import React from 'react';
import Event from 'components/Event';

import Clear from 'react-icons/lib/fa/times-circle';
import { Card as BetterCard, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { Button } from 'react-toolbox/lib/button';
import { SocialIcon } from 'react-social-icons';

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
        renderedContent = <ContentCard data={item}/>;
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

var ContentCard = React.createClass({
  render: function() {
    return (
	  <BetterCard>
		<CardTitle
		  avatar="https://image.flaticon.com/icons/svg/172/172116.svg"
		  title="Message"/>
        <CardText>{this.props.data}</CardText>
	  </BetterCard>
    );
  }
});

var ContactCard = React.createClass({
  render: function() {
    var contactNodes = this.props.data.map(function(contact) {
      return (
        <div className="contact" key={contact.id}>
          <h4>{contact.name}</h4>
          <p>{contact.phone}</p>
        </div>
      );
    });
    return (
	  <BetterCard>
		<CardTitle
		  avatar="https://image.flaticon.com/icons/svg/172/172166.svg"
		  title="Information"/>
		<CardTitle
		  title="Important Contacts"
          style={this.props.headerStyle}/>
        <CardText>{contactNodes}</CardText>
	  </BetterCard>
    );
  }
});

var LocationCard = React.createClass({
  render: function() {
    var locationNodes = this.props.data.map(function(confLocation) {
      return (
        <div className="location" key={confLocation.id}>
          <h4>{confLocation.name}</h4>
          <p>{confLocation.address}</p>
        </div>
      );
    });
    return (
	  <BetterCard>
		<CardTitle
		  avatar="https://image.flaticon.com/icons/svg/172/172166.svg"
		  title="Information"/>
		<CardTitle
		  title="Locations"
          style={this.props.headerStyle}/>
        <CardText>{locationNodes}</CardText>
	  </BetterCard>
    );
  }
});

var DownloadCard = React.createClass({
  render: function() {
    return (
	  <BetterCard>
		<CardTitle
		  avatar="https://image.flaticon.com/icons/svg/172/172140.svg"
		  title="Download"/>
        { this.props.data.name === "Map" &&
          <CardMedia
            aspectRatio="wide"
            image="https://images.pexels.com/photos/297642/pexels-photo-297642.jpeg?w=940&h=650&auto=compress&cs=tinysrgb"/> }
        { this.props.data.name === "Conference Package" &&
          <CardMedia
            aspectRatio="wide"
            image="https://images.pexels.com/photos/30027/pexels-photo-30027.jpg?w=940&h=650&auto=compress&cs=tinysrgb"/> }
		<CardTitle
		  title={this.props.data.name}
          style={this.props.headerStyle}/>
		<CardActions>
		  <Button style={this.props.buttonStyle} label="Download" href={this.props.data.link} download/>
		</CardActions>
	  </BetterCard>
    );
  }
});

var SocialCard = React.createClass({
  render: function() {
    return (
	  <BetterCard>
		<CardTitle
		  avatar="https://image.flaticon.com/icons/svg/172/172115.svg"
		  title="Connect With Us"/>
        <CardMedia
          aspectRatio="wide"
          image="https://images.pexels.com/photos/267447/pexels-photo-267447.jpeg?w=940&h=650&auto=compress&cs=tinysrgb"/>
        <CardText>
          { this.props.facebook && <SocialIcon url={this.props.facebook} className="socialLink" /> }
          { this.props.twitter && <SocialIcon url={this.props.twitter} className="socialLink" /> }
        </CardText>
	  </BetterCard>
    );
  }
});

var SurveyCard = React.createClass({
  render: function() {
    return (
	  <BetterCard>
		<CardTitle
		  avatar="https://image.flaticon.com/icons/svg/172/172168.svg"
		  title="Survey"/>
        <CardMedia
          aspectRatio="wide"
          image="https://images.pexels.com/photos/210585/pexels-photo-210585.jpeg?w=940&h=650&auto=compress&cs=tinysrgb"/>
		<CardTitle
		  title={this.props.data.name}
          style={this.props.headerStyle}/>
		<CardText>{this.props.data.description}</CardText>
		<CardActions>
		  <Button style={this.props.buttonStyle} href={this.props.data.link} target="_blank" label="Take Survey" />
		</CardActions>
	  </BetterCard>
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
	  <BetterCard>
		<CardTitle
		  avatar="https://image.flaticon.com/icons/svg/172/172096.svg"
		  title="Sponsors"/>
		<CardTitle
		  title={this.props.data[0].level + " Sponsors"}
          style={this.props.headerStyle}/>
        <CardText>{sponsors}</CardText>
	  </BetterCard>
    );
  }
});

