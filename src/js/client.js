import React from "react";
import ReactDOM from "react-dom";
import { Router, useRouterHistory } from 'react-router'
import { Route, IndexRoute, IndexLink } from "react-router";
import { createHashHistory } from 'history'

require('!style!css!sass!../sass/main.scss');

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NewsFeed from "./pages/NewsFeed";
import People from "./pages/People";
import Events from "./pages/Events";
import EventPage from "./pages/Event";
import Profile from "./pages/Profile";
import Info from "./pages/Info";
import Login from "./pages/Login";

import AuthService from './util/AuthService';
import * as config from './auth0.config.js';

const app = document.getElementById('app');
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })

const auth = new AuthService(config.clientId, config.clientDomain);

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ nextPathname: nextState.location.pathname }, '/login');
  }
};

ReactDOM.render(
  <Router history={appHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute apiBaseURL="https://dev.calligre.com/api" component={Home}></IndexRoute>
      <Route path="newsfeed" component={NewsFeed}></Route>
      <Route path="people" component={People}></Route>
      <Route path='people/:id' component={Profile} />
      <Route path="events" component={Events}></Route>
      <Route path="events/:eventId" component={EventPage}></Route>
      <Route path="profile" component={Profile}></Route>
      <Route path="info" apiBaseURL="https://dev.calligre.com/api" component={Info}></Route>
    </Route>
  </Router>,
app);
