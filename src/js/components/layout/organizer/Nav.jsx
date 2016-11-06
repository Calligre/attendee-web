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
    const featuredClass = location.pathname === "/" ? "active" : "";
    const newsFeedClass = location.pathname.match(/^\/calendar/) ? "active" : "";
    const peopleClass = location.pathname.match(/^\/cards/) ? "active" : "";
    const eventsClass = location.pathname.match(/^\/preferences/) ? "active" : "";
    const profileClass = location.pathname.match(/^\/results/) ? "active" : "";
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
              <li class={featuredClass}>
                <IndexLink to="/" onClick={this.toggleCollapse.bind(this)}>Branding</IndexLink>
              </li>
              <li class={newsFeedClass}>
                <Link to="calendar" onClick={this.toggleCollapse.bind(this)}>Calendar</Link>
              </li>
              <li class={peopleClass}>
                <Link to="cards" onClick={this.toggleCollapse.bind(this)}>Cards</Link>
              </li>
              <li class={eventsClass}>
                <Link to="preferences" onClick={this.toggleCollapse.bind(this)}>Preferences</Link>
              </li>
              <li class={profileClass}>
                <Link to="results" onClick={this.toggleCollapse.bind(this)}>Results</Link>
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
