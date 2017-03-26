import React from 'react';
import AuthService from 'util/AuthService';
import Dropzone from 'react-dropzone';
import MdHighlightRemove from 'react-icons/lib/md/highlight-remove';
import MdPhotoCamera from 'react-icons/lib/md/photo-camera';
import TiSocialFacebook from 'react-icons/lib/ti/social-facebook';
import TiSocialTwitter from 'react-icons/lib/ti/social-twitter';
import NewsFeedStore from 'stores/NewsFeedStore';
import PreferenceStore from 'stores/PreferenceStore';

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

    const integrations = AuthService.getProfile().identities;
    let fbIntegration = false;
    let twIntegration = false;

    for (let integration of integrations) {
      if (integration.connection === 'facebook') {
        fbIntegration = true;
      } else if (integration.connection === 'twitter') {
        twIntegration = true;
      }
    }

    this.state = {
      text: '',
      file: null,
      preview: null,
      fbPost: false,
      twPost: false,
      fbIntegration: fbIntegration,
      twIntegration: twIntegration,
      preferences: PreferenceStore.getDefaults(),

    };
    PreferenceStore.loadAll();
  }

  componentWillMount() {
    NewsFeedStore.on('retweet', this.getRetweetText);
    NewsFeedStore.on('post', this.setPostText);

    PreferenceStore.on('loaded', this.loadPreferences);
    PreferenceStore.on('error', this.showPreferenceError);
  }

  componentWillUnmount() {
    NewsFeedStore.removeListener('retweet', this.getRetweetText);
    NewsFeedStore.removeListener('post', this.setPostText);

    PreferenceStore.removeListener('loaded', this.loadPreferences);
    PreferenceStore.removeListener('error', this.showPreferenceError);
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

  loadPreferences = () => {
    this.setState({ preferences: PreferenceStore.preferences });
  }

  showPreferenceError = () => {
    console.error(PreferenceStore.error);
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
      console.error('TODO: Integrate Facebook window');
      // TODO: Open add Facebook window and change state on success
    }
  }

  twToggle() {
    if (this.state.twIntegration) {
      this.setState({
        twPost: !this.state.twPost,
      });
    } else {
      console.error('TODO: Integrate Twitter window');
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
      preferences,
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
              <span className="helper inline" /><img className="border inline" alt="post" src={preview} />
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
                <div className="soc-submit inline">
                  { preferences.facebook && fbIntegration &&
                    <div className="inline">
                      <button
                        type="button"
                        className={`btn soc ${facebookStatus}`}
                        onClick={this.fbToggle}
                      >
                        <TiSocialFacebook size={34} />
                      </button>
                    </div>
                  }
                  { preferences.twitter && twIntegration &&
                    <div className="inline">
                      <button
                        type="button"
                        className={`btn soc ${twitterStatus}`}
                        onClick={this.twToggle}
                      >
                        <TiSocialTwitter size={34} />
                      </button>
                    </div>
                  }
                  <button
                    type="button"
                    className="submit-form btn btn-primary secondaryBackground"
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
