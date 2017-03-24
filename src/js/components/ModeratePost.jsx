import React from 'react';

import { Button } from 'react-bootstrap';
import FaFlag from 'react-icons/lib/fa/flag';
import FaHeart from 'react-icons/lib/fa/heart';
import FaTrashO from 'react-icons/lib/fa/trash-o';
import NewsFeedStore from 'stores/NewsFeedStore';


export default class ModeratePost extends React.Component {

  constructor(props) {
    super(props);
    this.state = props;

    this.unflagPost = this.unflagPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    // this.showImage = this.showImage.bind(this);
  }

  unflagPost() {
    console.log("Unflagging post");
    NewsFeedStore.unflagPost(this.state.id, true);
  }

  deletePost() {
    console.log("Deleting Post");
    NewsFeedStore.deletePost(this.state.id, true);
  }

  // showImage() {
  //   this.state.imgOverlay(this.state.media_link);
  // }

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
              Delete Post
            </Button>
            <Button className="right-icons btn-danger" onClick={this.unflagPost}>
              Unflag post
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
            <span className="social-spacing no-selection">Flagged {flag_count} times</span>
          </div>
        </div>
      </div>
    );
  }
}
