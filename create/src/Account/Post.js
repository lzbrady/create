import React, {Component} from "react";

import Comments from './Comments';
import {comment, loadComments, deleteCommentFromDatabase, loadImage} from '../Backend/database';

import './post.css';

class Post extends Component {
    constructor() {
        super();

        this.state = {
            posts: [],
            comment: "",
            latestComments: [],
            numComments: 6,
            postedAt: "--:--",
            imageUrl: ""
        }

        this.getComment = this
            .getComment
            .bind(this);

        this.sendComment = this
            .sendComment
            .bind(this);

        this.seeMoreComments = this
            .seeMoreComments
            .bind(this);

        this.getPrettyDate = this
            .getPrettyDate
            .bind(this);

        this.deleteComment = this
            .deleteComment
            .bind(this);
    }

    componentDidMount() {
        if (this.props.post.comments) {
            loadComments(this.props.post.pid).then((comments) => {
                this.setState({comments: comments});
            });
        }

        if (this.props.post.image) {
            loadImage(this.props.post.image).then((url) => {
                console.log("Url", url);
                this.setState({imageUrl: url});
            })
        }

        this.getPrettyDate(this.props.post.timestamp);
    }

    getPrettyDate(timestamp) {
        let currentTime = Date.now();
        let date = new Date(this.props.post.timestamp);
        let postedDate = "";
        if (currentTime - 86400000 < timestamp) {
            // Today
            if (currentTime - 3600000 < timestamp) {
                // Less than an hour ago
                let minutesAgo = Math.round(((currentTime - timestamp) / 1000) / 60);
                postedDate = minutesAgo + " ";
                postedDate += minutesAgo === 1
                    ? "minute ago"
                    : " minutes ago";
            } else {
                let hoursAgo = Math.round((((currentTime - timestamp) / 1000) / 60) / 24);
                postedDate = hoursAgo + " ";
                postedDate += hoursAgo === 1
                    ? "hour ago"
                    : " hours ago";
            }
        } else {
            let month = "";
            switch (date.getMonth()) {
                case 0:
                    month = "Jan. "
                    break;
                case 1:
                    month = "Feb. "
                    break;
                case 2:
                    month = "March "
                    break;
                case 3:
                    month = "April "
                    break;
                case 4:
                    month = "May "
                    break;
                case 5:
                    month = "June "
                    break;
                case 6:
                    month = "July "
                    break;
                case 7:
                    month = "Aug. "
                    break;
                case 8:
                    month = "Sep. "
                    break;
                case 9:
                    month = "Oct. "
                    break;
                case 10:
                    month = "Nov. "
                    break;
                case 11:
                    month = "Dec. "
                    break;
                default:
                    break;
            }

            postedDate = month;
            postedDate += date.getDate() + ", ";
            postedDate += date.getFullYear();
        }
        this.setState({postedAt: postedDate});
    }

    getComment(event) {
        this.setState({comment: event.target.value});
    }

    sendComment() {
        if (this.state.comment.trim() !== "" && this.props.post.pid) {
            comment(this.props.post.pid, this.state.comment.trim());
            let newLatestComments = this.state.latestComments;
            newLatestComments.push(this.state.comment.trim());
            this.setState({latestComments: newLatestComments});
        }
        this.setState({comment: ""});
    }

    seeMoreComments() {
        if (this.props.post.comments && this.state.numComments <= this.props.post.comments.length) {
            let newNum = this.state.numComments + 5;
            this.setState({numComments: newNum});
        }
    }

    deleteComment(commentObject) {
        let newComments = this.state.comments;
        let index = newComments.indexOf(commentObject);
        if (index > -1) {
            deleteCommentFromDatabase(this.props.post, commentObject);
            newComments.splice(index, 1);
            this.setState({comments: newComments});
        }
    }

    render() {

        return (
            <div className="post-container">
                <div className="post-wrapper">
                    <div className="post-account-info">
                        <img
                            className="post-profile-picture"
                            src={this.props.proPicUrl}
                            alt="Profile Picture"/>
                        <div className="post-name-and-date">
                            <p className="posted-by">{this.props.name}</p>
                            <p className="posted-date">{this.state.postedAt}</p>
                        </div>
                    </div>
                    <p className="post">{this.props.post.post}</p>
                    {this.props.post.image && <div className="post-image-wrapper"><img className="post-image" src={this.state.imageUrl} alt="Loading..."/></div>}
                </div>
                <Comments
                    comments={this.state.comments}
                    comment={this.state.comment}
                    getComment={this.getComment}
                    name={this.props.name}
                    deleteComment={this.deleteComment}
                    latestComments={this.state.latestComments}
                    numComments={this.state.numComments}
                    seeMoreComments={this.seeMoreComments}
                    sendComment={this.sendComment}/>
            </div>
        );
    }
}

export default Post;