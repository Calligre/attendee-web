import React from 'react';
import NewsFeedPost from 'components/NewsFeedPost';
import CreatePost from 'components/CreatePost';
import NewsFeedStore from 'stores/NewsFeedStore';
import MdClose from 'react-icons/lib/md/close';
import PreferenceStore from 'stores/PreferenceStore';


export default class NewsFeed extends React.Component {

  constructor() {
    super();

    this.state = {
      contentFeed: {
        items: [],
        // nextOffset is stored in the NewsFeedStore
      },
      imageOverlay: null,
      preferences: PreferenceStore.getDefaults(),
    };
    PreferenceStore.loadAll();
  }

  componentWillMount() {
    NewsFeedStore.on('updated', this.getNewsFeedPosts);
    NewsFeedStore.on('revert', this.revertNewsFeedPosts);
    NewsFeedStore.on('error', this.showError);
    // Grab data here. Emitted events aren't picked up until here
    PreferenceStore.on('loaded', this.loadPreferences);
    PreferenceStore.on('error', this.showPreferenceError);

    NewsFeedStore.getOnLoad();
  }

  componentWillUnmount() {
    NewsFeedStore.removeListener('updated', this.getNewsFeedPosts);
    NewsFeedStore.removeListener('revert', this.revertNewsFeedPosts);
    NewsFeedStore.removeListener('error', this.showError);

    PreferenceStore.removeListener('loaded', this.loadPreferences);
    PreferenceStore.removeListener('error', this.showPreferenceError);
  }

  // Grab the News Feed Posts that the user has retrieved from the store
  getNewsFeedPosts = () => {
    this.setState({
      contentFeed: NewsFeedStore.contentFeed,
    });
  }

  setImageOverlay = (value) => {
    this.setState({
      imageOverlay: value,
    });
  }

  revertNewsFeedPosts = () => {
    this.setState({
      contentFeed: NewsFeedStore.contentFeed,
    });
    if (NewsFeedStore.error) {
      this.showError();
    }
  }

  paginatePosts = () => {
    NewsFeedStore.get();
  }

  closeImageOverlay = () => {
    this.setImageOverlay(null);
  }

  showError = () => {
    alert(NewsFeedStore.error);
  }

  loadPreferences = () => {
    this.setState({ preferences: PreferenceStore.preferences });
  }

  showPreferenceError = () => {
    alert(PreferenceStore.error);
  }

  render() {
    const {
      contentFeed,
      imageOverlay,
      preferences,
    } = this.state;

    const NewsFeedPosts = contentFeed.items.map(post =>
      <NewsFeedPost
        key={post.timestamp}
        repost={preferences.reposts}
        {...post}
        rt={this.setText}
        imgOverlay={this.setImageOverlay}
      />
    );

    let paginate = (<div className="default-cursor">End of Content</div>);
    if (contentFeed.nextOffset) {
      paginate = (<div className="clickable link" onClick={this.paginatePosts}>Load more...</div>);
    }

    function imageOverlayDisplay(closeImageOverlay) {
      if (imageOverlay) {
        return (
          <div className="fullscreen-frame" onClick={closeImageOverlay}>
            <MdClose
              className="img-overlay-close clickable"
              size={40}
            />
            <div className="img-container">
              <span className="helper inline" /><img alt="full" className="inline" src={imageOverlay} />
            </div>
          </div>
        );
      }
      return <div />;
    }

    return (
      <div>
        <h1 className="primaryText">News Feed</h1>
        <div className="newsFeed">
          {imageOverlayDisplay(this.closeImageOverlay)}
          <CreatePost />
          <div>
            <div className="newsfeed-posts">
              {NewsFeedPosts}
            </div>
            <hr />
            <div className="paginate">
              {paginate}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
