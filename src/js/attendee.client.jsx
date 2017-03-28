
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, useRouterHistory, IndexRoute, IndexLink } from "react-router";

require('!style!css!sass!../sass/main.scss');

import Layout from "pages/attendee/Layout";
import Home from "pages/attendee/Home";
import NewsFeed from "pages/attendee/NewsFeed";
import People from "pages/attendee/People";
import Events from "pages/attendee/Events";
import Event from "pages/attendee/Event";
import Profile from "pages/attendee/Profile";
import Login from "pages/Login";

import AppHistory from 'util/AppHistory';
import AuthService from 'util/AuthService';
import UrlService from 'util/UrlService';
import * as config from 'auth0.config.js';

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
      <IndexRoute apiBaseURL={UrlService.getUrl()} component={Home} onEnter={requireAuth}></IndexRoute>
      <Route path="people" component={People} onEnter={requireAuth}></Route>
      <Route path="people/:id" component={Profile} onEnter={requireAuth} />
      <Route path="newsfeed" component={NewsFeed} onEnter={requireAuth}></Route>
      <Route path="events" component={Events} onEnter={requireAuth}></Route>
      <Route path="events/:eventId" component={Event} onEnter={requireAuth}></Route>
      <Route path="profile" component={Profile} onEnter={requireAuth}></Route>
      <Route path="login" component={Login}></Route>
      <Route path="access_token=:token" component={Login} />
    </Route>
  </Router>,
app);
