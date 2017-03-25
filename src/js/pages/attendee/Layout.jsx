import React from 'react';
import { Sidebar, SidebarItem } from 'react-responsive-sidebar';
import Modal from 'react-modal';

import Footer from 'components/layout/Footer';
import BrandStore from 'stores/BrandStore';
import ConferenceStore from 'stores/ConferenceStore';
import PreferenceStore from 'stores/PreferenceStore';
import AuthService from 'util/AuthService';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      branding: {},
      switcherModal: false,
      newsfeed: PreferenceStore.getDefaults().newsfeed,
      conferences: [],
    };

    BrandStore.getBranding();
    PreferenceStore.loadAll();
    ConferenceStore.getConferences();
  }

  componentWillMount() {
    PreferenceStore.on('loaded', this.loadPreferences);
    PreferenceStore.on('error', this.showError);
    ConferenceStore.on('loadedConferences', this.loadConferences);
    ConferenceStore.on('error', this.showError);
    BrandStore.on('receivedBranding', this.setBranding);
    BrandStore.on('error', this.showError);
  }

  componentWillUnmount() {
    PreferenceStore.removeListener('loaded', this.loadPreferences);
    PreferenceStore.removeListener('error', this.showError);
    ConferenceStore.removeListener('loadedConferences', this.loadedConferences);
    ConferenceStore.removeListener('error', this.showError);
  }

  loadPreferences = () => {
    this.setState({ newsfeed: PreferenceStore.preferences.newsfeed });
  }

  loadConferences = () => {
    this.setState({ conferences: ConferenceStore.conferences });
  }

  setBranding = () => {
    let branding = BrandStore.branding;
    this.setState({ branding: branding });
    let myStyle = document.styleSheets[6];
    myStyle.insertRule(".primaryText { color: " + branding.color_primary + " !important }", 0);
    myStyle.insertRule(".primaryBackground { background-color: " + branding.color_primary + " !important }", 0);
    myStyle.insertRule(".secondaryText { color: " + branding.color_secondary + " !important }", 0);
    myStyle.insertRule(".secondaryBackground { background-color: " + branding.color_secondary + " !important }", 0);
    myStyle.insertRule(".nameContainer { background-image: url('" + branding.background_logo + "')!important }", 0);
  }

  showError = () => {
    console.error(PreferenceStore.error);
    console.error(ConferenceStore.error);
    console.error(BrandStore.error);
  }

  showConferenceSwitcher = () => {
    this.setState({ switcherModal: true });
  }

  closeModal = () => {
    this.setState({ switcherModal: false });
  }

  render() {
    const { branding, newsfeed, switcherModal } = this.state;
    var self = this;
    
    if (!branding) {
      return null;
    }

    const sidebarConfig = {
      background: branding.color_secondary || 'white',
      width: '200',
      breakPoint: '10000',
    }

    const items = [
      <SidebarItem href='/'>Home</SidebarItem>,
    ];
    if (newsfeed) {
      items.push(<SidebarItem href='/newsfeed'>News Feed</SidebarItem>);
    }
    Array.prototype.push.apply(items, [
      <SidebarItem href='/events'>Events</SidebarItem>,
      <SidebarItem href='/people'>People</SidebarItem>,
      <SidebarItem href='/profile'>My Profile</SidebarItem>,
      <SidebarItem>
        <a className="sidebarLink" onClick={this.showConferenceSwitcher}>Switch Conferences</a>
      </SidebarItem>,
      <SidebarItem href='/login'>
        <a className="sidebarLink" onClick={AuthService.logout}>Logout</a>
      </SidebarItem>,
    ]);

    return (
      <div>
        <Sidebar content={items} {...sidebarConfig}>
          <div class="container navHeader">
            <div class="row">
              <div class="col-lg-12">
                {this.props.children}
              </div>
            </div>
            <Footer/>
          </div>
        </Sidebar>
		<Modal isOpen={switcherModal} onRequestClose={this.closeModal} contentLabel="Switch Conferences">
            <div className="conferenceSwitcher">
              <h1 className="primaryText">Switch Conference</h1>
              {this.state.conferences.map(conference =>
                  <Conference key={conference.id} {...conference} />
              )}
            </div>
            <button className="secondaryBackground" onClick={this.closeModal}>Cancel</button>
          </Modal>
      </div>
    );
  }
}

const Conference = React.createClass({
  render() {
    return (
      <div className="conferenceElement">
        <a href={`https://${this.props.url}`} >
          <img src={this.props.logo} />
          <h3>{this.props.name}</h3>
        </a>
      </div>
    );
  },
});
