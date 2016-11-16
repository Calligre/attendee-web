import Auth0Lock from 'auth0-lock'
import AuthService from "util/AuthService"

export default class LinkAccountService {
  constructor() {
    this.lock = new Auth0Lock(AuthService.clientId, AuthService.domain, {
      auth: {params: {state: 'linking'}},
      allowedConnections: ['facebook', 'twitter', 'google-oauth2'],
      languageDictionary: { // allows to override dictionary entries
        title: 'Link with:'
      }
    })
    this.link = this.link.bind(this)

    this.lock.on('hide', () => {
      localStorage.removeItem('logging_in')
    })
  }

  link(){
    // Call the show method to display the authentication window.
    this.lock.show()
    localStorage.setItem('logging_in', true)
  }
}
