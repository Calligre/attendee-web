import { EventEmitter } from "events";
import AuthService from "util/AuthService";
import dispatcher from "dispatcher";

var $ = require("jquery");

class NewsFeedStore extends EventEmitter {

  constructor(auth) {
    super()
    this.response = {
      posts: [],
    }
    this.error = null;
  }


  getAll() {
    $.ajax({
      // url: "https://sehackday.calligre.com/api/content",
      // url: "https://yi7degrws0.execute-api.us-west-2.amazonaws.com/api/content",
      url: "https://dev.calligre.com/api/content",
      dataType: "json",
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      cache: false,
      success: function(response){
        dispatcher.dispatch({type: "NEWSFEED_GET", response: response});
      },
      failure: function(error){
        dispatcher.dispatch({type: "NEWSFEED_ERROR", error: error});
      }
    });
    return this.response;
  }

  // TODO grab in segments instead of all at once

  incrementLike() {
    console.log("TODO: incrementLike");
  }

  decrementLike() {
    console.log("TODO: decrementLike");
  }


  createPost(text, fbIntegration, twIntegration) {

    // POST TO FB / TWITTER
    // TODO clean up offline update
    let data = {
      posterid: 2,
      text: text,
      media_link: "",
      like_count: 0,
      timestamp: Date.now(),

    }

    // TODO: Client side update over server call
    this.posts.unshift(data);

    $.ajax({
      type: "POST",
      url: "https://dev.calligre.com/api/content",
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
      failure: function(error){
        dispatcher.dispatch({type: "NEWSFEED_ERROR", error: error});
      }

    });

  }


  handleActions(action) {
    switch(action.type) {
      case "NEWSFEED_POST": {
        // TODO: Read this back in
        this.emit("updated");
        break;
      }
      case "NEWSFEED_GET": {
        console.log("GET");
        console.log(action.response.items);
        this.contentFeed = action.response;
        // TODO: Append posts, don't simply delete old data
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
