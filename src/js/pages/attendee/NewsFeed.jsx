import React from "react";
import NewsFeedPost from "components/NewsFeedPost";
import NewsFeedStore from "stores/NewsFeedStore";
import Dropzone from 'react-dropzone';
import MdHighlightRemove from 'react-icons/lib/md/highlight-remove';
import MdPhotoCamera from 'react-icons/lib/md/photo-camera';
import TiSocialFacebook from 'react-icons/lib/ti/social-facebook';
import TiSocialTwitter from 'react-icons/lib/ti/social-twitter';
// import style from '../../sass/newsfeed.scss';

// TODO: LIMIT NUMBER OF NEWLINES?

export default class NewsFeed extends React.Component {

  constructor() {
    super();
    this.getNewsFeedPosts = this.getNewsFeedPosts.bind(this);
    this.createPost = this.createPost.bind(this);
    this.twToggle = this.twToggle.bind(this);
    this.fbToggle = this.fbToggle.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.deletePhoto = this.deletePhoto.bind(this);

    this.state = {
      contentFeed: {
        items: [],
        nextOffset: null,
      },
      file: null,
      preview: null,
      fbPost: false,
      twPost: false,
      // TODO: HOW CAN I GET THESE? (If user is integrated into social media channels)
      twIntegration: true,
      fbIntegration: true,
      user:
        {
          id: 0,
          name: "",
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

  uploadPhoto() {
    // TODO: UPLOAD THE PHOTO
    console.log("Let's do a photo thing");
  }

  showError(){
    console.log(NewsFeedStore.error);
  }

  fbToggle() {
    if (this.state.fbIntegration) {
      this.setState({
        fbPost: !this.state.fbPost,
      });
    } else {
      console.log("TODO: Integrate Facebook window");
      // TODO: Open add Facebook window and change state on success
    }
  }

  twToggle() {
    if (this.state.twIntegration) {
      this.setState({
        twPost: !this.state.twPost,
      });
    }
    else {
      console.log("TODO: Integrate Twitter window");
      // TODO: Open add Twitter window and change state on success
    }
  }

  onDrop(files) {
    this.setState({
      file: files[0],
      preview: files[0].preview,
    });
  }

  deletePhoto(e) {
    e.stopPropagation();
    this.setState({
      file: null,
      preview: null,
    });
  }

  render() {
    const { contentFeed, fbPost, message, twPost, user, fbToggle, twToggle, preview } = this.state;
    const placeholder = "Post to news feed..."

    const twitterStatus =  this.state.twIntegration && this.state.twPost ? "twitter" : "disabled-social";
    const facebookStatus =  this.state.fbIntegration && this.state.fbPost ? "facebook" : "disabled-social";
    const textPostLength = twPost ? "140" : "1000";

    const NewsFeedPosts = contentFeed.items.map((post) => {
        return <NewsFeedPost key={post.timestamp} {...post}/>;
    });

    let paginate = (<div className="default-cursor">End of Content</div>);
    if (contentFeed.nextOffset) {
      paginate = (<div className="clickable link" onClick={NewsFeedStore.get}>Load more...</div>);
    }


    function dropzoneDisplay(deletePhoto) {
      if (preview) {
        return(
          <div className="preview-box inline">
            <MdHighlightRemove className="photo-delete" onClick={deletePhoto} size={24}/>
            <div className="img-container">
              <span className="helper inline"></span><img className="border inline" src={preview}/>
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
          <div className="user-post">
            <form className="user-post-form">
              <div className="input">
                <div className="left-input inline">
                  <textarea className="text-input border"
                    maxLength={textPostLength} rows="4" type="text"
                    placeholder={placeholder}></textarea>
                  <div className="social-submit inline">
                    <div title="Post to Facebook" className="inline">
                      <button type="button" className={"btn social " + facebookStatus} onClick={this.fbToggle}>
                        <TiSocialFacebook size={34}/>
                      </button>
                    </div>
                    <div title="Post to Twitter" className="inline">
                      <button type="button" className={"btn social " + twitterStatus} onClick={this.twToggle}>
                        <TiSocialTwitter size={34}/>
                      </button>
                    </div>
                    <button type="button" className="submit-form btn btn-primary" onClick={this.createPost}>
                      Submit Post
                    </button>
                  </div>
                </div>
                <div className="right-input">
                  <Dropzone className='dropzone border' onDrop={this.onDrop} multiple={false}>
                    {dropzoneDisplay(this.deletePhoto)}
                  </Dropzone>
                </div>
              </div>
            </form>
          </div>

          <div>
            <div className="newsfeed-posts">
              {NewsFeedPosts}
            </div>
            <hr/>
            <div className="paginate">
              {paginate}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
