import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';

import Layout from 'pages/organizer/Layout';
import Branding from 'pages/organizer/Branding';
import Calendar from 'pages/organizer/Calendar';
import Cards from 'pages/organizer/Cards';
import Preferences from 'pages/organizer/Preferences';
import Surveys from 'pages/organizer/Surveys';
import Login from 'pages/Login';

import AppHistory from 'util/AppHistory';
import AuthService from 'util/AuthService';
import UrlService from 'util/UrlService';

require('!style!css!sass!../sass/main.scss');

const apiBaseURL = UrlService.getUrl();

const app = document.getElementById('app');
const redirectCallback = () => {
  redirectAfterLogin();
};

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState) => {
  if (!AuthService.loggedIn()) {
    localStorage.setItem('redirect_after_login', nextState.location.pathname);
    AppHistory.push('login');
  }
  if (!AuthService.hasAdminCapabilities()) {
    alert('This user does not have admin privileges.\n' +
      'They will not be able to make any lasting changes, but can still look around.\n\n' +
      'Were you looking for the attendee app?');
  } else {
    AuthService.on('profile_updated', redirectCallback);
  }
};

const redirectAfterLogin = () => {
  const url = localStorage.getItem('redirect_after_login');
  if (url) {
    localStorage.removeItem('redirect_after_login');
    AppHistory.push(url);
    AuthService.removeListener('profile_updated', redirectCallback);
  }
};

ReactDOM.render(
  <Router history={AppHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute apiBaseURL={UrlService.getUrl()} component={Branding} onEnter={requireAuth} />
      <Route path="calendar" component={Calendar} onEnter={requireAuth} />
      <Route path="cards" component={Cards} onEnter={requireAuth} />
      <Route path="preferences" component={Preferences} onEnter={requireAuth} />
      <Route path="surveys" component={Surveys} onEnter={requireAuth} />
      <Route path="login" component={Login} />
      <Route path="access_token=:token" component={Login} />
    </Route>
  </Router>,
app);
