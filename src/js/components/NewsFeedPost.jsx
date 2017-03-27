import React from 'react';
import AuthService from 'util/AuthService';
import NewsFeedStore from 'stores/NewsFeedStore';
import FaFlag from 'react-icons/lib/fa/flag';
import FaHeart from 'react-icons/lib/fa/heart';
import FaRetweet from 'react-icons/lib/fa/retweet';
import FaTrashO from 'react-icons/lib/fa/trash-o';
import { Card as BetterCard, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
let moment = require('moment')


export default class NewsFeedPost extends React.Component {

  constructor(props) {
    super(props);
    this.state = Object.assign({}, props);
    this.state.userId = AuthService.getProfile().user_id;
    this.changeFlag = this.changeFlag.bind(this);
    this.changeLike = this.changeLike.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.retweet = this.retweet.bind(this);
    this.showImage = this.showImage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.current_user_likes !== nextProps.current_user_likes) {
      this.setState({
        current_user_likes: nextProps.current_user_likes,
        like_count: nextProps.like_count,
      });
    }
    if (this.state.current_user_flagged !== nextProps.current_user_flagged) {
      this.setState({
        current_user_flagged: nextProps.current_user_likes,
      });
    }
  }

  changeFlag() {
    if (this.state.current_user_flagged) {
      NewsFeedStore.unflagPost(this.state.id);
      this.setState({
        current_user_flagged: false,
      });
    } else {
      NewsFeedStore.flagPost(this.state.id);
      this.setState({
        current_user_flagged: true,
      });
    }
  }

  changeLike() {
    if (this.state.current_user_likes) {
      NewsFeedStore.unlikePost(this.state.id);
      this.setState({
        current_user_likes: false,
        like_count: (parseInt(this.state.like_count, 10) - 1).toString(),
      });
    } else {
      NewsFeedStore.likePost(this.state.id);
      this.setState({
        current_user_likes: true,
        like_count: (parseInt(this.state.like_count, 10) + 1).toString(),
      });
    }
  }

  deletePost() {
    NewsFeedStore.deletePost(this.state.id);
  }

  retweet() {
    const retweetText = `"${this.state.text}" (${this.state.poster_name})`;
    NewsFeedStore.setRetweet(retweetText);
  }

  showImage() {
    this.state.imgOverlay(this.state.media_link);
  }

  render() {
    const {
      current_user_flagged,
      current_user_likes,
      like_count,
      media_link,
      poster_icon,
      poster_id,
      poster_name,
      repost,
      text,
      timestamp,
      userId,
    } = this.state;

    const owner = poster_id === userId;

    const heartColor = {
      color: current_user_likes ? 'red' : '',
    };

    const flagColor = {
      color: current_user_flagged ? 'darkorange' : '',
    };

    return (
	  <BetterCard>
		<CardTitle
		  avatar={poster_icon}
		  title={poster_name}
		  subtitle={moment(timestamp * 1000).format('MMMM Do, h:mm a')}/>
		{ owner &&
		  <FaTrashO
			className="post-action"
			onClick={this.deletePost}
			size={20}/>
		}
		{ !owner &&
		  <FaFlag
			className="post-action"
			onClick={this.changeFlag}
			style={flagColor}
			size={20}/>
		}
		<CardText>{text}</CardText>
		{ media_link && media_link !== '' &&
		  <CardMedia
			aspectRatio="wide"
			image={media_link}
            onClick={this.showImage}/> }
		<CardActions>
		  <FaHeart
			className="heart-icon post-interaction"
			onClick={this.changeLike}
			style={heartColor}
			size={20}
		  />
		  <span className="like-count no-selection">{like_count}</span>
		  { repost &&
			<FaRetweet className="repost-icon post-interaction" onClick={this.retweet} size={28} />
		  }
		</CardActions>
	  </BetterCard>
    );
  }
}
