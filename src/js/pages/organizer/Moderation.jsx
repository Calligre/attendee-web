import React from 'react';

import NewsFeedStore from 'stores/NewsFeedStore';
import PreferenceStore from 'stores/PreferenceStore';

export default class Moderation extends React.Component {
  constructor() {
    super();
    this.state = {
      flaggedPosts: {
        items: [],
      },
      preferences: PreferenceStore.getDefaults(),
    };

    NewsFeedStore.getFlagged();
    PreferenceStore.loadAll();
  }

  componentWillMount() {
    NewsFeedStore.on('updated', this.getFlaggedPosts);
    NewsFeedStore.on('error', this.showError);
    PreferenceStore.on('loaded', this.loadPreferences);
    PreferenceStore.on('error', this.showPreferenceError);
  }

  componentWillUnmount() {
    NewsFeedStore.removeListener('updated', this.getFlaggedPosts);
    NewsFeedStore.removeListener('error', this.showError);
    PreferenceStore.removeListener('loaded', this.loadPreferences);
    PreferenceStore.removeListener('error', this.showPreferenceError);
  }

  getFlaggedPosts = () => {
    this.setState({ flaggedPosts: NewsFeedStore.flaggedPosts });
  }

  showError = () => {
    console.error(NewsFeedStore.error);
  }

  loadPreferences = () => {
    console.log(PreferenceStore.preferences);
    this.setState({ disabled: !PreferenceStore.preferences.newsfeed });
  }

  showPreferenceError = () => {
    console.error(PreferenceStore.error);
  }

  render() {
    const { flaggedPosts, disabled } = this.state;

    if (disabled) {
      return (<div> NewsFeed has been disabled, please check your preferences. </div>);
    }

    return (
      <span>Fart</span>
    );
  }
}
