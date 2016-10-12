import React from 'react';
import { IndexLink, Link } from 'react-router';

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
    const { pathname } = this.props.location;
    const { collapsed } = this.state;
    const featuredClass = pathname === '/' ? 'active' : '';
    const newsFeedClass = pathname.match(/^\/newsfeed/) ? 'active' : '';
    const peopleClass = pathname.match(/^\/people/) ? 'active' : '';
    const eventsClass = pathname.match(/^\/events/) ? 'active' : '';
    const profileClass = pathname.match(/^\/profile/) ? 'active' : '';
    const infoClass = pathname.match(/^\/info/) ? 'active' : '';
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
              <li className={newsFeedClass}>
                <Link to="newsfeed" onClick={this.toggleCollapse}>News Feed</Link>
              </li>
              <li className={peopleClass}>
                <Link to="people" onClick={this.toggleCollapse}>People</Link>
              </li>
              <li className={eventsClass}>
                <Link to="events" onClick={this.toggleCollapse}>Events</Link>
              </li>
              <li className={profileClass}>
                <Link to="profile" onClick={this.toggleCollapse}>My Profile</Link>
              </li>
              <li className={infoClass}>
                <Link to="info" onClick={this.toggleCollapse}>Conference Info</Link>
              </li>
              <li>
                <Link to="/" onClick={this.props.auth.logout}>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

Nav.propTypes = {
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string.isRequired,
  }),
  auth: React.PropTypes.shape({
    logout: React.PropTypes.func,
  }),
};
