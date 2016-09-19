import React from "react";
import { IndexLink, Link } from "react-router";

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
    const newsFeedClass = location.pathname.match(/^\/newsfeed/) ? "active" : "";
    const peopleClass = location.pathname.match(/^\/people/) ? "active" : "";
    const eventsClass = location.pathname.match(/^\/events/) ? "active" : "";
    const profileClass = location.pathname.match(/^\/profile/) ? "active" : "";
    const infoClass = location.pathname.match(/^\/info/) ? "active" : "";
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
                <IndexLink to="/" onClick={this.toggleCollapse.bind(this)}>Home</IndexLink>
              </li>
              <li class={newsFeedClass}>
                <Link to="newsfeed" onClick={this.toggleCollapse.bind(this)}>News Feed</Link>
              </li>
              <li class={peopleClass}>
                <Link to="people" onClick={this.toggleCollapse.bind(this)}>People</Link>
              </li>
              <li class={eventsClass}>
                <Link to="events" onClick={this.toggleCollapse.bind(this)}>Events</Link>
              </li>
              <li class={profileClass}>
                <Link to="profile" onClick={this.toggleCollapse.bind(this)}>My Profile</Link>
              </li>
              <li class={infoClass}>
                <Link to="info" onClick={this.toggleCollapse.bind(this)}>Conference Info</Link>
              </li>
              <li>
                <Link to="/" onClick={this.props.auth.logout.bind(this)}>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
