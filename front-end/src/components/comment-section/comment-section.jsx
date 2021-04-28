import React from 'react';
import './comment-section.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComments, faHeart, faCommentDots} from "@fortawesome/free-solid-svg-icons";
import user from './user.png';
import LikeButton from "../like-button";
import Comment from "../comment";

const CommentSection = ({comments, userId}) => {

    return (
        <div className="comment-section__wrapper">
            <div className="header">
                <p><FontAwesomeIcon icon={faComments}/> COMMENTS</p>
            </div>
            <section className="stat-wrapper">
                <span>{comments.reduce((accumulator, c) => {
                    return c.likesCount + accumulator;
                }, 0)} LIKES <span className="like"><FontAwesomeIcon icon={faHeart}/></span></span>
                <span>{comments.length} COMMENTS <FontAwesomeIcon icon={faCommentDots}/></span>
            </section>
            <section className="comments-wrapper">
                {
                    comments.map(c => {
                        const isLiked = !!c.likes.find(l => l.userId === userId);
                        console.log(c.likes);
                        return <Comment
                            key={c._id.toString()}
                            id={c._id.toString()}
                            text={c.text}
                            username={c.user[0].username}
                            date={c.date}
                            isLiked={isLiked}
                            likes={c.likes.length}/>
                    })
                }
                {
                    comments.length === 0 ? <p className="tip">You will be first to comment this beat! Thank you!</p> : null
                }
            </section>
        </div>
    )
}

export default CommentSection;