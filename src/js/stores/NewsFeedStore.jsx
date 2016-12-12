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
        console.log(response);
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
      console.log("Data was already loaded. Retrieving from store instead")
      this.emit("updated");
    }
  }

  likePost(postId) {
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
      success: function(response) {
        console.log("LIKE SUCCESS")
        dispatcher.dispatch({type: "POST_LIKE", response: response});
      },
      failure: function(error) {
        console.log("LIKE FAILURE")
        dispatcher.dispatch({type: "LIKE_ERROR", error: error});
      }
    });
  }

  unlikePost(postId) {
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
        dispatcher.dispatch({type: "POST_UNLIKE", response: response});
      },
      failure: function(error) {
        dispatcher.dispatch({type: "LIKE_ERROR", error: error});
      }
    });
  }

  postPhoto(data) {
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
        console.log("THIS ACTUALLY FINISHED");
        dispatcher.dispatch({type: "PHOTO_POST", post: response["id"]});
      },
      failure: function(error) {
        dispatcher.dispatch({type: "PHOTO_ERROR", error: error});
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
              // Finish the upload using our photo url
              postPhoto(data);
            },
            failure: function(error){
              dispatcher.dispatch({type: "PHOTO_ERROR", response: response});
              console.log("FUCK");
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
      postPhoto(data);
    }
  }


  handleActions(action) {
    switch(action.type) {
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
