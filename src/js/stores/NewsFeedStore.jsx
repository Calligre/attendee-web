import { EventEmitter } from 'events';
import AuthService from 'util/AuthService';
import UrlService from 'util/UrlService';
import dispatcher from 'dispatcher';
import $ from 'jquery';

const url = UrlService.getUrl();

class NewsFeedStore extends EventEmitter {

  constructor() {
    super();
    this.contentFeed = {
      items: [],
      nextOffset: null,
    };
    this.error = null;
    this.dataFetched = false;
    this.retweetText = '';
  }

  get() {
    const params = {};
    if (this.contentFeed.nextOffset) {
      params.offset = this.contentFeed.nextOffset;
    }
    // TODO: Should there be a way to specify limit?
    // params.limit = 10;

    $.ajax({
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      type: 'GET',
      url: `${url}/social`,
      data: params,
      dataType: 'json',
      cache: false,
      success(response) {
        dispatcher.dispatch({ type: 'NEWSFEED_GET', response });
      },
      error(error) {
        dispatcher.dispatch({ type: 'NEWSFEED_GET_ERROR', error });
      },
    });
  }

  getOnLoad() {
    if (!this.dataFetched) {
      this.get();
    } else {
      dispatcher.dispatch({ type: 'NEWSFEED_FROM_STORE' });
    }
  }

  likePost(pid) {
    const postId = pid;

    $.ajax({
      type: 'POST',
      url: `${url}/social/${postId}/likes`,
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      contentType: 'application/json',
      cache: false,
      statusCode: {
        500() {
          alert('Unable to perform this action, please try again later');
        },
      },
      success() {
        dispatcher.dispatch({ type: 'POST_LIKE', postId });
      },
      error(error) {
        dispatcher.dispatch({ type: 'POST_LIKE_ERROR', error });
      },
    });
  }

  unlikePost(pid) {
    const postId = pid;

    $.ajax({
      type: 'DELETE',
      url: `${url}/social/${postId}/likes`,
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      contentType: 'application/json',
      cache: false,
      success() {
        dispatcher.dispatch({ type: 'POST_UNLIKE', postId });
      },
      error(error) {
        dispatcher.dispatch({ type: 'POST_UNLIKE_ERROR', error });
      },
    });
  }

  postToNewsFeed(data) {
    $.ajax({
      type: 'POST',
      url: `${url}/social`,
      data: JSON.stringify(data),
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      contentType: 'application/json',
      cache: false,
      success(response) {
        dispatcher.dispatch({ type: 'CREATE_POST_SUCCESS', post: response.id });
      },
      error(error) {
        dispatcher.dispatch({ type: 'CREATE_POST_ERROR', error });
      },
    });
  }

  createPost(text, photo, post_fb, post_tw) {
    // Set the base data fields for photo or text post
    const self = this;
    const data = {
      text,
      post_fb,
      post_tw,
    };
    // Did the user want to upload a photo?
    if (photo) {
      const photoType = {
        'Content-Type': photo.type,
      };

      // Obtain the media URL to post our photo to
      $.ajax({
        headers: {
          Authorization: `Bearer ${AuthService.getToken()}`,
        },
        type: 'GET',
        data: photoType,
        dataType: 'json',
        url: `${url}/social-image-upload-url`,
        contentType: 'application/json',
        cache: false,
        success(response) {
          const photoUploadURL = response.data;

          // Put the photo at the url
          $.ajax({
            url: photoUploadURL,
            type: 'put',
            data: photo,
            contentType: photo.type,
            processData: false,
            cache: false,
            success() {
              data.media_link = photoUploadURL;
              self.postToNewsFeed(data);
            },
            error(error) {
              dispatcher.dispatch({ type: 'PHOTO_ERROR', error });
            },
          });
        },
        error(error) {
          dispatcher.dispatch({ type: 'PHOTO_ERROR', error });
        },
      });
    } else {
      // No need to make photo calls, just post with the text
      self.postToNewsFeed(data);
    }
  }

  setRetweet(text) {
    this.retweetText = text;
    dispatcher.dispatch({ type: 'RETWEET' });
  }

  handleActions(action) {
    switch (action.type) {
      case 'NEWSFEED_GET': {
        this.dataFetched = true;
        Array.prototype.push.apply(this.contentFeed.items, action.response.data.posts[0]);
        this.contentFeed.nextOffset = action.response.data.nextOffset;
        this.contentFeed.count = action.response.data.count;
        this.emit('updated');
        break;
      }
      case 'NEWSFEED_FROM_STORE': {
        // Data is already in the store
        this.emit('updated');
        break;
      }
      case 'CREATE_POST_SUCCESS': {
        this.emit('post');
        break;
      }
      case 'POST_LIKE': {
        const arrayLength = this.contentFeed.items.length;
        for (let i = 0; i < arrayLength; i += 1) {
          if (this.contentFeed.items[i].id === action.postId) {
            this.contentFeed.items[i].current_user_likes = true;
            this.contentFeed.items[i].like_count =
              (parseInt(this.contentFeed.items[i].like_count, 10) + 1).toString();
            // Assume that store and UI are in sync if action was correct
            // this.emit('updated');
          }
        }
        break;
      }
      case 'POST_UNLIKE': {
        const arrayLength = this.contentFeed.items.length;
        for (let i = 0; i < arrayLength; i += 1) {
          if (this.contentFeed.items[i].id === action.postId) {
            this.contentFeed.items[i].current_user_likes = false;
            this.contentFeed.items[i].like_count =
              (parseInt(this.contentFeed.items[i].like_count, 10) - 1).toString();
            // Assume that store and UI are in sync if action was correct
            // this.emit('updated');
          }
        }
        break;
      }
      case 'RETWEET': {
        this.emit('retweet');
        break;
      }
      case 'NEWSFEED_GET_ERROR': {
        this.dataFetched = false;
        break;
      }
      case 'POST_LIKE_ERROR': {
        this.emit('revert');
        this.error = 'Error liking post';
        this.emit('error');
        break;
      }
      case 'POST_UNLIKE_ERROR': {
        this.emit('revert');
        this.error = 'Error unliking post';
        this.emit('error');
        break;
      }
      case 'CREATE_POST_ERROR': {
        this.error = `Error creating post: ${action.error.statusText}`;
        this.emit('error');
        break;
      }
      case 'PHOTO_ERROR': {
        this.error = `Error uploading photo: ${action.error.statusText}`;
        this.emit('error');
        break;
      }
      case 'ERROR': {
        this.error = `Error: ${action.error.statusText}`;
        this.emit('error');
        break;
      }
      default: {
        // empty
      }
    }
  }
}

const newsFeedStore = new NewsFeedStore();
dispatcher.register(newsFeedStore.handleActions.bind(newsFeedStore));

export default newsFeedStore;
