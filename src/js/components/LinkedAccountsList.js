import React, { PropTypes } from 'react'
import {ListGroup, Button} from 'react-bootstrap'
import LinkedAccountItem from './LinkedAccountItem'
import AuthService from '../util/AuthService'
import LinkAccountService from '../util/LinkAccountService'

export class LinkedAccountsList extends React.Component {
  static propTypes = {
    auth: PropTypes.instanceOf(AuthService),
    profile: PropTypes.object
  }

  render(){
    const { profile, auth } = this.props
    const linker = new LinkAccountService(auth)
    let items = []
    if (profile && profile.identities) {
      items = profile.identities.map(identity => {
        return (<LinkedAccountItem {...this.props} identity={identity} />)
      })
    }

    return (
      <div>
        <h3>Linked Accounts</h3>
        <ListGroup>{items}</ListGroup>
        <Button onClick={linker.link} bsStyle="primary">Link Account</Button>
      </div>
    )
  }
}

export default LinkedAccountsList;
