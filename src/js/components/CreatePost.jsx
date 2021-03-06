import React from 'react';
import AuthService from 'util/AuthService';
import MdHighlightRemove from 'react-icons/lib/md/highlight-remove';
import MdPhotoCamera from 'react-icons/lib/md/photo-camera';
import TiSocialFacebook from 'react-icons/lib/ti/social-facebook';
import TiSocialTwitter from 'react-icons/lib/ti/social-twitter';
import NewsFeedStore from 'stores/NewsFeedStore';
import PreferenceStore from 'stores/PreferenceStore';
import Dropzone from 'react-dropzone';
import EXIF from 'exif-js';
import { Card as BetterCard, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { Button } from 'react-toolbox/lib/button';

export default class NewsFeed extends React.Component {

  constructor(props) {
    super(props);

    const integrations = AuthService.getProfile().identities;
    let fbIntegration = false;
    let twIntegration = false;
    if (integrations) {
      for (let integration of integrations) {
        if (integration.connection === 'facebook') {
          fbIntegration = true;
        } else if (integration.connection === 'twitter') {
          twIntegration = true;
        }
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

  rotatePhoto = () => {
    const img = new Image();
    img.onload = () => {
	  const width = img.width;
	  const height = img.height;
	  const canvas = document.createElement('canvas');
	  const ctx = canvas.getContext('2d');
	  canvas.width = height;
      canvas.height = width;
	  ctx.transform(0, 1, -1, 0, height, 0);
	  ctx.drawImage(img, 0, 0);
	  canvas.toBlob(blob => {
		this.setState({
		  file: blob,
		  preview: window.URL.createObjectURL(blob)
		});
	  })
    };
    img.src = window.URL.createObjectURL(this.state.file);
  }

  onPhotoDrop = (files) => {
	this.setState({
	  file: files[0],
	  preview: files[0].preview,
	});
  }

  getRetweetText = () => {
    this.setState({
      text: NewsFeedStore.retweetText,
    });
    this.textInput.focus();
    window.scrollTo(0, 0);
  }

  setPostText = () => {
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

  changeText = (event) => {
    this.setState({
      text: event.target.value,
    });
  }

  fbToggle = () => {
    if (this.state.fbIntegration) {
      this.setState({
        fbPost: !this.state.fbPost,
      });
    } else {
      console.error('TODO: Integrate Facebook window');
      // TODO: Open add Facebook window and change state on success
    }
  }

  twToggle = () => {
    if (this.state.twIntegration) {
      this.setState({
        twPost: !this.state.twPost,
      });
    } else {
      console.error('TODO: Integrate Twitter window');
      // TODO: Open add Twitter window and change state on success
    }
  }

  deletePhoto = (e) => {
    e.stopPropagation();
    this.setState({
      file: null,
      preview: null,
    });
  }

  createPost = () => {
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

    const placeholder = "What's on your mind?";
    const twitterStatus = twIntegration && twPost ? 'twitter' : 'disabled-social';
    const facebookStatus = fbIntegration && fbPost ? 'facebook' : 'disabled-social';
    const textPostLength = twPost ? '140' : '1000';

    return (
      <BetterCard className="user-post">
        <CardTitle
          title="Post to News Feed" />
        <CardText>
          <textarea
            ref={(input) => { this.textInput = input; }}
            className="text-input"
            maxLength={textPostLength}
            rows="4"
            type="text"
            placeholder={placeholder}
            onChange={this.changeText}
            value={text}/>
        </CardText>
        { preview &&
          <CardMedia>
            <img src={preview} className="newsfeedMedia" />
          </CardMedia>
        }
        { preview &&
          <div id="photoEditContainer">
            <Button style={this.props.buttonStyle} label="Delete" onClick={this.deletePhoto}/>
            <Button style={this.props.buttonStyle} label="Rotate" onClick={this.rotatePhoto}/>
          </div>
        }
        <CardActions>
          <Dropzone className="dropzone border" onDrop={this.onPhotoDrop} multiple={false}>
            <Button style={this.props.buttonStyle} label="Upload Photo"/>
          </Dropzone>
          <div className="postOptions">
            { preferences.facebook && fbIntegration &&
              <button
                type="button"
                className={`btn soc ${facebookStatus}`}
                onClick={this.fbToggle}>
                <TiSocialFacebook size={34} />
              </button>
            }
            { preferences.twitter && twIntegration &&
              <button
                type="button"
                className={`btn soc ${twitterStatus}`}
                onClick={this.twToggle}>
                <TiSocialTwitter size={34} />
              </button>
            }
            <Button style={this.props.buttonStyle} label="Post" onClick={this.createPost} id="post"/>
          </div>
        </CardActions>
      </BetterCard>
    );
  }
}
