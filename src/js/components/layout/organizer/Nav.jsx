import React from "react";
import { IndexLink, Link } from "react-router";

import AuthService from "util/AuthService";

export default class Nav extends React.Component {
  constructor() {
    super()
    this.state = {
      collapsed: true,
    };
  }

  toggleCollapse = () => {
    const collapsed = !this.state.collapsed;
    this.setState({collapsed});
  }

  render() {
    const { location } = this.props;
    const { collapsed } = this.state;
    const brandingClass = location.pathname === "/" ? "active" : "";
    const calendarClass = location.pathname.match(/^\/calendar/) ? "active" : "";
    const preferencesClass = location.pathname.match(/^\/preferences/) ? "active" : "";
    const surveyClass = location.pathname.match(/^\/surveys/) ? "active" : "";
    const moderationClass = location.pathname.match(/^\/moderation/) ? "active" : "";
    const navClass = collapsed ? "collapse" : "";

    return (
      <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" onClick={this.toggleCollapse} >
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
          </div>
          <div class={"navbar-collapse " + navClass} id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
              <li class={brandingClass}>
                <IndexLink to="/" onClick={this.toggleCollapse}>Branding</IndexLink>
              </li>
              <li class={calendarClass}>
                <Link to="calendar" onClick={this.toggleCollapse}>Calendar</Link>
              </li>
              <li class={preferencesClass}>
                <Link to="preferences" onClick={this.toggleCollapse}>Preferences</Link>
              </li>
              <li class={surveyClass}>
                <Link to="surveys" onClick={this.toggleCollapse}>Surveys</Link>
              </li>
              <li class={moderationClass}>
                <Link to="moderation" onClick={this.toggleCollapse}>Moderation</Link>
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
