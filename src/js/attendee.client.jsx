
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, useRouterHistory, IndexRoute, IndexLink } from "react-router";

require('!style!css!sass!../sass/main.scss');

import Layout from "pages/attendee/Layout";
import Home from "pages/attendee/Home";
import NewsFeed from "pages/attendee/NewsFeed";
import People from "pages/attendee/People";
import Events from "pages/attendee/Events";
import EventPage from "pages/attendee/Event";
import Profile from "pages/attendee/Profile";
import Info from "pages/attendee/Info";
import Login from "pages/attendee/Login";

import AppHistory from 'util/AppHistory';
import AuthService from 'util/AuthService';
import * as config from 'auth0.config.js';

const app = document.getElementById('app');
const redirectCallback = (newProfile) => {
  redirectAfterLogin()
}

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!AuthService.loggedIn()) {
    localStorage.setItem('redirect_after_login', nextState.location.pathname);
    AppHistory.push('login')
  } else {
    AuthService.on('profile_updated', redirectCallback)
  }
};

const redirectAfterLogin = () => {
  const url = localStorage.getItem('redirect_after_login')
  if (url) {
    localStorage.removeItem('redirect_after_login')
    AppHistory.push(url)
    AuthService.removeListener('profile_updated', redirectCallback)
  }
};

ReactDOM.render(
  <Router history={AppHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute apiBaseURL="https://dev.calligre.com/api" component={Home} onEnter={requireAuth}></IndexRoute>
      <Route path="newsfeed" component={NewsFeed} onEnter={requireAuth}></Route>
      <Route path="people" component={People} onEnter={requireAuth}></Route>
      <Route path='people/:id' component={Profile} onEnter={requireAuth} />
      <Route path="events" component={Events} onEnter={requireAuth}></Route>
      <Route path="events/:eventId" component={EventPage} onEnter={requireAuth}></Route>
      <Route path="profile" component={Profile} onEnter={requireAuth}></Route>
      <Route path="info" apiBaseURL="https://dev.calligre.com/api" component={Info} onEnter={requireAuth}></Route>
      <Route path="login" component={Login}></Route>
      <Route path="access_token=:token" component={Login} />
    </Route>
  </Router>,
app);
