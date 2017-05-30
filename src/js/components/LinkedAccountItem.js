import React, { PropTypes } from 'react'
import {ListGroupItem, Button} from 'react-bootstrap'
import AuthService from 'util/AuthService'
import { SocialIcon } from 'react-social-icons'

export class LinkedAccountItem extends React.Component {
  static propTypes = {
    profile: PropTypes.object,
    identity: PropTypes.object
  }

  unlink(identity){
    if (window.confirm(`Are you sure you want to unlink ${identity.connection}?`)) {
      AuthService.unlinkAccount(identity)
    }
  }

  renderUnlink(){
    const { profile, identity } = this.props
    // TODO: when identities are returned as part of the queried profile,
    // check if current user id

    if (profile.user_id != identity.provider + '|' + identity.user_id){
      return (
        <Button className="unlink" onClick={this.unlink.bind(this, identity)}>
            unlink
          </Button>
      )
    }
    return (
      <div className="unlink" id="main"> Main </div>
    )
  }

  render(){
    const { identity } = this.props
    var url;
    if (identity.provider == "facebook") {
      url = "http://facebook.com/" + identity.user_id
    } else if (identity.provider == "twitter") {
      url = "http://twitter.com/intent/user?user_id=" + identity.user_id
    }
      
    return (
      <div className="linkedAccount">
        <SocialIcon url={url} />
        {this.renderUnlink()}
      </div>
    )
  }
}

export default LinkedAccountItem;
