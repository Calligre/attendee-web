import AuthService from "util/AuthService";
import BrandStore from "stores/BrandStore";
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
      location: '',
      other: '',
      color_primary: '#000000',
      color_secondary: '#000000',
      logo: '',
      logo_square: '',
      icon: '',
      facebook: '',
      twitter: '',
    };

    BrandStore.on("receivedBranding", this.setBranding);
    BrandStore.on("savedBranding", this.brandingSaved)
    BrandStore.getBranding();
  }

  setBranding = () => {
    let branding = BrandStore.branding;
    
    Object.keys(branding).forEach(function(key) {
      if (key == 'starttime' || key == 'endtime') {
        branding[key] = moment.unix(branding[key]).format('YYYY-MM-DD[T]HH:mm');
      }
    });
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
      location: this.state.location,
      other: this.state.other,
      color_primary: this.state.color_primary,
      color_secondary: this.state.color_secondary,
      logo: this.state.logo,
      logo_square: this.state.logo_square,
      icon: this.state.icon,
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
    return (
      <div>
        <table width="100%" height="100%">
          <tbody>
            <tr>
              <td width="50%">
                <div> Name: <input type="text" value={this.state.name} name="name" placeholder="Name" onChange={this.handleChange} /> </div>
                <div> Organization: <input type="text" value={this.state.organization} name="organization" placeholder="Organization" onChange={this.handleChange} /> </div>
                <div> Start Date: <input type="datetime-local" value={this.state.starttime} name="starttime" onChange={this.handleChange} /> </div>
                <div> End Date: <input type="datetime-local" value={this.state.endtime} name="endtime" onChange={this.handleChange} /> </div>
                <div> Location: <input type="text" value={this.state.location} name="location" onChange={this.handleChange} /> </div>
                <div> Additional Info: <textarea rows="4" cols="40" value={this.state.other} name="other" onChange={this.handleChange} /> </div>
                <div> Primary Color: <input type="color" value={this.state.color_primary} name="color_primary" onChange={this.handleChange} /> </div>
                <div> Secondary Color: <input type="color" value={this.state.color_secondary} name="color_secondary" onChange={this.handleChange} /> </div>
                <div> Logo: <input type="url" value={this.state.logo} name="logo" placeholder="http://www.company.com/logo.png" onChange={this.handleChange} /> </div>
                <div> Square Logo: <input type="url" value={this.state.logo_square} placeholder="http://www.company.com/square_logo.png" name="logo_square" onChange={this.handleChange} /> </div>
                <div> Icon: <input type="url" value={this.state.icon} name="icon" placeholder="http://www.company.com/icon.png" onChange={this.handleChange} /> </div>
                <div> Facebook: <input type="url" value={this.state.facebook} name="facebook" placeholder="http://www.facebook.com/calligre" onChange={this.handleChange} /> </div>
                <div> Twitter: <input type="url" value={this.state.twitter} name="twitter" placeholder="http://www.twitter.com/calligre" onChange={this.handleChange} /> </div>


                <button onClick={this.handleSave}> Save </button>
              </td>
              <td width="50%">
                PREVIEW:

                <div> {this.state.name} </div>
                <div> {this.state.organization} </div>
                <div> {this.state.starttime} </div>
                <div> {this.state.endtime} </div>
                <div> {this.state.location} </div>
                <div> {this.state.other} </div>
                <div> <input type="color" value={this.state.color_primary} disabled/> </div>
                <div> <input type="color" value={this.state.color_secondary} disabled/> </div>
                <div> <img src={this.state.logo} alt="Logo" height="100" /> </div>
                <div> <img src={this.state.logo_square} alt="Square Logo" height="100 "/> </div>
                <div> <img src={this.state.icon} alt="Icon" height="100 "/> </div>
                <div> <a href={this.state.facebook}> <img src="https://facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-art.png" alt="Facebook" height="50" /> </a> </div>
                <div> <a href={this.state.twitter}> <img src="https://upload.wikimedia.org/wikipedia/en/archive/9/9f/20161107041729!Twitter_bird_logo_2012.svg" alt="Twitter" height="50" /> </a> </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
