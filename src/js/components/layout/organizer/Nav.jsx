import React from 'react';
import { IndexLink, Link } from 'react-router';

import AuthService from 'util/AuthService';

export default class Nav extends React.Component {
  constructor() {
    super();
    this.state = {
      collapsed: true,
    };
  }

  toggleCollapse = () => {
    const collapsed = !this.state.collapsed;
    this.setState({ collapsed });
  }

  render() {
    const { location } = this.props;
    const { collapsed } = this.state;
    const brandingClass = location.pathname === '/' ? 'active' : '';
    const calendarClass = location.pathname.match(/^\/calendar/) ? 'active' : '';
    const preferencesClass = location.pathname.match(/^\/preferences/) ? 'active' : '';
    const surveyClass = location.pathname.match(/^\/surveys/) ? 'active' : '';
    const notificationClass = location.pathname.match(/^\/notifications/) ? 'active' : '';
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
              <li className={brandingClass}>
                <IndexLink to="/" onClick={this.toggleCollapse}>Branding</IndexLink>
              </li>
              <li className={calendarClass}>
                <Link to="calendar" onClick={this.toggleCollapse}>Calendar</Link>
              </li>
              <li className={preferencesClass}>
                <Link to="preferences" onClick={this.toggleCollapse}>Preferences</Link>
              </li>
              <li className={surveyClass}>
                <Link to="surveys" onClick={this.toggleCollapse}>Surveys</Link>
              </li>
              <li className={notificationClass}>
                <Link to="notifications" onClick={this.toggleCollapse}>Notifications</Link>
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
