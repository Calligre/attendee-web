import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory, IndexLink } from "react-router";

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

const auth = new AuthService(config.clientId, config.clientDomain);

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ nextPathname: nextState.location.pathname }, '/login');
  }
};

ReactDOM.render(
  <Router history={hashHistory}>
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
      <Route path="access_token=:token" component={Login} auth={auth}/>
    </Route>
  </Router>,
app);
