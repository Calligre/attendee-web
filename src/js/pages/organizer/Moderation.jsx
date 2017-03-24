import React from 'react';

import { Button } from 'react-bootstrap';
import ModeratePost from 'components/ModeratePost';
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

    NewsFeedStore.getFlaggedOnLoad();
    PreferenceStore.loadAll();

    this.showError = this.showError.bind(this);
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

  paginatePosts() {
    NewsFeedStore.getFlagged();
  }

  showPreferenceError = () => {
    console.error(PreferenceStore.error);
  }

  render() {
    const { flaggedPosts, disabled } = this.state;
    console.log(flaggedPosts);

    if (disabled) {
      return (<div> NewsFeed has been disabled, please check your preferences. </div>);
    }

    const ModeratePosts = flaggedPosts.items.map(post =>
      <ModeratePost
        key={post.timestamp}
        {...post}
      />
    );

    let paginate = (<div className="default-cursor">End of Content</div>);
    if (flaggedPosts.nextOffset) {
      paginate = (<div className="clickable link" onClick={this.paginatePosts}>Load more...</div>);
    }

    return (
      <div className="newsFeed">
        <h1 className="primaryText">Newsfeed Moderation</h1>
        <div className="newsfeed-posts">
          {ModeratePosts}
          <hr />
          <div className="paginate">
            {paginate}
          </div>
        </div>

      </div>
    );
  }
}
