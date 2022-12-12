import React, { useState } from 'react';
import './comment.scss';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import user from '../comment-section/user.png';
import LikeButton from '../like-button';
import BeatstoreService from '../../services';
import getDateAgoText from '../../utils/get-date-ago-text';

function Comment({ id, text, date, username, likes, isLiked, isLoggedIn }) {
  const { id: userId, token } = useSelector((state) => state.userReducer);
  const [likesCount, setLikes] = useState(likes);
  const history = useHistory();

  const handleLikeClick = (state) => {
    if (!isLoggedIn) {
      history.push('/auth/register');
      return;
    }

    const beatstoreService = new BeatstoreService();

    if (state) {
      setLikes((state) => state - 1);
      beatstoreService
        .removeLike(id, userId, token)
        .then((res) => {})
        .catch((err) => {});
    } else {
      setLikes((state) => state + 1);
      beatstoreService
        .leaveLike(id, userId, token)
        .then((res) => {})
        .catch((err) => {});
    }
  };

  return (
    <div className="comment">
      <div className="side-bar">
        <div className="avatar">
          <img src={user} alt="user-avatar" />
        </div>
        <div className="likes">
          <LikeButton onChange={handleLikeClick} isLiked={isLiked} />
          <p className="like">{likesCount}</p>
        </div>
      </div>
      <div className="comment-content">
        <div className="comment-header">
          <div className="username">{username}</div>
          <div className="time">
            &nbsp; • &nbsp;
            {getDateAgoText(date)}
          </div>
        </div>
        <div className="text">{text}</div>
      </div>
      <hr />
    </div>
  );
}

export default Comment;
