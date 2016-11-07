import React, { PropTypes } from 'react'
import {ListGroup, Button} from 'react-bootstrap'
import LinkedAccountItem from './LinkedAccountItem'
import AuthService from 'util/AuthService'
import LinkAccountService from 'util/LinkAccountService'

export class LinkedAccountsList extends React.Component {
  constructor() {
    super()
    this.state = {
      profile: AuthService.getProfile()
    }
    AuthService.on('profile_updated', (newProfile) => {
      this.setState({profile: newProfile})
    })
  }

  render(){
    const linker = new LinkAccountService()
    const profile = this.state.profile
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
