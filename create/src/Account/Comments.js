import React from "react";

import FaTrashO from 'react-icons/lib/fa/trash-o';

function Comments(props) {
    return <div className="comment-section-wrapper">
        {/* <h3 className="comment-heading">Comments</h3> */}
        {(props.comments && props.numComments <= props.comments.length) && <button className="see-more-comments-button" onClick={props.seeMoreComments}>See More Comments</button>}
        {props.comments && props
            .comments
            .map((comment, index) => {
                return ((props.comments.length - props.numComments) < index && <div key={index} className="comment-container">
                    <div className="comment-content">
                        <div className="commented-by" key={index}>{comment.commentedBy}</div>
                        <div className="comment">{comment.comment}</div>
                    </div>
                    <FaTrashO
                        className="delete-comment-icon"
                        onClick={() => props.deleteComment(comment)}/>
                </div>)
            })}

        {props
            .latestComments
            .map((comment, index) => {
                return <div key={index} className="comment-container">
                    <div className="commented-by" key={index}>{props.name}</div>
                    <div className="comment">{comment}</div>
                </div>
            })}

        <textarea
            name="commentTextArea"
            type="text"
            value={props.comment}
            className="comment-input"
            placeholder="Write Comment"
            onChange={props.getComment}/>

        <button className="comment-button" onClick={props.sendComment}>Comment</button>
    </div>
}

export default Comments;