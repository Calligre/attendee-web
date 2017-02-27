import React from 'react';
import NewsFeedStore from 'stores/NewsFeedStore';
import Dropzone from 'react-dropzone';
import MdHighlightRemove from 'react-icons/lib/md/highlight-remove';
import MdPhotoCamera from 'react-icons/lib/md/photo-camera';
import TiSocialFacebook from 'react-icons/lib/ti/social-facebook';
import TiSocialTwitter from 'react-icons/lib/ti/social-twitter';

export default class NewsFeed extends React.Component {

  constructor(props) {
    super(props);
    this.onPhotoDrop = this.onPhotoDrop.bind(this);
    this.getRetweetText = this.getRetweetText.bind(this);
    this.setPostText = this.setPostText.bind(this);
    this.changeText = this.changeText.bind(this);
    this.twToggle = this.twToggle.bind(this);
    this.fbToggle = this.fbToggle.bind(this);
    this.deletePhoto = this.deletePhoto.bind(this);
    this.createPost = this.createPost.bind(this);

    this.state = {
      text: '',
      file: null,
      preview: null,
      fbPost: false,
      twPost: false,
      // TODO: HOW CAN I GET THESE? (If user is integrated into social media channels)
      twIntegration: true,
      fbIntegration: true,
    };
  }

  componentWillMount() {
    NewsFeedStore.on('retweet', this.getRetweetText);
    NewsFeedStore.on('post', this.setPostText);
  }

  componentWillUnmount() {
    NewsFeedStore.removeListener('retweet', this.getRetweetText);
    NewsFeedStore.removeListener('post', this.setPostText);
  }

  onPhotoDrop(files) {
    this.setState({
      file: files[0],
      preview: files[0].preview,
    });
  }

  getRetweetText() {
    this.setState({
      text: NewsFeedStore.retweetText,
    });
    this.textInput.focus();
    window.scrollTo(0, 0);
  }

  setPostText() {
    this.setState({
      text: '',
      file: null,
      preview: null,
      fbPost: false,
      twPost: false,
    });
  }

  changeText(event) {
    this.setState({
      text: event.target.value,
    });
  }

  fbToggle() {
    if (this.state.fbIntegration) {
      this.setState({
        fbPost: !this.state.fbPost,
      });
    } else {
      console.log('TODO: Integrate Facebook window');
      // TODO: Open add Facebook window and change state on success
    }
  }

  twToggle() {
    if (this.state.twIntegration) {
      this.setState({
        twPost: !this.state.twPost,
      });
    } else {
      console.log('TODO: Integrate Twitter window');
      // TODO: Open add Twitter window and change state on success
    }
  }

  deletePhoto(e) {
    e.stopPropagation();
    this.setState({
      file: null,
      preview: null,
    });
  }

  createPost() {
    NewsFeedStore.createPost(
      this.state.text,
      this.state.file,
      this.state.fbPost,
      this.state.twPost
    );
  }

  render() {
    const {
      fbIntegration,
      fbPost,
      preview,
      text,
      twIntegration,
      twPost,
    } = this.state;

    const placeholder = 'Post to news feed...';
    const twitterStatus = twIntegration && twPost ? 'twitter' : 'disabled-social';
    const facebookStatus = fbIntegration && fbPost ? 'facebook' : 'disabled-social';
    const textPostLength = twPost ? '140' : '1000';

    function dropzoneDisplay(deletePhoto) {
      if (preview) {
        return (
          <div className="preview-box inline">
            <MdHighlightRemove className="photo-delete" onClick={deletePhoto} size={24} />
            <div className="img-container">
              <span className="helper inline" /><img className="border inline" src={preview} />
            </div>
          </div>
        );
      }

      return (
        <div className="label">
          <MdPhotoCamera className="photo-icon" size={30} />
          <div className="no-selection">Click or drag to upload</div>
        </div>
      );
    }

    return (
      <div>
        <div className="user-post">
          <form className="user-post-form">
            <div className="input">
              <div className="left-input inline">
                <textarea
                  ref={(input) => { this.textInput = input; }}
                  className="text-input border"
                  maxLength={textPostLength}
                  rows="4"
                  type="text"
                  placeholder={placeholder}
                  onChange={this.changeText}
                  value={text}
                />
                <div className="social-submit inline">
                  <div title="Post to Facebook" className="inline">
                    <button
                      type="button"
                      className={`btn social ${facebookStatus}`}
                      onClick={this.fbToggle}
                    >
                      <TiSocialFacebook size={34} />
                    </button>
                  </div>
                  <div title="Post to Twitter" className="inline">
                    <button
                      type="button"
                      className={`btn social ${twitterStatus}`}
                      onClick={this.twToggle}
                    >
                      <TiSocialTwitter size={34} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="submit-form btn btn-primary"
                    onClick={this.createPost}
                  >
                    Submit Post
                  </button>
                </div>
              </div>
              <div className="right-input">
                <Dropzone className="dropzone border" onDrop={this.onPhotoDrop} multiple={false}>
                  {dropzoneDisplay(this.deletePhoto)}
                </Dropzone>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
