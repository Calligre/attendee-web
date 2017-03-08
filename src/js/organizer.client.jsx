import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, useRouterHistory, IndexRoute, IndexLink } from "react-router";


import Layout from "pages/attendee/Layout";
import Home from "pages/attendee/Home";
import NewsFeed from "pages/attendee/NewsFeed";
import People from "pages/attendee/People";
import Events from "pages/attendee/Events";
import EventPage from "pages/attendee/Event";
import Profile from "pages/Profile";
import Info from "pages/attendee/Info";
import Login from "pages/attendee/Login";

import AppHistory from 'util/AppHistory';
import AuthService from 'util/AuthService';
import * as config from 'auth0.config.js';

require('!style!css!sass!../sass/main.scss');

const app = document.getElementById('app');

const auth = new AuthService(config.clientId, config.clientDomain);

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ nextPathname: nextState.location.pathname }, '/login');
  }
};

ReactDOM.render(
  <Router history={AppHistory}>
    <Route path="/" component={Layout} auth={auth}>
      <IndexRoute apiBaseURL="https://dev.calligre.com/api" component={Home} onEnter={requireAuth}></IndexRoute>
      <Route path="newsfeed" component={NewsFeed} onEnter={requireAuth}></Route>
      <Route path="people" component={People} onEnter={requireAuth}></Route>
      <Route path='people/:id' component={Profile} onEnter={requireAuth} />
      <Route path="events" component={Events} onEnter={requireAuth}></Route>
      <Route path="events/:eventId" component={EventPage} onEnter={requireAuth}></Route>
      <Route path="profile" component={Profile} onEnter={requireAuth}></Route>
      <Route path="info" apiBaseURL="https://dev.calligre.com/api" component={Info} onEnter={requireAuth}></Route>
      <Route path="login" component={Login} auth={auth}></Route>
    </Route>
  </Router>,
app);
