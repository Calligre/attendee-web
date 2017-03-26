import React from 'react';

import PreferenceStore from 'stores/PreferenceStore.jsx';
import Switch from 'react-toolbox/lib/switch';


export default class Preferences extends React.Component {
  constructor(props) {
    super(props);
    this.state = PreferenceStore.getDefaults();

    PreferenceStore.loadAll();
  }

  componentWillMount = () => {
    PreferenceStore.on('loaded', this.resetState);
    PreferenceStore.on('error', this.showError);
  }

  componentWillUnmount = () => {
    PreferenceStore.removeListener('loaded', this.resetState);
    PreferenceStore.removeListener('error', this.showError);
  }

  resetState = () => {
    this.setState(PreferenceStore.preferences);
  }

  showError = () => {
    console.error(PreferenceStore.error);
  }

  handleChange = (key, value) => {
    PreferenceStore.update(key, value);
    this.setState({ [key]: value });
  }

  render() {
    let pages = <TabPages {...this.state} handleChange={this.handleChange} />;
    let socialMedia = <TabSocialMedia {...this.state} handleChange={this.handleChange} />;

    return (
      <div>
        <h1 className="primaryText">Preferences</h1>
        {pages}
        {socialMedia}
      </div>
    );
  }
}

class TabPages extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }

  componentWillReceiveProps(props) {
    this.state = props;
  }

  render() {
    return (
      <div>
        <h2 className="secondaryText largeTopMargin">Customize Pages</h2>
		<Switch
          checked={this.state.newsfeed}
          label="Enable the newsfeed for attendees to post social content"
          onChange={this.props.handleChange.bind(this, 'newsfeed')}
        />
      </div>
    );
  }
}

TabPages.propTypes = {
  handleChange: React.PropTypes.func,
};

class TabSocialMedia extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }

  componentWillReceiveProps(props) {
    this.state = props;
  }

  render() {
    return (
      <div>
        <h2 className="secondaryText largeTopMargin">Social Media Integration</h2>
		<Switch
          checked={this.state.facebook}
          label="Allow attendees to cross-post to Facebook"
          onChange={this.props.handleChange.bind(this, 'facebook')}
        />
		<Switch
          checked={this.state.twitter}
          label="Allow attendees to cross-post to Twitter"
          onChange={this.props.handleChange.bind(this, 'twitter')}
        />
		<Switch
          checked={this.state.reposts}
          label="Allow attendees to repost (i.e. retweet) other attendees' posts"
          onChange={this.props.handleChange.bind(this, 'reposts')}
        />
      </div>
    );
  }
}

TabSocialMedia.propTypes = {
  handleChange: React.PropTypes.func,
};
