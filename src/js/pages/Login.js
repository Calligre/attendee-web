import React, { PropTypes as T } from 'react'
import AuthService from '../util/AuthService'

export default class Login extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    location: T.object,
    auth: T.instanceOf(AuthService)
  }

  render() {
    const { auth } = this.props.route
    return (
      <div>
        <h2>Login to Calligre</h2>
        <a onClick={auth.login.bind(this)}>Let's get started!</a>
      </div>
    )
  }
}
