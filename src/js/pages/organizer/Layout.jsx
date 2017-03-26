import React from 'react';
import { Sidebar, SidebarItem } from 'react-responsive-sidebar';

import Footer from 'components/layout/Footer';
import BrandStore from 'stores/BrandStore';
import AuthService from 'util/AuthService';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    BrandStore.on('receivedBranding', this.setBranding);
    BrandStore.getBranding();
  }

  setBranding = () => {
    let branding = BrandStore.branding;
    this.setState({ branding: branding });
    let myStyle = document.styleSheets[document.styleSheets.length-1];
    myStyle.insertRule(".primaryText { color: " + branding.color_primary + " !important }", 0);
    myStyle.insertRule(".primaryBackground { background-color: " + branding.color_primary + " !important }", 0);
    myStyle.insertRule(".secondaryText { color: " + branding.color_secondary + " !important }", 0);
    myStyle.insertRule(".secondaryBackground { background-color: " + branding.color_secondary + " !important }", 0);
    myStyle.insertRule(".nameContainer { background-image: url('" + branding.background_logo + "')!important }", 0);
  }

  render() {
    const { branding } = this.state;

    if (!branding) {
      return null;
    }

    const sidebarConfig = {
      background: branding.color_secondary || 'white',
      width: '200',
    }

    const items = [
      <SidebarItem href='/'>Branding</SidebarItem>,
      <SidebarItem href='/cards'>Cards</SidebarItem>,
      <SidebarItem href='/calendar'>Calendar</SidebarItem>,
      <SidebarItem href='/preferences'>Preferences</SidebarItem>,
      <SidebarItem href='/surveys'>Surveys</SidebarItem>,
      <SidebarItem href='/login' onClick={AuthService.logout}>Logout</SidebarItem>,
    ];

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
      </div>
    );
  }
}
