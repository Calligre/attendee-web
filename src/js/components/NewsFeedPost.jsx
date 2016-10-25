import React from "react";

import NewsFeedStore from "../stores/NewsFeedStore";

export default class NewsFeedPost extends React.Component {

  constructor() {
    super();
    this.togglePictureDisplay = this.togglePictureDisplay.bind(this);
    this.changeLike = this.changeLike.bind(this);
    this.state = {
      showPicture: false,
      liked: 0,
      likeStyle: {color: 'black', fontSize: "40px", marginLeft: "50px"},
    };
  }

  // componentWillMount() {
  //   NewsFeedStore.on("updated", this.getNewsFeedPosts); // TODO
  //   NewsFeedStore.on("error", this.showError);
  // }

  // componentWillUnmount() {
  //   NewsFeedStore.removeListener("updated", this.getNewsFeedPosts);
  //   NewsFeedStore.removeListener("error", this.showError);
  // }

  showError(){
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
        likeStyle: {color: 'black', fontSize: "40px", marginLeft: "50px"},
      });
    } else {
      NewsFeedStore.incrementLike();
      this.setState({
        liked: 1,
        likeStyle: {color: 'red', fontSize: "40px", marginLeft: "50px"},
      })
    }

  }

  render() {

    const { id, posterid, text, like_count, media_link, timestamp } = this.props;

    // TODO: This is a dirty hack job until the API has a solution
    let likeCount = like_count + this.state.liked;



    var width100 = {
      margin: "30px -10% 15px 20%",
    }

    var font30 = {
      fontSize: "26px"
    }

    var font40 = {
      fontSize: "32px"
    }

    var font24 = {
      fontSize: "20px",
    }

    var fleft = {
      float: "left"
    }

    var fcenter = {
      float: "center"
    }


    let renderPicture;
    if (this.props.media_link === undefined || this.props.media_link === "") {
      renderPicture = (
        <span style={font24}>NO MEDIA LINK</span>
      );
    } else if (!this.state.showPicture) {
      renderPicture = (
        <span class="picture-text" style={font30} onClick={this.togglePictureDisplay}>Show Photo...</span>
      );
    } else {
      renderPicture = (
        <span class="picture" onClick={this.togglePictureDisplay}>
          <img src={media_link}/>
        </span>
      );
    }




    return (
      <div class="newsfeed-post" style={width100}>
        <div class="test-post">
          <span class="username" style={font40}>{posterid} - </span>
          <span class="text" style={font30}>{text} </span>
        </div>
        <span class="likes" style={this.state.likeStyle} onClick={this.changeLike}>&hearts;</span>
        <span style={font40}>{likeCount} - </span>
        {renderPicture}
      </div>
    );
  }
}
