import React, { PropTypes } from 'react'
import {ListGroup, Button} from 'react-bootstrap'
import LinkedAccountItem from './LinkedAccountItem'
import AuthService from 'util/AuthService'
import LinkAccountService from 'util/LinkAccountService'

export class LinkedAccountsList extends React.Component {
  render(){
    const linker = new LinkAccountService()
    const profile = AuthService.getProfile()
    let items = []
    if (profile && profile.identities) {
      items = profile.identities.map(identity => {
        return (<LinkedAccountItem identity={identity} />)
      })
    }

    var linkAnother = null;
    if (profile.identities.length < 2) {
      linkAnother = <Button onClick={linker.link}>Link Another Account</Button>
    }

    return (
      <div>
        <ListGroup>{items}</ListGroup>
        {linkAnother}
      </div>
    )
  }
}

export default LinkedAccountsList;
