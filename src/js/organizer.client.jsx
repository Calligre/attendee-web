import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';

import Layout from 'pages/organizer/Layout';
import Branding from 'pages/organizer/Branding';
import Calendar from 'pages/organizer/Calendar';
import Cards from 'pages/organizer/Cards';
import Preferences from 'pages/organizer/Preferences';
import Surveys from 'pages/organizer/Surveys';
import Notifications from 'pages/organizer/Notifications';
import Moderation from 'pages/organizer/Moderation';
import Login from 'pages/Login';

import AppHistory from 'util/AppHistory';
import AuthService from 'util/AuthService';
import UrlService from 'util/UrlService';

require('!style!css!sass!../sass/main.scss');

const apiBaseURL = UrlService.getUrl();

const app = document.getElementById('app');
const afterLogin = () => {
  AppHistory.push('/')
}

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!AuthService.loggedIn()) {
    AppHistory.push('login');
    AuthService.on('after_login', afterLogin);
  } else {
    AuthService.removeListener('after_login', afterLogin);
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
      <Route path="notifications" component={Notifications} onEnter={requireAuth} />
      <Route path="moderation" component={Moderation} onEnter={requireAuth} />
      <Route path="login" component={Login} />
      <Route path="access_token=:token" component={Login} />
    </Route>
  </Router>,
app);
