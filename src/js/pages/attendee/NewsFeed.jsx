import React from "react";

import NewsFeedPost from "components/NewsFeedPost";
import NewsFeedStore from "stores/NewsFeedStore";
// import style from 'sass/newsfeed.scss';


export default class NewsFeed extends React.Component {

	constructor() {
    super();
    this.getNewsFeedPosts = this.getNewsFeedPosts.bind(this);
    this.createPost = this.createPost.bind(this);
    this.twToggle = this.twToggle.bind(this);
    this.fbToggle = this.fbToggle.bind(this);
    this.state = {
      contentFeed: {
        items: [],
      },
      fbPost: false,
      twPost: false,
      message: "#SoftwareDemoDay",
      user:
        {
          id: 0,
          name: "",
          twIntegration: true,
          fbIntegration: true,
        },
    };
    NewsFeedStore.getAll();
  }

  componentWillMount() {
    NewsFeedStore.on("updated", this.getNewsFeedPosts);
    NewsFeedStore.on("error", this.showError);
  }

  componentWillUnmount() {
    NewsFeedStore.removeListener("updated", this.getNewsFeedPosts);
    NewsFeedStore.removeListener("error", this.showError);
  }

  getNewsFeedPosts() {
    console.log(NewsFeedStore.contentFeed);
    console.log(this.state.contentFeed);
    this.setState({
      contentFeed: NewsFeedStore.contentFeed,
    });
  }

  createPost() {
    let text = document.getElementsByClassName(
      "user-post-form")[0].getElementsByTagName('textarea')[0].value;
    NewsFeedStore.createPost(text, this.state.fbPost, this.state.twPost);

    console.log(text);
  }

  showError(){
    console.log(EventStore.error);
  }

  fbToggle() {
    this.setState({
      fbPost: !this.state.fbPost,
    })
  }

  twToggle() {
    this.setState({
      twPost: !this.state.twPost,
    });
  }


  render() {
    const { contentFeed, fbPost, twPost, user, fbToggle, twToggle } = this.state;
    console.log(fbPost);
    console.log(twPost);
    console.log (user.fbIntegration);
    console.log(contentFeed);
    console.log(contentFeed.items);

    const NewsFeedPosts = contentFeed.items.map((post) => {
        console.log(post)
        return <NewsFeedPost key={post.timestamp} {...post}/>;
    });

    function displayFacebook() {
      if (user.fbIntegration) {
        console.log("HERE")
        return (
          <div>
            <span class="fb-check" style={fsize}><input type="checkbox"
                  onChange={fbToggle}/>Facebook</span>
          </div>
        );
      }
    }

    function displayTwitter() {
      if (user.twIntegration) {
        return (
          <div>
            <span class="tw-check" style={fsize}><input type="checkbox"
                  onChange={twToggle}/>Twitter</span>
          </div>
        )
      }
    }

    var upost = {
      margin: "30px 20% 15px 20%",
      display: "inline-block"
    }

    var alignLeft = {
      align: "left",
      width: "50%",
      display: "inline-block"
    }

    var alignRight = {
      align: "right",
      width: "49%",
      display: "inline-block",
      marginTop: "-30px",
    }

    var aright = {
      float: "right",
    }

    var width100 = {
      width: "100%"
    }

    var fsize = {
      fontSize: "24px"
    }


    return (
      <div style={width100}>
        <div class="user-post">
          <div>
            <form class="user-post-form" style={upost}>
              <textarea style={fsize} maxLength="140" rows="4" cols="80" type="text"
                defaultValue={this.state.message}></textarea>
              <div style={alignLeft}>
                {displayFacebook()}
                {displayTwitter()}
              </div>
              <div style={alignRight}>
                <button class="submit-form btn btn-primary" style={aright} onClick={this.createPost}>Make a post</button>
              </div>
            </form>
          </div>
        </div>
        <div>
          <div className="news-feed-posts">
            {NewsFeedPosts}
          </div>
        </div>
        <span>Load More</span>
      </div>
    );
  }
}
