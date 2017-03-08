import React, { PropTypes } from 'react'
import AuthService from 'util/AuthService'

export default class Login extends React.Component {
  render() {
    if (localStorage.getItem('logging_in')) {
      return (<div></div>)
    }

    return (
      <div id="loginContainer">
        <div className="logo">
          <div className="c"></div>
          <div className="rest">alligre</div>
        </div>
        <button onClick={AuthService.login}>Login or Sign Up</button>
      </div>
    )
  }
}
