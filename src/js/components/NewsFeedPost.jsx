import React from "react";
import NewsFeedStore from "stores/NewsFeedStore";
import FaHeart from 'react-icons/lib/fa/heart';
import FaRetweet from 'react-icons/lib/fa/retweet';

export default class NewsFeedPost extends React.Component {

  constructor(props) {
    super(props);
    this.togglePictureDisplay = this.togglePictureDisplay.bind(this);
    this.changeLike = this.changeLike.bind(this);
    this.state = this.props;
    console.log("THIS IS MY STATE");
    console.log(this.state);

    // likeStyle: {color: 'black', fontSize: "40px", marginLeft: "50px"},
  }

  // componentWillMount() {
  //   NewsFeedStore.on("updated", this.getNewsFeedPosts); // TODO
  //   NewsFeedStore.on("error", this.showError);
  // }

  // componentWillUnmount() {
  //   NewsFeedStore.removeListener("updated", this.getNewsFeedPosts);
  //   NewsFeedStore.removeListener("error", this.showError);
  // }

  showError() {
    console.log(NewsFeedStoreStore.error);
  }

  togglePictureDisplay() {
    this.setState({
      showPicture: !this.state.showPicture
    });
  }

  changeLike() {
    // TODO: How are we doing this on the backend?
    if (this.state.liked) {
      // When this works, remove liked attribute
      NewsFeedStore.decrementLike();
      this.setState({
        liked: 0,
        // likeStyle: {color: 'black', fontSize: "40px", marginLeft: "50px"},
      });
    } else {
      NewsFeedStore.incrementLike();
      this.setState({
        liked: 1,
        // likeStyle: {color: 'red', fontSize: "40px", marginLeft: "50px"},
      })
    }

  }

  render() {

    console.log("NEWS FEED PROPS")
    console.log(this.state);

    let { current_user_likes, like_count, poster_icon,
            poster_id, poster_name, text, media_link } = this.props;

    // TODO: This is a dirty hack job until the API has a solution
    let likeCount = like_count + this.state.liked;
    // TODO: Remove this
    current_user_likes = true;

    let heartColor = {
      color: current_user_likes ? "red" : "inherit",
    }

    let renderPicture;
    if (this.props.media_link === undefined || this.props.media_link === "") {
      renderPicture = (
        <span>NO MEDIA LINK</span>
      );
    } else if (!this.state.showPicture) {
      renderPicture = (
        <span className="picture-text" onClick={this.togglePictureDisplay}>Show Photo...</span>
      );
    } else {
      renderPicture = (
        <span className="picture" onClick={this.togglePictureDisplay}>
          <img src={media_link}/>
        </span>
      );
    }

    return (
      <div className="newsfeed-post">
        <div className="user-photo-container inline">
          <img src={poster_icon} className="user-photo"/>
        </div>
        <div className="post-text inline">
          <p className="username">hfsjkfhkdsahfjkdsfhjkdsfhjkfdhskajfhsd fsdhjkfhjkdsfsd</p>
          <p className="text">{text}</p>
          <div className="social-bar">
            <FaHeart className={"heart-icon"} style={heartColor} size={20}/>
            <span className="like-count">{like_count}</span>
            <FaRetweet className="retweet-button" size={28}/>
            {<span className="image-toggle">Show image</span>}
          </div>
        </div>
      </div>
    );
  }
}

// {renderPicture}



