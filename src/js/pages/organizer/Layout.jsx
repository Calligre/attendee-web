import React from 'react';
import { Sidebar, SidebarItem } from 'react-responsive-sidebar';

import Footer from 'components/layout/Footer';
import BrandStore from 'stores/BrandStore';
import AuthService from 'util/AuthService';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      branding: null,
    };

    BrandStore.on('receivedBranding', this.setBranding);
    BrandStore.getBranding();
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

    let myStyle = document.styleSheets[document.styleSheets.length-1];
    myStyle.insertRule(".primaryText { color: " + branding.color_primary + " !important }", 0);
    myStyle.insertRule(".primaryBackground { background-color: " + branding.color_primary + " !important }", 0);
    myStyle.insertRule(".secondaryText { color: " + branding.color_secondary + " !important }", 0);
    myStyle.insertRule(".secondaryBackground { background-color: " + branding.color_secondary + " !important }", 0);
    myStyle.insertRule(".nameContainer { background-image: url('" + branding.background_logo + "')!important }", 0);
    myStyle.insertRule("[class*='theme__large'] > div > h5[class^='theme__title'] { color: " + branding.color_primary + " !important }", 0);
    myStyle.insertRule("[class*='theme__small'] > div > h5[class^='theme__title'] { color: " + branding.color_secondary + " !important }", 0);
  }

  render() {
    const { branding, background, highlight } = this.state;

    if (!branding) {
      return null;
    }

    if (AuthService.loggedIn()) {
      const sidebarConfig = {
        background: branding.color_secondary,
        width: '200',
      }

      const items = [
        <SidebarItem href='/' background={background} hoverHighlight={highlight}>Branding</SidebarItem>,
        <SidebarItem href='/cards'>Cards</SidebarItem>,
        <SidebarItem href='/calendar'>Calendar</SidebarItem>,
        <SidebarItem href='/preferences'>Preferences</SidebarItem>,
        <SidebarItem href='/surveys'>Surveys</SidebarItem>,
        <SidebarItem href='/notifications'>Notifications</SidebarItem>,
        <SidebarItem href='/moderation'>Moderation</SidebarItem>,
        <SidebarItem href='/login'>
          <a className="sidebarLink" onClick={AuthService.logout}>Logout</a>
        </SidebarItem>
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

    return (
      <div>
        <div class="container navHeader">
          <div class="row">
            <div class="col-lg-12">
              {this.props.children}
            </div>
          </div>
          <Footer/>
        </div>
      </div>
    );
  }
}
