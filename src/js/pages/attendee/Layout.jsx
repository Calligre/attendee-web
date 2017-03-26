import React from 'react';
import { Sidebar, SidebarItem } from 'react-responsive-sidebar';
import Dialog from 'react-toolbox/lib/dialog';

import BrandStore from 'stores/BrandStore';
import ConferenceStore from 'stores/ConferenceStore';
import PreferenceStore from 'stores/PreferenceStore';

import Footer from 'components/layout/Footer';
import AuthService from 'util/AuthService';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      branding: null,
      switcherModal: false,
      newsfeed: PreferenceStore.getDefaults().newsfeed,
      conferences: [],
      background: null,
      highlight: null,
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
    BrandStore.removeListener('receivedBranding', this.setBranding);
    BrandStore.removeListener('error', this.showError);
  }

  loadPreferences = () => {
    this.setState({ newsfeed: PreferenceStore.preferences.newsfeed });
  }

  loadConferences = () => {
    this.setState({ conferences: ConferenceStore.conferences });
  }

  setBranding = () => {
    let branding = BrandStore.branding;

    // janky color math here
    let secondary = branding.color_secondary.slice(1);
    let r2 = parseInt(secondary.slice(0, 2), 16);
    let g2 = parseInt(secondary.slice(2, 4), 16);
    let b2 = parseInt(secondary.slice(4, 6), 16);
    let a = 0.2;
    let r1 = Math.round(r2/(1-a));
    let g1 = Math.round(g2/(1-a));
    let b1 = Math.round(b2/(1-a));

    let background = "#" + r1.toString(16) + g1.toString(16) + b1.toString(16);
 
    // more janky color math here
    a = 0.14902;
    r1 = Math.round(r2 * (1-a));
    g1 = Math.round(g2 * (1-a));
    b1 = Math.round(b2 * (1-a));

    let highlight = "#" + r1.toString(16) + g1.toString(16) + b1.toString(16);

    this.setState({
      branding: branding,
      background: background,
      highlight: highlight,
    });

    let myStyle = document.styleSheets[document.styleSheets.length - 1]
    myStyle.insertRule(".primaryText { color: " + branding.color_primary + " !important }", 0);
    myStyle.insertRule(".primaryBackground { background-color: " + branding.color_primary + " !important }", 0);
    myStyle.insertRule(".secondaryText { color: " + branding.color_secondary + " !important }", 0);
    myStyle.insertRule(".secondaryBackground { background-color: " + branding.color_secondary + " !important }", 0);
    myStyle.insertRule(".nameContainer { background-image: url('" + branding.background_logo + "')!important }", 0);
    myStyle.insertRule("h6 { color: " + branding.color_primary + " !important }", 0);
    myStyle.insertRule("button[class^='theme__button'] { color: " + branding.color_secondary + " !important }", 0);

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
    const { branding, newsfeed, switcherModal, background, highlight } = this.state;
    
    if (!branding) {
      return null;
    }

    const sidebarConfig = {
      background: branding.color_secondary,
      width: '200',
    }

    const items = [
      <SidebarItem href='/' background={background} hoverHighlight={highlight}>Home</SidebarItem>,
    ];
    if (newsfeed) {
      items.push(<SidebarItem href='/newsfeed'>News Feed</SidebarItem>);
    }
    items.push(
      <SidebarItem href='/events'>Events</SidebarItem>,
      <SidebarItem href='/people'>People</SidebarItem>,
      <SidebarItem href='/profile'>My Profile</SidebarItem>,
      <SidebarItem>
        <a className="sidebarLink" onClick={this.showConferenceSwitcher}>Switch Conferences</a>
      </SidebarItem>
    );
    if (AuthService.loggedIn()) {
      items.push(
        <SidebarItem href='/login'>
          <a className="sidebarLink" onClick={AuthService.logout}>Logout</a>
        </SidebarItem>
      );
    }

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
		<Dialog
          actions={[{ label: "Cancel", onClick: this.closeModal }]}
          active={switcherModal}
          onEscKeyDown={this.closeModal}
          onOverlayClick={this.closeModal}
          title='Switch Conference'>
		  {this.state.conferences.map(conference =>
			  <Conference key={conference.id} {...conference} />
		  )}
        </Dialog>
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
