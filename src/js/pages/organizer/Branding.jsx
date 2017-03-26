import AuthService from "util/AuthService";
import UrlService from 'util/UrlService';
import BrandStore from "stores/BrandStore";
import Card from "components/Card";
import dispatcher from "dispatcher";
import React from "react";
import Input from 'react-toolbox/lib/input';

var moment = require('moment');
const url = UrlService.getUrl();
const $ = require("jquery");

export default class Branding extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      organization: '',
      starttime: '',
      endtime: '',
      color_primary: '#000000',
      color_secondary: '#000000',
      logo: '',
      logo_square: '',
      background_logo: '',
      icon: '',
      background_logo: '',
      facebook: '',
      twitter: '',
    };
  }
 
  componentWillMount() {
    BrandStore.on("receivedBranding", this.setBranding);
    BrandStore.on("savedBranding", this.brandingSaved)
    BrandStore.getBranding();
  };

  componentWillUnmount() {
    BrandStore.removeListener("receivedBranding", this.setBranding);
    BrandStore.removeListener("savedBranding", this.brandingSaved);
  };

  setBranding = () => {
    let branding = BrandStore.branding;
    branding['starttime'] = moment.unix(branding['starttime']).format('YYYY-MM-DD[T]HH:mm');
    branding['endtime'] = moment.unix(branding['endtime']).format('YYYY-MM-DD[T]HH:mm');
    this.setState(branding);
  }

  handleChange = (field, value) => {
    this.setState({ [field] : value });
  }

  handleSave = (event) => {
    const data = {
      name: this.state.name,
      organization: this.state.organization,
      starttime: moment(this.state.starttime).unix(),
      endtime: moment(this.state.endtime).unix(),
      color_primary: this.state.color_primary,
      color_secondary: this.state.color_secondary,
      logo: this.state.logo,
      logo_square: this.state.logo_square,
      background_logo: this.state.background_logo,
      icon: this.state.icon,
      background_logo: this.state.background_logo,
      facebook: this.state.facebook,
      twitter: this.state.twitter,
    };

    BrandStore.saveBranding(data);
  }

  brandingSaved = (event) => {
    //TODO: Figure out a better way of alerting the user that saving succeeded
    console.log("Branding saved successfully.");
  }

  render() {
    const primaryText = {
      color: this.state.color_primary,
    };
    const secondaryText = {
      color: this.state.color_secondary,
    };
    const secondaryBackground = {
      backgroundColor: this.state.color_secondary,
      color: 'white',
    };
    let background = this.state.background_logo || 'url("http://kingofwallpapers.com/grey-background/grey-background-005.jpg")';
    const backgroundImage = {
      backgroundImage: 'url(' + background + ')',
      color: this.state.color_primary,
      WebkitTextFillColor: this.state.color_primary,
    }
 
    let socialCard = null;
    if (this.state.facebook || this.state.twitter) {
      socialCard = <Card type="social" headerStyle={primaryText} facebook={this.state.facebook} twitter={this.state.twitter}/>;
    }

    let starttime = this.state.starttime ? moment(this.state.starttime).calendar() : "";
    let endtime = this.state.endtime ? moment(this.state.endtime).calendar() : "";

    return (
      <div>
        <h1 className="primaryText">Branding</h1>
        <div id="brandingForm">
          <Input type="text" value={this.state.name} label="Conference Name" onChange={this.handleChange.bind(this, 'name')} />
          <Input type="text" value={this.state.organization} label="Organization" onChange={this.handleChange.bind(this, 'organization')} />
          <Input type="datetime-local" value={this.state.starttime} label="Start Date" onChange={this.handleChange.bind(this, 'starttime')} />
          <Input type="datetime-local" value={this.state.endtime} label="End Date" onChange={this.handleChange.bind(this, 'endtime')} />
          <Input type="color" value={this.state.color_primary} label="Primary Colour" onChange={this.handleChange.bind(this, 'color_primary')} />
          <Input type="color" value={this.state.color_secondary} label="Secondary Colour" onChange={this.handleChange.bind(this, 'color_secondary')} />
          <Input type="url" value={this.state.logo} label="Logo" hint="http://www.company.com/logo.png" onChange={this.handleChange.bind(this, 'logo')} />
          <Input type="url" value={this.state.logo_square} label="Square Logo" hint="http://www.company.com/square_logo.png" onChange={this.handleChange.bind(this, 'logo_square')} />
          <Input type="url" value={this.state.icon} label="Icon" hint="http://www.company.com/icon.png" onChange={this.handleChange.bind(this, 'icon')} />
          <Input type="url" value={this.state.background_logo} Label="Event Background Photo" hint="http://www.company.com/background.png" onChange={this.handleChange.bind(this, 'background_logo')} />
          <Input type="url" value={this.state.facebook} label="Facebook" hint="http://www.facebook.com/calligre" onChange={this.handleChange.bind(this, 'facebook')} />
          <Input type="url" value={this.state.twitter} label="Twitter" hint="http://www.twitter.com/calligre" onChange={this.handleChange.bind(this, 'twitter')} />

          <button onClick={this.handleSave} style={secondaryBackground}> Save </button>
        </div>

        <div id="preview">
          <div style={secondaryBackground} id="previewNav"> Navbar Preview </div>
          <img id="logo" src={this.state.logo}/>
          <h1 style={primaryText}> {this.state.name} </h1>
          <h2 style={secondaryText}> {this.state.organization} </h2>
          <h3> {starttime} -</h3>
          <h3> {endtime} </h3>
          <div id="altLogoPreviews">
            <img src={this.state.logo_square} alt="Square Logo"/>
            <img src={this.state.icon} alt="Icon"/>
          </div>
          <div id="eventPreview" style={backgroundImage}> Event Page Header Preview</div>
          {socialCard}
        </div>
      </div>
    );
  }
}
