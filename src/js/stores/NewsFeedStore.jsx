import { EventEmitter } from "events";
import AuthService from "util/AuthService";
import dispatcher from "dispatcher";

var $ = require("jquery");
var url = "https://dev.calligre.com"

class NewsFeedStore extends EventEmitter {

  constructor(auth) {
    super()
    this.contentFeed = {
      items: [],
    }
    this.error = null;
    this.dataFetched = false;
  }

  get() {
    // TODO: Configure next page into API
    // if (this.contentFeed.nextpage) { add nextPage into query}
    $.ajax({
      url: url + "/api/social",
      dataType: "json",
      type: "get",
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      // TODO: Plug in this data
      // data: {
      //   "limit": "2"
      //   "offset": offset
      // },
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
      console.log("Data was already loaded. Retrieving from store instead")
      this.emit("updated");
    }
  }

  incrementLike() {
    console.log("TODO: incrementLike");
  }

  decrementLike() {
    console.log("TODO: decrementLike");
  }

  createPost(text, photo, post_fb, post_tw) {
    let data = {
      text: text,
      media_url: "https://i.ytimg.com/vi/EVCrmXW6-Pk/maxresdefault.jpg",
      post_fb: post_fb,
      post_tw: post_tw,
    }

    $.ajax({
      type: "POST",
      url: "https://dev.calligre.com/api/social",
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
        // TODO: ensure that client sees their post on the front end
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
