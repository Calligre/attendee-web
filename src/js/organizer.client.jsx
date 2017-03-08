import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';

import Layout from 'pages/organizer/Layout';
import Branding from 'pages/organizer/Branding';
import Calendar from 'pages/organizer/Calendar';
import Cards from 'pages/organizer/Cards';
import Preferences from 'pages/organizer/Preferences';
import Results from 'pages/organizer/Results';
import Login from 'pages/Login';

import AppHistory from 'util/AppHistory';
import AuthService from 'util/AuthService';
import * as config from 'auth0.config.js';

require('!style!css!sass!../sass/main.scss');

const app = document.getElementById('app');
const redirectCallback = (newProfile) => {
  redirectAfterLogin();
}

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!AuthService.loggedIn()) {
    localStorage.setItem('redirect_after_login', nextState.location.pathname);
    AppHistory.push('login');
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
      <IndexRoute apiBaseURL="https://dev.calligre.com/api" component={Branding} onEnter={requireAuth}/>
      <Route path="calendar" component={Calendar} onEnter={requireAuth}/>
      <Route path="cards" component={Cards} onEnter={requireAuth}/>
      <Route path="preferences" component={Preferences} onEnter={requireAuth}/>
      <Route path="results" component={Results} onEnter={requireAuth}/>
      <Route path="login" component={Login}></Route>
      <Route path="access_token=:token" component={Login} />
    </Route>
  </Router>,
app);
