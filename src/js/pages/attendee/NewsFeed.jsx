import React from "react";
import NewsFeedPost from "components/NewsFeedPost";
import NewsFeedStore from "stores/NewsFeedStore";
// import style from 'sass/newsfeed.scss';
import Dropzone from 'react-dropzone';
// import style from '../../sass/newsfeed.scss';

// TODO Twitter char limit
// TODO Photo upload
// TODO Configure likes - pull in likes by user
//                        make API post to add or remove
//
// TODO
//

export default class NewsFeed extends React.Component {

	constructor() {
    super();
    this.getNewsFeedPosts = this.getNewsFeedPosts.bind(this);
    this.createPost = this.createPost.bind(this);
    this.twToggle = this.twToggle.bind(this);
    this.fbToggle = this.fbToggle.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.state = {
      contentFeed: {
        items: [],
        nextPage: null,
      },
      file: null,
      fbPost: false,
      twPost: false,
      message: " #SoftwareDemoDay",
      user: // TODO: Receive this information somehow
        {
          id: 0,
          name: "",
          twIntegration: true,
          fbIntegration: true,
        },
    };
  }

  componentWillMount() {
    NewsFeedStore.on("post", this.getNewsFeedPosts);
    NewsFeedStore.on("updated", this.getNewsFeedPosts);
    NewsFeedStore.on("error", this.showError);
    // Grab data here. Emitted events aren't picked up until here
    NewsFeedStore.getOnLoad();
  }

  componentWillUnmount() {
    NewsFeedStore.removeListener("post", this.getNewsFeedPosts);
    NewsFeedStore.removeListener("updated", this.getNewsFeedPosts);
    NewsFeedStore.removeListener("error", this.showError);
  }

  // Grab the News Feed Posts that the user has retrieved from the store
  getNewsFeedPosts() {
    this.setState({
      contentFeed: NewsFeedStore.contentFeed,
    });
  }

  //
  createPost() {
    let text = document.getElementsByClassName(
      "user-post-form")[0].getElementsByTagName('textarea')[0].value;
    NewsFeedStore.createPost(text, this.state.file, this.state.fbPost, this.state.twPost);

    console.log(text);
  }

  uploadPhoto() {
    console.log("Let's do a photo thing");
  }

  showError(){
    console.log(NewsFeedStore.error);
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

  onDrop(files) {
    console.log(files);
    console.log("FILE");
    this.setState({
      file: files[0]
    });
    console.log(this.state.file);
  }


  render() {
    const { contentFeed, fbPost, message, twPost, user, fbToggle, twToggle } = this.state;

    const NewsFeedPosts = contentFeed.items.map((post) => {
        return <NewsFeedPost key={post.timestamp} {...post}/>;
    });

    function displayTwitter() {
      if (user.twIntegration) {
        return (
          <div>
            <input
              type="checkbox"
              onClick={this.twToggle}
              checked={this.state.twPost}
            />
            <span className="tw-check fsize">Twitter</span>
          </div>
        )
      }
    }

    function displayPaginate() {
      if (contentFeed.nextPage !== null) {
        return (
          <div onClick={NewsFeedStore.get}>Load More...</div>
        );
      } else {
        return(
          <span>End of Content</span>
        )
      }
    }

    return (
      <div className="newsFeed">
        <div class="user-post">
          <div>
            <form className="user-post-form upost">
              <textarea className="fsize" maxLength="140" rows="4" cols="80" type="text"
                defaultValue={message}></textarea>
              <div className="alignLeft">
                {this.state.user.fbIntegration &&
                  <div>
                    <input
                      type="checkbox"
                      onClick={this.fbToggle}
                      checked={this.state.fbPost}
                    />
                    <span>Facebook</span>
                  </div>
                }
                {this.state.user.twIntegration &&
                  <div>
                    <input
                      type="checkbox"
                      onClick={this.twToggle}
                      checked={this.state.twPost}
                    />
                    <span>Twitter</span>
                  </div>
                }
              </div>
              <div className="alignRight">
                <Dropzone multiple={false} accept="image/*" onDrop={this.onDrop}>
                  <p>Drop a file or click to open</p>
                </Dropzone>
                {this.state.file && <div><img src={this.state.file.preview}/></div>}
                <a href="google.com">jfdsfhsdfsda</a>
                <button className="submit-form btn btn-primary aright" onClick={this.createPost}>Make a post</button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="news-feed-posts">
            {NewsFeedPosts}
          </div>
          <div>
            <hr/>
            {displayPaginate()}
          </div>
        </div>
      </div>
    );
  }
}
