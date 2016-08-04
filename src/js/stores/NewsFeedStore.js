import { EventEmitter } from "events";

import dispatcher from "../dispatcher";

var $ = require("jquery");

class NewsFeedStore extends EventEmitter {

  constructor() {
    super()

    this.posts = [];
    this.error = null;
  }


  getAll() {
    $.ajax({
      // url: "https://sehackday.calligre.com/api/content",
      // url: "https://yi7degrws0.execute-api.us-west-2.amazonaws.com/api/content",
      url: "https://dev.calligre.com/api/content",
      dataType: "json",
      cache: false,
      success: function(response){
        dispatcher.dispatch({type: "NEWSFEED_GET", posts: response["items"]});
      },
      failure: function(error){
        dispatcher.dispatch({type: "NEWSFEED_ERROR", error: error});
      }
    });

    return this.posts;
  }

  // TODO grab in segments instead of all at once

  incrementLike() {
    console.log("TODO: incrementLike");
  }

  decrementLike() {
    console.log("TODO: decrementLike");
  }


  createPost(text, fbIntegration, twIntegration) {
    const id = Date.now();

    // POST TO FB / TWITTER
    let data = {
      posterid: 1,
      text: text,
      media_link: "",
    }

    this.posts.unshift(data);

    $.ajax({
      type: "POST",
      url: "https://dev.calligre.com/api/content",
      data: JSON.stringify(data),
      dataType: "json",
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
        this.emit("updated");
        break;
      }
      case "NEWSFEED_GET": {
        this.posts = action.posts;
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
