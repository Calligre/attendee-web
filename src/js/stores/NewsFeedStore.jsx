import { EventEmitter } from "events";
import AuthService from "util/AuthService";
import dispatcher from "dispatcher";

var $ = require("jquery");
let url = "https://dev.calligre.com"

class NewsFeedStore extends EventEmitter {

  constructor(auth) {
    super()
    this.contentFeed = {
      items: [],
      nextOffset: null,
    }
    this.error = null;
    this.dataFetched = false;
  }

  get() {
    let params = {};
    if (newsFeedStore.contentFeed.nextOffset) {
      params.offset = newsFeedStore.contentFeed.nextOffset;
    }
    // TODO: Should there be a way to specify limit?
    // params.limit = 10;

    $.ajax({
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      type: "GET",
      url: url + "/api/social",
      data: params,
      dataType: "json",
      cache: false,
      success: function(response) {
        newsFeedStore.dataFetched = true;
        dispatcher.dispatch({type: "NEWSFEED_GET", response: response});
      },
      failure: function(error) {
        newsFeedStore.dataFetched = false;
        dispatcher.dispatch({type: "NEWSFEED_ERROR", error: error});
      }
    });
  }

  getOnLoad() {
    if (!this.dataFetched) {
      this.get();
    } else {
      console.log("Data was already loaded. Retrieving from store instead");
      dispatcher.dispatch({ type: "NEWSFEED_FROM_STORE" });
    }
  }

  likePost(postId) {
    let pid = postId;
    $.ajax({
      type: "POST",
      url: url + "/api/social/" + postId + "/likes",
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      contentType:"application/json",
      cache: false,
      statusCode: {
        500: function() {
          alert("Unable to perform this action, please try again later");
        }
      },
      success: function() {
        dispatcher.dispatch({type: "POST_LIKE", postId: pid});
      },
      failure: function(error) {
        dispatcher.dispatch({type: "POST_LIKE_ERROR", error: error});
      }
    });
  }

  unlikePost(postId) {
    let pid = postId;
    $.ajax({
      type: "DELETE",
      url: url + "/api/social/" + postId + "/likes",
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      contentType:"application/json",
      cache: false,
      statusCode: {
        500: function() {
          alert("Unable to perform this action, please try again later");
        }
      },
      success: function(response) {
        dispatcher.dispatch({type: "POST_UNLIKE", postId: pid});
      },
      failure: function(error) {
        dispatcher.dispatch({type: "POST_UNLIKE_ERROR", error: error});
      }
    });
  }

  postToNewsFeed(data) {
    $.ajax({
      type: "POST",
      url: url + "/api/social",
      data: JSON.stringify(data),
      dataType: "json",
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      contentType:"application/json",
      cache: false,
      success: function(response) {
        dispatcher.dispatch({type: "POST_SUCCESS", post: response["id"]});
      },
      failure: function(error) {
        dispatcher.dispatch({type: "POST_FAILURE", error: error});
      }
    });
  }

  createPost(text, photo, post_fb, post_tw) {
    // Set the base data fields for photo or text post
    let data = {
      text: text,
      post_fb: post_fb,
      post_tw: post_tw,
    }
    let self = this;
    // Did the user want to upload a photo?
    if (photo) {
      let photoType = {
        "Content-Type": photo.type,
      };

      // Obtain the media URL to post our photo to
      $.ajax({
        headers: {
          "Authorization": "Bearer " + AuthService.getToken()
        },
        type: "GET",
        data: photoType,
        dataType: "json",
        url: url + "/api/social-image-upload-url",
        contentType:"application/json",
        cache: false,
        success: function(response) {
          let photoUploadURL = response.data

          // Put the photo at the url
          $.ajax({
            url: photoUploadURL,
            type: 'put',
            data: photo,
            contentType: photo.type,
            processData: false,
            cache: false,
            success: function(response){
              data.media_link = photoUploadURL;
              console.log(data);
              self.postToNewsFeed(data);
            },
            failure: function(error){
              dispatcher.dispatch({type: "PHOTO_ERROR", response: response});
            }
          });
        },
        failure: function(error) {
          console.log("FAILURE");
          dispatcher.dispatch({type: "PHOTO_ERROR", error: error});
        }
      });
    }
    else {
      // No need to make photo calls, just post with the text
      self.postToNewsFeed(data);
    }
  }


  handleActions(action) {
    switch(action.type){
      case "NEWSFEED_POST": {
        this.emit("post");
        break;
      }
      case "NEWSFEED_GET": {
        Array.prototype.push.apply(this.contentFeed.items, action.response.data.posts[0]);
        this.contentFeed.nextOffset = action.response.data.nextOffset;
        this.contentFeed.count = action.response.data.count;
        this.emit("updated");
        break;
      }
      case "NEWSFEED_FROM_STORE": {
        // Data is already in the store
        this.emit("updated");
        break;
      }
      case "POST_LIKE": {
        var arrayLength = this.contentFeed.items.length;
        for (var i = 0; i < arrayLength; i++) {
          if (this.contentFeed.items[i].id === action.postId) {
            this.contentFeed.items[i].current_user_likes = true;
            this.contentFeed.items[i].like_count = (parseInt(this.contentFeed.items[i].like_count) + 1).toString();
            this.emit("updated");
          }
        }
        console.log("LIKE SUCCESS");
        break;
      }
      case "POST_LIKE_ERROR": {
        console.log("LIKE FAIL");
        break;
      }
      case "POST_UNLIKE": {
        var arrayLength = this.contentFeed.items.length;
        for (var i = 0; i < arrayLength; i++) {
          if (this.contentFeed.items[i].id === action.postId) {
            this.contentFeed.items[i].current_user_likes = false;
            this.contentFeed.items[i].like_count = (parseInt(this.contentFeed.items[i].like_count) - 1).toString();
            this.emit("updated");
          }
        }
        console.log("POST UNLIKE SUCCESS");
        break;
      }
      case "POST_UNLIKE_ERROR": {
        console.log("POST UNLIKE FAIL");
        break;
      }
      case "ERROR": {
        this.error = action.error;
        this.emit("error");
        break;
      }
    }
  }
}

const newsFeedStore = new NewsFeedStore;
dispatcher.register(newsFeedStore.handleActions.bind(newsFeedStore));

export default newsFeedStore;
