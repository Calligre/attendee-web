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

  createPost(text, photo, post_fb, post_tw) {
    if (photo) {
      $.ajax({
        headers: {
          "Authorization": "Bearer " + AuthService.getToken()
        },
        type: "GET",
        url: url + "/api/social-image-upload-url",
        contentType:"application/json",
        cache: false,
        success: function(response) {
          console.log(response);
          const self = this;

          const fileReader = new FileReader();
          fileReader.readAsDataURL(photo);
          fileReader.onloadend = function (e) {
            let data = response.fields;
            data.data = this.result;

            $.ajax({
              url: response.url,
              contentType : false,
              type: 'put',
              data: data,
              processData: false,
              cache: false,
              success: function(response){
                console.log("HOLY SHIT IT WORKED")
              },
              error: function(error){
                console.log(error);
                console.log("FUCK");
              }
            });
          }
          // newsFeedStore.dataFetched = true;
          // dispatcher.dispatch({type: "NEWSFEED_GET", response: response});
        },
        failure: function(error) {
          console.log("FAILURE");
          // newsFeedStore.dataFetched = false;
          // dispatcher.dispatch({type: "NEWSFEED_ERROR", error: error});
        }
      });
    }

    let data = {
      text: text,
      media_link: "https://i.ytimg.com/vi/EVCrmXW6-Pk/maxresdefault.jpg",
      post_fb: post_fb,
      post_tw: post_tw,
    }

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
        dispatcher.dispatch({type: "NEWSFEED_POST", post: response["id"]});
      },
      failure: function(error) {
        dispatcher.dispatch({type: "NEWSFEED_ERROR", error: error});
      }
    });
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
      // case "POST_LIKE": {
      //   this.emit("post_like");
      //   break;
      // }
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
