import { EventEmitter } from 'events'
import { isTokenExpired } from './jwtHelper'
import Auth0Lock from 'auth0-lock'
import * as config from 'auth0.config.js';
import AppHistory from 'util/AppHistory';
import PeopleStore from 'stores/PeopleStore'

var $ = require("jquery");
var url = "https://dev.calligre.com"

class AuthService extends EventEmitter {
  constructor(clientId, domain) {
    super()
    // Configure Auth0
    this.lock = new Auth0Lock(clientId, domain, {auth: {redirect: false}})
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    // Add callback for lock `authorization_error` event
    this.lock.on('authorization_error', this._authorizationError.bind(this))
    // binds login functions to keep this context
    this.login = this.login.bind(this)

    this.lock.on('hide', () => {
      AppHistory.push("/");
    })
  }

  _doAuthentication(authResult){
    // Saves the user token
    this.setToken(authResult.idToken)
    // Async loads the user profile data
    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        console.log('Error loading the Profile', error)
      } else {
        this.setProfile(profile);
        this._createUser();
      }
    })
  }

  _createUser() {
    const profile = this.getProfile();
    const id = profile.identities[0].user_id
    $.ajax({
      url: "https://dev.calligre.com/api/user/" + id,
      dataType: "json",
      headers: {
        "Authorization": "Bearer " + this.getToken()
      },
      cache: false,
      success: function(response){},
      error: function(error){
        const userData = {
          id: profile.identities[0].user_id,
          first_name: profile.given_name,
          last_name: profile.family_name,
          email: profile.email,
        }
        PeopleStore.create(userData);
      }
    });
  }

  _authorizationError(error){
    // Unexpected authentication error
    console.log('Authentication Error', error)
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show()
  }

  loggedIn(){
    // Checks if there is a saved token and it's still valid
    const token = this.getToken()
    return !!token && !isTokenExpired(token)
  }

  setProfile(profile){
    // Saves profile data to localStorage
    localStorage.setItem('profile', JSON.stringify(profile))
    // Triggers profile_updated event to update the UI
    this.emit('profile_updated', profile)
  }

  getProfile(){
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(localStorage.profile) : {}
  }

  getCurrentUserId(){
    return this.getProfile().identities[0].user_id;
  }

  setToken(idToken){
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken)
  }

  getToken(){
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token')
  }

  logout(){
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
  }
}


const authService = new AuthService(config.clientId, config.clientDomain);
export default authService;
