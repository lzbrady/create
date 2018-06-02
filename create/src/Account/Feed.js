import React, {Component} from "react";

import {getPosts} from '../Backend/database';
import Post from './Post';

import './tabs.css';

class Feed extends Component {

    constructor() {
        super();

        this.state = {
            posts: []
        }
    }

    componentDidMount() {
        getPosts().then((posts) => {
            console.log("Posts:", posts);
            this.setState({posts: posts});
        });
        console.log(this.props.proPicUrl);
    }

    render() {
        return (
            <div id="feed-wrapper">
                <div className="profile-tab-container">
                    <ul className="post-list">
                        {this
                            .state
                            .posts
                            .map((post, index) => {
                                return (
                                    <li key={index} className="single-post"><Post name={this.props.name} post={post} proPicUrl={this.props.proPicUrl}/></li>
                                )
                            })}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Feed;