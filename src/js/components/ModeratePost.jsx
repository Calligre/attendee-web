import React from 'react';

import { Button } from 'react-bootstrap';
import FaFlag from 'react-icons/lib/fa/flag';
import FaHeart from 'react-icons/lib/fa/heart';
import FaTrashO from 'react-icons/lib/fa/trash-o';
import NewsFeedStore from 'stores/NewsFeedStore';
import { Card as BetterCard, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
let moment = require('moment')


export default class ModeratePost extends React.Component {

  constructor(props) {
    super(props);
    this.state = props;
  }

  unflagPost = () => {
    NewsFeedStore.unflagPost(this.state.id, true);
  }

  deletePost = () => {
    NewsFeedStore.deletePost(this.state.id, true);
  }

  render() {
    const {
      // current_user_flagged,
      // current_user_likes,
      flag_count,
      like_count,
      media_link,
      poster_icon,
      poster_id,
      poster_name,
      text,
      timestamp,
    } = this.state;

    return (
      <BetterCard>
        <CardTitle
          avatar={poster_icon}
          title={poster_name}
          subtitle={moment(timestamp * 1000).format('MMMM Do, h:mm:ss a')} />
            <Button className="admin-delete btn-danger" onClick={this.deletePost}>
              Delete
            </Button>
            <Button className="admin-unflag btn-danger" onClick={this.unflagPost}>
              Unflag
            </Button>
        <CardText>{text}</CardText>
        { media_link && media_link !== '' &&
          <CardMedia
          aspectRatio="wide"
          image={media_link} /> }
        <CardActions>
          <FaHeart
            className="heart-icon post-interaction"
            size={20} />
          <span className="like-count no-selection">{like_count}</span>
          <span className="no-selection repost-icon">Flagged {flag_count} time(s)</span>
        </CardActions>
      </BetterCard>
    );
  }
}
