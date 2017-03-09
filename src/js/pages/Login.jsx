import React, { PropTypes } from 'react'
import AuthService from 'util/AuthService'

export default class Login extends React.Component {
  render() {
    if (localStorage.getItem('logging_in')) {
      return (<div></div>)
    }

    return (
      <div>
        <h2>Login to Calligre</h2>
        <a onClick={AuthService.login}>Let's get started!</a>
      </div>
    )
  }
}