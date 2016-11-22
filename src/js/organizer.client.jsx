import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';


import Layout from 'pages/organizer/Layout';
import Branding from 'pages/organizer/Branding';
import Calendar from 'pages/organizer/Calendar';
import Cards from 'pages/organizer/Cards';
import Preferences from 'pages/organizer/Preferences';
import Results from 'pages/organizer/Results';

import AppHistory from 'util/AppHistory';

require('!style!css!sass!../sass/main.scss');

const app = document.getElementById('app');

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  // if (!AuthService.loggedIn()) {
  //   replace({ nextPathname: nextState.location.pathname }, '/login');
  // }
};

ReactDOM.render(
  <Router history={AppHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute apiBaseURL="https://dev.calligre.com/api" component={Branding} />
      <Route path="calendar" component={Calendar} />
      <Route path="cards" component={Cards} />
      <Route path="preferences" component={Preferences} />
      <Route path="results" component={Results} />
    </Route>
  </Router>,
app);
