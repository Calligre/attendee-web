import React, { PropTypes } from 'react'
import AuthService from 'util/AuthService'

export default class Login extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    location: PropTypes.object,
  }

  render() {
    return (
      <div>
        <h2>Login to Calligre</h2>
        <a onClick={AuthService.login}>Let's get started!</a>
      </div>
    )
  }
}
