import { EventEmitter } from 'events';
import { isTokenExpired } from './jwtHelper';
import Auth0Lock from 'auth0-lock';
import * as config from 'auth0.config.js';
import PeopleStore from 'stores/PeopleStore';
import UrlService from 'util/UrlService';

const $ = require('jquery');

const url = UrlService.getUrl();


class AuthService extends EventEmitter {
  constructor(clientId, domain) {
    super();
    this.clientId = clientId;
    this.domain = domain;
    // Configure Auth0
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirect: true,
        responseType: 'token',
        redirectUrl: `${window.location.origin}/#`,
      },
    });
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this));
    // Add callback for lock `authorization_error` event
    this.lock.on('authorization_error', this._authorizationError.bind(this));
    // binds login functions to keep this context
    this.login = this.login.bind(this);

    this.lock.on('hide', () => {
      localStorage.removeItem('logging_in');
    });
  }

  _doAuthentication(authResult) {
    if (authResult.state && authResult.state.includes('linking')) {
      localStorage.setItem('redirect_after_login', 'profile');
      this.linkAccount(authResult.idToken); // linkAccount when state is linking
    } else {
      // Saves the user token
      this.setToken(authResult.idToken);
      // Async loads the user profile data
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          console.log('Error loading the Profile', error);
        } else {
          this.setProfile(profile);
          this._createUser();
        }
        localStorage.removeItem('logging_in');
      });
    }
  }

  _createUser() {
    const profile = this.getProfile();
    const id = this.getCurrentUserId();
    $.ajax({
      url: `${url}/user/${id}`,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
      cache: false,
      success(response) {},
      error(error) {
        const userData = {
          id,
          first_name: profile.given_name || profile.name.split(' ')[0],
          last_name: profile.family_name || profile.name.split(' ')[profile.name.split(' ').length - 1],
          email: profile.email || 'test@example.com',
          photo: profile.picture,
        };
        PeopleStore.create(userData);
      },
    });
  }

  _authorizationError(error) {
    // Unexpected authentication error
    console.log('Authentication Error', error);
  }

  login() {
    // Call the show method to display the authentication window.
    this.lock.show();
    localStorage.setItem('logging_in', true);
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !isTokenExpired(token);
  }

  setProfile(profile) {
    // Saves profile data to localStorage
    localStorage.setItem('profile', JSON.stringify(profile));
    // Triggers profile_updated event to update the UI
    this.emit('profile_updated', profile);
  }

  getProfile() {
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(localStorage.profile) : {};
  }

  getCurrentUserId() {
    return this.getProfile().user_id;
  }

  setToken(idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.clear();
  }

  fetchApi(url, options) {
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    };

    const userId = this.getCurrentUserId();
    return fetch(`https://${this.domain}/api/v2/users/${userId}/${url}`, {
      headers,
      ...options,
    })
    .then(response => response.json());
  }

  linkAccount(token) {
    // prepares api request body data
    const data = {
      link_with: token,
    };
    // sends a post to auth0 api to create a new identity
    return this.fetchApi('identities', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then((response) => {
      const profile = this.getProfile();
      if (response.error) {
        console.log(response.message);
      } else {
        this.setProfile({ ...profile, identities: response }); // updates profile identities
      }
      localStorage.removeItem('logging_in');
    });
  }

  unlinkAccount(identity) {
    // sends a delete request to unlink the account identity
    this.fetchApi(`identities/${identity.provider}/${identity.user_id}`, {
      method: 'DELETE',
    })
    .then((response) => {
      const profile = this.getProfile();
      if (response.error) {
        console.log(response.message);
      } else {
        this.setProfile({ ...profile, identities: response }); // updates profile identities
      }
    });
  }
}


const authService = new AuthService(config.clientId, config.clientDomain);
export default authService;
