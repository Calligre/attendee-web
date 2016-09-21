import { EventEmitter } from "events";
import AuthService from "util/AuthService";
import dispatcher from "dispatcher";

var $ = require("jquery");

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
    //
    $.ajax({
      url: "https://dev.calligre.com/api/content",
      dataType: "json",
      headers: {
        "Authorization": "Bearer " + AuthService.getToken()
      },
      cache: false,
      success: function(response){
        console.log(this)
        newsFeedStore.dataFetched = true;
        dispatcher.dispatch({type: "NEWSFEED_GET", response: response});
      },
      failure: function(error){
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

<<<<<<< b758faf3af3b95edf9ca05a7f814f2f6e7e9c7b9
  createPost(text, photo, fbIntegration, twIntegration) {
=======

  createPost(text, photo, fbIntegration, twIntegration) {
    console.log(photo)
>>>>>>> Photos, sass file
    // TODO: Userid isn't static
    let data = {
      posterid: 2,
      text: text,
      media_link: "",
      like_count: 0,
      timestamp: Date.now(),
    }

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
        // TODO: ensure that client sees their post on the front end
        this.emit("post");
        break;
      }
      case "NEWSFEED_GET": {
        this.contentFeed.posts.push.apply(this.contentFeed.items, action.response.items);
        this.contentFeed.nextOffset = action.response.nextOffset;
=======
        this.contentFeed.items.push.apply(this.contentFeed.items, action.response.items);
        this.contentFeed.nextPage = action.response.nextPage;
>>>>>>> Pagination, store reloads when navigating in app
        this.contentFeed.count = action.response.count;
        this.emit("updated");
        console.log(this);
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
