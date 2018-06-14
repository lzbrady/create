import React, { Component } from "react";

import { getReviews } from '../Backend/database';
import Stars from '../Misc/Stars';
import './reviews.css';

class Reviews extends Component {

    constructor() {
        super();

        this.state = {
            reviews: []
        }
    }

    componentDidMount() {
        getReviews().then((reviews) => {
            console.log("Reviews", reviews);
            this.setState({ reviews: reviews });
        });
    }

    getPrettyDate(timestamp) {
        let currentTime = Date.now();
        let date = new Date(timestamp);
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
        return postedDate;
    }

    render() {
        return (
            <div className="feed-wrapper">
                {this.state.reviews.map((review, index) => {
                    return (<div className="post-container" key={index}>
                        <div className="review-account-info">
                            <img
                                className="post-profile-picture"
                                src={review.reviewerProPicUrl}
                                alt="Profile Pic" />
                            <div className="review-name-and-stars">
                                <p className="posted-by">{review.reviewerUsername}</p>
                                <p className="review-star-number">{review.stars}</p>
                                <Stars stars={review.stars} />
                            </div>
                            <p className="review-content">{review.review}</p>
                            <p className="review-date posted-date">{this.getPrettyDate(review.timestamp)}</p>
                        </div>
                    </div>)
                })}
            </div>
        );
    }
}

export default Reviews;