import React from "react";
import NewsFeedStore from "stores/NewsFeedStore";
import FaHeart from 'react-icons/lib/fa/heart';
import FaRetweet from 'react-icons/lib/fa/retweet';

export default class NewsFeedPost extends React.Component {

  constructor(props) {
    super(props);
    this.changeLike = this.changeLike.bind(this);
    this.retweet = this.retweet.bind(this);
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
      NewsFeedStore.unlikePost(this.state.id);
      // TODO: Potentially move this logic to be based on emitted action?
      this.setState({
        current_user_likes: false,
        like_count: (parseInt(this.state.like_count) - 1).toString(),
      });

    } else {
      NewsFeedStore.likePost(this.state.id);
      this.setState({
        current_user_likes: true,
        like_count: (parseInt(this.state.like_count) + 1).toString(),
      });
    }
  }

  retweet() {
    console.log("RETWEET");
    this.props.rt("\"" + this.state.text + "\" - " + this.state.poster_name + "\n");
    window.scrollTo(0, 0);
  }

  render() {

    let {
      current_user_likes,
      like_count,
      media_link,
      poster_icon,
      poster_id,
      poster_name,
      text,
    } = this.state;

    const heartColor = {
      color: current_user_likes ? "red" : "inherit",
    }

    let imageText = null;
    if (media_link && media_link !== "") {
      imageText = (
        <span className="show-image link clickable no-selection">
          Show Image
        </span>
      );
    }

    return (
      <div className="newsfeed-post">
        <div className="user-photo-container inline">
          <img src={poster_icon} className="user-photo no-selection"/>
        </div>
        <div className="post-text inline">
          <p className="username">{poster_name}</p>
          <p className="text">{text}</p>
          <div className="social-bar">
            <FaHeart className="heart-icon clickable" onClick={this.changeLike} style={heartColor} size={20}/>
            <span className="like-count no-selection">{like_count}</span>
            <FaRetweet className="retweet-button clickable" onClick={this.retweet} size={28}/>
            {imageText}
          </div>
        </div>
      </div>
    );
  }
}
