import React from 'react';
import { IndexLink, Link } from 'react-router';
import Modal from 'react-modal';

import PreferenceStore from 'stores/PreferenceStore';
import ConferenceStore from 'stores/ConferenceStore';

import AuthService from 'util/AuthService';

export default class Nav extends React.Component {
  constructor() {
    super();
    this.state = {
      collapsed: true,
      switcherModal: false,
      newsfeed: PreferenceStore.getDefaults().newsfeed,
      conferences: [],
    };

    PreferenceStore.loadAll();
    ConferenceStore.getConferences();
  }

  componentWillMount() {
    PreferenceStore.on('loaded', this.loadPreferences);
    PreferenceStore.on('error', this.showError);
    ConferenceStore.on('loadedConferences', this.loadedConferences);
    ConferenceStore.on('error', this.showError);
  }

  componentWillUnmount() {
    PreferenceStore.removeListener('loaded', this.loadPreferences);
    PreferenceStore.removeListener('error', this.showError);
    ConferenceStore.removeListener('loadedConferences', this.loadedConferences);
    ConferenceStore.removeListener('error', this.showError);
  }

  loadPreferences = () => {
    this.setState({ newsfeed: PreferenceStore.preferences.newsfeed });
  }

  loadedConferences = () => {
    this.setState({ conferences: ConferenceStore.conferences });
  }

  showError = () => {
    console.error(PreferenceStore.error);
    console.error(ConferenceStore.error);
  }

  toggleCollapse = () => {
    const collapsed = !this.state.collapsed;
    this.setState({ collapsed });
  }

  showConferenceSwitcher = () => {
    this.setState({ switcherModal: true });
  }

  closeModal = () => {
    this.setState({ switcherModal: false });
  }

  render() {
    const { location } = this.props;
    const { collapsed, newsfeed, switcherModal } = this.state;
    const featuredClass = location.pathname === '/' ? 'active' : '';
    const newsFeedClass = location.pathname.match(/^\/newsfeed/) ? 'active' : '';
    const peopleClass = location.pathname.match(/^\/people/) ? 'active' : '';
    const eventsClass = location.pathname.match(/^\/events/) ? 'active' : '';
    const profileClass = location.pathname.match(/^\/profile/) ? 'active' : '';
    const navClass = collapsed ? 'collapse' : '';

    const customStyle = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
      },
    };

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
              <li onClick={this.showConferenceSwitcher}>Switch Conference</li>
              <li>
                <Link to="login" onClick={AuthService.logout}>Logout</Link>
              </li>
            </ul>
          </div>
          <Modal
            isOpen={switcherModal}
            onRequestClose={this.closeModal}
            style={customStyle}
            contentLabel="Switch Conferences"
          >
            <div className="conference-switcher">
              <h1>Switch Conference</h1>
              {this.state.conferences.map(conference => <Conference key={conference.id} {...conference} />)}
            </div>
          </Modal>
        </div>
      </nav>
    );
  }
}

const Conference = React.createClass({
  render() {
    return (
      <div className="conferenceElement">
        <a href={`https://${this.props.url}`} >
          <img src={this.props.logo} alt={this.props.name} height="100" />
          {this.props.name}
        </a>
      </div>
    );
  },
});
