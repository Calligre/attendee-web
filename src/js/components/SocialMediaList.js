import React from 'react';
import { ListGroup } from 'react-bootstrap';
import SocialMediaItem from './SocialMediaItem';

export class SocialMediaList extends React.Component {
  render() {
    const profile = this.props.profile;
    let items = [];
    if (profile.facebook) {
      items.push(<SocialMediaItem provider="facebook" identity={profile.facebook} />);
    }
    if (profile.twitter) {
      items.push(<SocialMediaItem provider="twitter" identity={profile.twitter} />);
    }
    if (profile.linkedin) {
      items.push(<SocialMediaItem provider="linkedin" identity={profile.linkedin} />);
    }

    return (
      <div>
        <ListGroup>{items}</ListGroup>
      </div>
    );
  }
}

export default SocialMediaList;
