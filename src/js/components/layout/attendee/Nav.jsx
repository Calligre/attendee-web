import React from 'react';
import { IndexLink, Link } from 'react-router';

import PreferenceStore from 'stores/PreferenceStore';

import BrandStore from 'stores/BrandStore';
import AuthService from 'util/AuthService';

export default class Nav extends React.Component {
  constructor() {
    super();
    this.state = {
      collapsed: true,
      newsfeed: PreferenceStore.getDefaults().newsfeed,
    };

    PreferenceStore.loadAll();
  }

  componentWillMount() {
    PreferenceStore.on('loaded', this.loadPreferences);
    PreferenceStore.on('error', this.showError);
  }

  componentWillUnmount() {
    PreferenceStore.removeListener('loaded', this.loadPreferences);
    PreferenceStore.removeListener('error', this.showError);
  }

  loadPreferences = () => {
    this.setState({ newsfeed: PreferenceStore.preferences.newsfeed });
  }

  showError = () => {
    console.error(PreferenceStore.error);
  }

  toggleCollapse = () => {
    const collapsed = !this.state.collapsed;
    this.setState({ collapsed });
  }

  render() {
    const { location } = this.props;
    const { collapsed, newsfeed } = this.state;
    const featuredClass = location.pathname === '/' ? 'active' : '';
    const newsFeedClass = location.pathname.match(/^\/newsfeed/) ? 'active' : '';
    const peopleClass = location.pathname.match(/^\/people/) ? 'active' : '';
    const eventsClass = location.pathname.match(/^\/events/) ? 'active' : '';
    const profileClass = location.pathname.match(/^\/profile/) ? 'active' : '';
    const infoClass = location.pathname.match(/^\/info/) ? 'active' : '';
    const navClass = collapsed ? 'collapse' : '';

    return (
      <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" onClick={this.toggleCollapse} >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
          </div>
          <div className={`navbar-collapse ${navClass}`} id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li className={featuredClass}>
                <IndexLink to="/" onClick={this.toggleCollapse}>Home</IndexLink>
              </li>
              { newsfeed &&
                <li className={newsFeedClass}>
                  <Link to="newsfeed" onClick={this.toggleCollapse}>News Feed</Link>
                </li>
              }
              <li className={peopleClass}>
                <Link to="people" onClick={this.toggleCollapse}>People</Link>
              </li>
              <li className={eventsClass}>
                <Link to="events" onClick={this.toggleCollapse}>Events</Link>
              </li>
              <li className={profileClass}>
                <Link to="profile" onClick={this.toggleCollapse}>My Profile</Link>
              </li>
              <li>
                <Link to="login" onClick={AuthService.logout}>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
