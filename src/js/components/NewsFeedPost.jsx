import React from "react";
import NewsFeedStore from "stores/NewsFeedStore";

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
      newsFeedStore.decrementLike();
      this.setState({
        liked: 0,
        // likeStyle: {color: 'black', fontSize: "40px", marginLeft: "50px"},
      });
    } else {
      newsFeedStore.incrementLike();
      this.setState({
        liked: 1,
        // likeStyle: {color: 'red', fontSize: "40px", marginLeft: "50px"},
      })
    }

  }

  render() {

    const { id, posterid, text, like_count, media_link, timestamp } = this.props;

    // TODO: This is a dirty hack job until the API has a solution
    let likeCount = like_count + this.state.liked;

    let renderPicture;
    if (this.props.media_link === undefined || this.props.media_link === "") {
      renderPicture = (
        <span>NO MEDIA LINK</span>
      );
    } else if (!this.state.showPicture) {
      renderPicture = (
        <span class="picture-text" onClick={this.togglePictureDisplay}>Show Photo...</span>
      );
    } else {
      renderPicture = (
        <span class="picture" onClick={this.togglePictureDisplay}>
          <img src={media_link}/>
        </span>
      );
    }

    return (
      <div class="newsfeed-post">
        <div class="test-post">
          <span class="username">{posterid} - </span>
          <span class="text">{text} </span>
        </div>
        <span class="likes" onClick={this.changeLike}>&hearts;</span>
        <span>{like_count} - </span>
        {renderPicture}
      </div>
    );
  }
<<<<<<< 6f5487546d34c19ecf7af3378b0f9d2e16a4dd00
}
// style={this.state.likeStyle}
=======
}
>>>>>>> Work on merge
