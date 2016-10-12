import React, { PropTypes } from 'react';
import AuthService from '../util/AuthService';

export default class Login extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    location: PropTypes.object,
    auth: PropTypes.instanceOf(AuthService),
  }

  render() {
    const { auth } = this.props.route;
    return (
      <div>
        <h2>Login to Calligre</h2>
        <a onClick={auth.login.bind(this)}>Let's get started!</a>
      </div>
    )
  }
}
