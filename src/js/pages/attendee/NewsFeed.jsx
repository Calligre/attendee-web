import React from 'react';
import NewsFeedPost from 'components/NewsFeedPost';
import CreatePost from 'components/CreatePost';
import NewsFeedStore from 'stores/NewsFeedStore';
import MdClose from 'react-icons/lib/md/close';


export default class NewsFeed extends React.Component {

  constructor() {
    super();
    this.getNewsFeedPosts = this.getNewsFeedPosts.bind(this);
    this.revertNewsFeedPosts = this.revertNewsFeedPosts.bind(this);
    this.setImageOverlay = this.setImageOverlay.bind(this);
    this.paginatePosts = this.paginatePosts.bind(this);
    this.closeImageOverlay = this.closeImageOverlay.bind(this);
    this.showError = this.showError.bind(this);

    this.state = {
      contentFeed: {
        items: [],
        // nextOffset is stored in the NewsFeedStore
      },
      imageOverlay: null,
      // TODO: HOW CAN I GET THESE? (If user is integrated into social media channels)
      twIntegration: true,
      fbIntegration: true,
    };
  }

  componentWillMount() {
    NewsFeedStore.on('updated', this.getNewsFeedPosts);
    NewsFeedStore.on('revert', this.revertNewsFeedPosts);
    NewsFeedStore.on('error', this.showError);
    // Grab data here. Emitted events aren't picked up until here
    NewsFeedStore.getOnLoad();
  }

  componentWillUnmount() {
    NewsFeedStore.removeListener('updated', this.getNewsFeedPosts);
    NewsFeedStore.removeListener('revert', this.revertNewsFeedPosts);
    NewsFeedStore.removeListener('error', this.showError);
  }

  // Grab the News Feed Posts that the user has retrieved from the store
  getNewsFeedPosts() {
    this.setState({
      contentFeed: NewsFeedStore.contentFeed,
    });
  }

  setImageOverlay(value) {
    this.setState({
      imageOverlay: value,
    });
  }

  revertNewsFeedPosts() {
    this.setState({
      contentFeed: NewsFeedStore.contentFeed,
    });
    if (NewsFeedStore.error) {
      this.showError();
    }
  }

  paginatePosts() {
    NewsFeedStore.get();
  }

  closeImageOverlay() {
    this.setImageOverlay(null);
  }

  showError() {
    alert(NewsFeedStore.error);
  }

  render() {
    const {
      contentFeed,
      fbIntegration,
      imageOverlay,
      twIntegration,
    } = this.state;

    const NewsFeedPosts = contentFeed.items.map(post =>
      <NewsFeedPost
        key={post.timestamp}
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
          <div className="fullscreen-frame">
            <MdClose
              className="img-overlay-close clickable"
              size={40}
              onClick={closeImageOverlay}
            />
            <div className="img-container">
              <span className="helper inline" /><img className="inline" src={imageOverlay} />
            </div>
          </div>
        );
      }
      return <div />;
    }

    return (
      <div>
        <h1>News Feed</h1>
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