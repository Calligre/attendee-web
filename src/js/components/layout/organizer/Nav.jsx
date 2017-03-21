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

  toggleCollapse() {
    const collapsed = !this.state.collapsed;
    this.setState({collapsed});
  }

  render() {
    const { location } = this.props;
    const { collapsed } = this.state;
    const brandingClass = location.pathname === "/" ? "active" : "";
    const calendarClass = location.pathname.match(/^\/calendar/) ? "active" : "";
    const preferencesClass = location.pathname.match(/^\/preferences/) ? "active" : "";
    const surveyClass = location.pathname.match(/^\/results/) ? "active" : "";
    const navClass = collapsed ? "collapse" : "";

    return (
      <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" onClick={this.toggleCollapse.bind(this)} >
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
          </div>
          <div class={"navbar-collapse " + navClass} id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
              <li class={brandingClass}>
                <IndexLink to="/" onClick={this.toggleCollapse.bind(this)}>Branding</IndexLink>
              </li>
              <li class={calendarClass}>
                <Link to="calendar" onClick={this.toggleCollapse.bind(this)}>Calendar</Link>
              </li>
              <li class={preferencesClass}>
                <Link to="preferences" onClick={this.toggleCollapse.bind(this)}>Preferences</Link>
              </li>
              <li class={surveyClass}>
                <Link to="results" onClick={this.toggleCollapse.bind(this)}>Surveys</Link>
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
