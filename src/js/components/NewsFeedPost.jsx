import React from "react";
import NewsFeedStore from "stores/NewsFeedStore";
import FaHeart from 'react-icons/lib/fa/heart';
import FaRetweet from 'react-icons/lib/fa/retweet';

export default class NewsFeedPost extends React.Component {

  constructor(props) {
    super(props);
    // this.togglePictureDisplay = this.togglePictureDisplay.bind(this);
    this.changeLike = this.changeLike.bind(this);
    this.state = this.props;
  }

  // componentWillMount() {
  //   NewsFeedStore.on("updated", this.getNewsFeedPosts);
  //   NewsFeedStore.on("error", this.showError);
  // }

  // componentWillUnmount() {
  //   NewsFeedStore.removeListener("updated", this.getNewsFeedPosts);
  //   NewsFeedStore.removeListener("error", this.showError);
  // }

  showError() {
    console.log(NewsFeedStoreStore.error);
  }

  changeLike() {
    if (this.state.current_user_likes) {
      NewsFeedStore.decrementLike();
      this.setState({
        current_user_likes: false,
      });
    } else {
      NewsFeedStore.incrementLike();
      this.setState({
        current_user_likes: true,
      });
    }

  }

  render() {

    let { current_user_likes, like_count, poster_icon,
          poster_id, poster_name, text, media_link } = this.state;

    const heartColor = {
      color: current_user_likes ? "red" : "inherit",
    }

    let imageText = null;
    if (media_link && media_link !== "") {
      imageText = (
        <span className="show-image link clickable no_selection">
          Show Image
        </span>
      );
    }

    return (
      <div className="newsfeed-post">
        <div className="user-photo-container inline">
          <img src={poster_icon} className="user-photo"/>
        </div>
        <div className="post-text inline">
          <p className="username">{poster_name}</p>
          <p className="text">{text}</p>
          <div className="social-bar">
            <FaHeart className="heart-icon clickable" onClick={this.changeLike} style={heartColor} size={20}/>
            <span className="like-count no_selection">{like_count}</span>
            <FaRetweet className="retweet-button clickable" size={28}/>
            {imageText}
          </div>
        </div>
      </div>
    );
  }
}
