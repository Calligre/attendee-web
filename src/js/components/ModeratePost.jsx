import React from 'react';

import { Button } from 'react-bootstrap';
import FaFlag from 'react-icons/lib/fa/flag';
import FaHeart from 'react-icons/lib/fa/heart';
import FaTrashO from 'react-icons/lib/fa/trash-o';
import NewsFeedStore from 'stores/NewsFeedStore';
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

    let image = null;
    if (media_link && media_link !== '') {
      image = (
        <span className="link no-selection">
          <img src={media_link}/>
        </span>
      );
    }

    return (
      <div className="newsfeed-post">
        <div className="profile-photo inline">
          <img alt="poster" src={poster_icon} className="user-photo no-selection" />
        </div>
        <div className="post-text inline">
          <div className="right-options">
            <Button className="right-icons btn-danger" onClick={this.deletePost}>
              Delete
            </Button>
            <Button className="right-icons btn-danger" onClick={this.unflagPost}>
              Unflag
            </Button>
          </div>
          <p className="username">{poster_name}</p>
          <p className="text">{text}</p>
          {image}
          <div className="soc-bar">
            <FaHeart
              className="heart-icon"
              size={20}
            />
            <span className="like-count no-selection">{like_count}</span>
            <span className="social-spacing no-selection">Flagged {flag_count} time(s)</span>
            <span className="social-spacing no-selection date">
              {moment(timestamp * 1000).format('MMMM Do, h:mm:ss a')}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
