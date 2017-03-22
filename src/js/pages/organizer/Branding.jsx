import AuthService from "util/AuthService";
import BrandStore from "stores/BrandStore";
import Card from "components/Card";
import dispatcher from "dispatcher";
import React from "react";

var moment = require('moment');
const url = "https://dev.calligre.com";
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
      map: '',
      package: '',
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

  handleChange = (event) => {
    this.setState({[event.target.name]:event.target.value});
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
      map: this.state.map,
      package: this.state.package,
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
 
    let mapCard = null;
    let confPackageCard = null;
    let socialCard = null;
    const map = {
      "name" : "Map",
      "link" : this.state.map,
    };
    const confPackage = {
      "name" : "Conference Package",
      "link" : this.state.package,
    };

    if (this.state.map) {
      mapCard = <Card type="download" buttonStyle={secondaryBackground} headerStyle={primaryText} item={map}/>;
    }
    if (this.state.package) {
      confPackageCard = <Card type="download" buttonStyle={secondaryBackground} headerStyle={primaryText} item={confPackage}/>;
    }

    if (this.state.facebook || this.state.twitter) {
      socialCard = <Card type="social" headerStyle={primaryText} facebook={this.state.facebook} twitter={this.state.twitter}/>;
    }

    let starttime = this.state.starttime ? moment(this.state.starttime).calendar() : "";
    let endtime = this.state.endtime ? moment(this.state.endtime).calendar() : "";

    return (
      <div>
        <div id="brandingForm">
          <div className="field">
            <h3 className="label">Name:</h3>
            <input type="text" value={this.state.name} name="name" placeholder="Name" onChange={this.handleChange} />
          </div>
          <div className="field">
            <h3 className="label">Organization:</h3>
            <input type="text" value={this.state.organization} name="organization" placeholder="Organization" onChange={this.handleChange} />
          </div>
          <div className="field">
            <h3 className="label">Start Date:</h3>
            <input type="datetime-local" value={this.state.starttime} name="starttime" onChange={this.handleChange} />
          </div>
          <div className="field">
            <h3 className="label">End Date:</h3>
            <input type="datetime-local" value={this.state.endtime} name="endtime" onChange={this.handleChange} />
          </div>
          <div className="field">
            <h3 className="label">Primary Colour:</h3>
            <input type="color" value={this.state.color_primary} name="color_primary" onChange={this.handleChange} />
          </div>
          <div className="field">
            <h3 className="label">Secondary Colour:</h3>
            <input type="color" value={this.state.color_secondary} name="color_secondary" onChange={this.handleChange} />
          </div>
          <div className="field">
            <h3 className="label">Logo:</h3>
            <input type="url" value={this.state.logo} name="logo" placeholder="http://www.company.com/logo.png" onChange={this.handleChange} />
          </div>
          <div className="field">
            <h3 className="label">Square Logo:</h3>
            <input type="url" value={this.state.logo_square} placeholder="http://www.company.com/square_logo.png" name="logo_square" onChange={this.handleChange} />
          </div>
          <div className="field">
            <h3 className="label">Icon:</h3>
            <input type="url" value={this.state.icon} name="icon" placeholder="http://www.company.com/icon.png" onChange={this.handleChange} />
          </div>
          <div className="field">
            <h3 className="label">Background:</h3>
            <input type="url" value={this.state.background_logo} name="background_logo" placeholder="http://www.company.com/background.png" onChange={this.handleChange} />
          </div>
          <div className="field">
            <h3 className="label">Map:</h3>
            <input type="url" value={this.state.map} name="map" placeholder="http://www.company.com/map.pdf" onChange={this.handleChange} />
          </div>
          <div className="field">
            <h3 className="label">Conference Package:</h3>
            <input type="url" value={this.state.package} name="package" placeholder="http://www.company.com/package.pdf" onChange={this.handleChange} />
          </div>
          <div className="field">
            <h3 className="label">Facebook:</h3>
            <input type="url" value={this.state.facebook} name="facebook" placeholder="http://www.facebook.com/calligre" onChange={this.handleChange} />
          </div>
          <div className="field">
            <h3 className="label">Twitter:</h3>
            <input type="url" value={this.state.twitter} name="twitter" placeholder="http://www.twitter.com/calligre" onChange={this.handleChange} />
          </div>

          <button onClick={this.handleSave}> Save </button>
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
          {mapCard}
          {confPackageCard}
        </div>
      </div>
    );
  }
}
