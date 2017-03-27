import React, { PropTypes } from 'react';
import AuthService from 'util/AuthService';
import BrandStore from 'stores/BrandStore';

export default class Login extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    location: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      branding: null,
    };

    BrandStore.getBranding();
  }

  componentWillMount() {
    BrandStore.on('receivedBranding', this.setBranding);
    BrandStore.on('error', this.showError);
  }

  componentWillUnmount() {
    BrandStore.removeListener('receivedBranding', this.setBranding);
    BrandStore.removeListener('error', this.showError);
  }

  setBranding = () => {
    this.setState({
      branding: BrandStore.branding,
    });
  }

  showError = () => {
    console.log(BrandStore.error);
  }

  render() {
    const { branding } = this.state;

    if (localStorage.getItem('logging_in') || !branding) {
      return (<div />);
    }

    return (
      <div id="loginContainer">
        <div> Welcome to: {branding.name} </div>
        <div className="logo">
          <div className="logoC primaryBackground" />
          <div className="rest">alligre</div>
        </div>
        <button className="secondaryBackground" onClick={AuthService.login}>Login or Sign Up</button>
      </div>
    );
  }
}
