import React, {Component} from "react";

class Feed extends Component {

    constructor() {
        super();

        this.state = {
            post: ""
        }
    }

    render() {
        return (
            <div id="feed-wrapper">
                Feed
            </div>
        );
    }
}

export default Feed;