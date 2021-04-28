import React, { useState } from 'react';
import './comment.scss';
import user from "../comment-section/user.png";
import LikeButton from "../like-button";
import BeatstoreService from "../../services";
import { useSelector } from "react-redux";
import getDateAgoText from "../../utils/get-date-ago-text";

const Comment = ({id, text, date, username, likes, isLiked}) => {
    const {id: userId, token} = useSelector(state => state.userReducer);
    const [likesCount, setLikes] = useState(likes);

    const handleLikeClick = (state) => {
        const beatstoreService = new BeatstoreService();

        if (state) {
            setLikes(state => state - 1);
            beatstoreService.removeLike(id, userId, token)
                .then(res => {})
                .catch(err => {});
        }
        else {
            setLikes(state => state + 1);
            beatstoreService.leaveLike(id, userId, token)
                .then(res => {})
                .catch(err => {});
        }
    }

    return (
        <div className="comment">
            <div className="side-bar">
                <div className="avatar">
                    <img src={user} alt="user-avatar"/>
                </div>
                <div className="likes">
                    <LikeButton onChange={handleLikeClick} isLiked={isLiked}/>
                    <p className="like">{likesCount}</p>
                </div>
            </div>
            <div className="comment-content">
                <div className="comment-header">
                    <div className="username">{username}</div>
                    <div className="time">&nbsp; • &nbsp;{getDateAgoText(date)}</div>
                </div>
                <div className="text">
                    {text}
                </div>
            </div>
            <hr/>
        </div>
    )
}

export default Comment;