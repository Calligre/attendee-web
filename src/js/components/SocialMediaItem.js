import React from 'react';
import { SocialIcon } from 'react-social-icons';

export class SocialMediaItem extends React.Component {
  render() {
    const { provider, identity } = this.props;
    let url;
    if (provider === 'facebook') {
      url = 'http://facebook.com/' + identity;
    } else if (provider === 'twitter') {
      url = 'http://twitter.com/' + identity;
    } else if (provider === 'linkedin') {
      url = 'https://www.linkedin.com/in/' + identity;
    }

    return (
      <div className="linkedAccount">
        <SocialIcon url={url} />
      </div>
    );
  }
}

export default SocialMediaItem;
