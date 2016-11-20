import React from "react";
import NewsFeedPost from "components/NewsFeedPost";
import NewsFeedStore from "stores/NewsFeedStore";
import Dropzone from 'react-dropzone';
import MdHighlightRemove from 'react-icons/lib/md/highlight-remove';
import MdPhotoCamera from 'react-icons/lib/md/photo-camera';
import TiSocialFacebook from 'react-icons/lib/ti/social-facebook';
import TiSocialTwitter from 'react-icons/lib/ti/social-twitter';
// import style from '../../sass/newsfeed.scss';

// TODO Photo upload
// TODO Configure likes - pull in likes by user
//                        make API post to add or remove
// TODO: LIMIT NUMBER OF NEWLINES?
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
    // this.updateMessage = this.updateMessage.bind(this);


    this.state = {
      contentFeed: {
        items: [
          {
            current_user_likes: true,
            text: "Runscope test",
            poster_name: "Lookup Name Result",
            poster_id: "2",
            like_count: 0,
            timestamp: 1474834562.532806,
            poster_icon: "http://calligre-profilepics.s3-website-us-west-2.amazonaws.com/profilepic-1.jpg",
            id: "1474834562.532805919647216796875"
        },
        {
            current_user_likes: true,
            text: "testingpost",
            poster_name: "Lookup Name Result",
            poster_id: "adsku43oufo4ulf",
            like_count: 0,
            timestamp: 1474611177.963123,
            poster_icon: "http://calligre-profilepics.s3-website-us-west-2.amazonaws.com/profilepic-1.jpg",
            id: "1474611177.9631230831146240234375"
        },
        {
            current_user_likes: true,
            text: "No text provided",
            poster_name: "Lookup Name Result",
            poster_id: "1",
            like_count: 1,
            timestamp: 1474610782.024339,
            poster_icon: "http://calligre-profilepics.s3-website-us-west-2.amazonaws.com/profilepic-1.jpg",
            id: "1474610782.0243389606475830078125"
          }
        ],
        nextOffset: null,
        count: 0,
      },
      file: null,
      preview: null,
      fbPost: false,
      twPost: false,
      message: "Post to the newsfeed...",
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

  getTextArea() {
    return document.getElementsByClassName("user-post-form")[0].getElementsByTagName('textarea')[0].value;
  }

  setTextArea(text) {
    document.getElementsByClassName("user-post-form")[0].getElementsByTagName('textarea')[0].value = text;
  }

  createPost() {
    console.log(this.getTextArea());
    NewsFeedStore.createPost(this.getTextArea(), this.state.file, this.state.fbPost, this.state.twPost);
    this.setTextArea('');
  }

  // updateMessage() {
  //   this.setState({
  //     message: this.getTextArea()
  //   });
  // }

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
    this.setState({
      file: files[0],
      preview: files[0].preview,
    });
  }

  // onDrop(files) {
  //   this.setState({
  //     preview: files[0].preview,
  //     newPhoto: files[0],
  //     uploadInProgress: true
  //   })
  // }

  cancelDrop(e) {
    e.stopPropagation();
    this.setState({
      preview: this.state.profile.photo,
      newPhoto: null,
      uploadInProgress: false
    });
  }


  render() {
    const { contentFeed, fbPost, message, twPost, user, fbToggle, twToggle, preview } = this.state;
    const placeholder = "Post to news feed..."
    const socialStatus = true;// && this.state.fbIntegration ? "visible" : "hidden";

    const NewsFeedPosts = contentFeed.items.map((post) => {
        return <NewsFeedPost key={post.timestamp} {...post}/>;
    });
    const displayCancel = false && this.state.uploadInProgress ? "visible" : "hidden";


    function paginate() {
      if (contentFeed.nextOffset) {
        return (<div onClick={NewsFeedStore.get}>Load More...</div>);
      }
      return(<span>End of Content</span>);
    }

    function getTextPostLength() {
      if (twPost) {
        return "140";
      }
      return "1000";
    }

                // {this.state.user.fbIntegration &&
                //   <div>
                //     <input
                //       type="checkbox"
                //       onClick={this.fbToggle}
                //       checked={this.state.fbPost}
                //     />
                //     <span>Facebook</span>
                //   </div>
                // }
                // {this.state.user.twIntegration &&
                //   <div>
                //     <input
                //       type="checkbox"
                //       onClick={this.twToggle}
                //       checked={this.state.twPost}
                //     />
                //     <span>Twitter</span>
                //   </div>
                // }

    function dropzoneDisplay() {
      if (preview) {
        return(
          <div className="preview-box">
            <div className="img-container">
              <span className="helper"></span><img src={preview}/>
            </div>
          </div>
        );
      } else {
        return(
          <div className="label">
            <MdPhotoCamera className="photo-icon" size={30}/>
            <div>Click or drag to upload</div>
          </div>
        );
      }
    }

    return (
      <div>
        <h1>News Feed</h1>
        <div className="newsFeed">
          <div class="user-post">
            <form className="user-post-form">
              <div className="input">
                <div className="left-input">
                  <textarea className="text-input border"
                    maxLength={getTextPostLength()} rows="4" type="text"
                    placeholder={placeholder}></textarea>
                  <div className="social-submit">
                    <button className={"btn social facebook " + socialStatus} onClick={this.fbToggle}>
                      <TiSocialFacebook size={34}/>
                    </button>
                    <button className={"btn social twitter " + socialStatus} onClick={this.twToggle}>
                      <TiSocialTwitter size={34}/>
                    </button>
                    <button className="submit-form btn btn-primary" onClick={this.createPost}>Submit Post</button>
                  </div>
                </div>
                <div className="right-input">
                  <Dropzone className='dropzone border' onDrop={this.onDrop} multiple={false}>
                    {dropzoneDisplay()}
                  </Dropzone>
                </div>
              </div>

              <div className="left-input">
              </div>
              <div className="right-input">
              </div>
            </form>
          </div>

          <div>
            <div className="news-feed-posts">
              {NewsFeedPosts}
            </div>
            <div class="paginate">
              <hr/>
              {paginate()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
