import BrandStore from 'stores/BrandStore';
import React from 'react';

const moment = require('moment');

export default class Info extends React.Component {
  constructor() {
    super();

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

    BrandStore.on('receivedBranding', this.setBranding);
    BrandStore.getBranding();
  }

  setBranding = () => {
    let branding = BrandStore.branding;
    branding['starttime'] = moment.unix(branding['starttime']).format('YYYY-MM-DD[T]HH:mm');
    branding['endtime'] = moment.unix(branding['endtime']).format('YYYY-MM-DD[T]HH:mm');
    this.setState(branding);
  }

  render() {
    const { name, organization, starttime, endtime, location, other, color_primary,
      color_secondary, logo, logo_square, icon, facebook, twitter } = this.state;
    return (
      <div id="conference-info">
        <img className="logo" alt="Logo" src={logo} />
        <h1 className="primaryText">You're at: {name}</h1>
        <h2 className="secondaryText"> It begins: {starttime} </h2>
        <h2 className="secondaryText"> and ends: {endtime} </h2>
        <h2 className="secondaryText"> It's happeneing at {location} </h2>
        <h3> {other} </h3>
        <h3> Brought to you by: {organization} </h3>
        <div> <input type="color" value={color_primary} disabled/>
              <input type="color" value={color_secondary} disabled/> </div>

        <div> <img src={logo_square} alt="Square Logo" height="100 "/>
              <img src={icon} alt="Icon" height="100 "/> </div>
        <div> <a href={facebook}> <img src="https://facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-art.png" alt="Facebook" height="50" /> </a>
              <a href={twitter}> <img src="https://upload.wikimedia.org/wikipedia/en/archive/9/9f/20161107041729!Twitter_bird_logo_2012.svg" alt="Twitter" height="50" /> </a> </div>
      </div>
    );
  }
}
