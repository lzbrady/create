import React, {Component} from "react";
import DefaultThumbnail from '../images/default-thumbnail-image.svg';
import {getCreationDetail} from '../Backend/database';

import './detail.css'

class Detail extends Component {
    constructor() {
        super();
        this.state = {
            thumbnailUrl: DefaultThumbnail, //TODO
            title: "",
            description: "",
            tags: [], //TODO
            contentType: "",
            storageUrl: "",
            comments: []
        }
    }

    componentWillMount() {
        let fbk = this.props.match.params.String;
        getCreationDetail(fbk).then((data) => {
            console.log("Data:", data.comments);
            let tags = data.tags || ["No Tags Yet"];
            let comments = data.comments || ["No Comments Yet"];
            this.setState({
                thumbnailUrl: data.thumbnailUrl,
                title: data.title,
                description: data.description,
                tags: tags,
                comments: comments,
                contentType: data.contentType,
                storageUrl: data.storageUrl
            })
        })
    }

    render() {
        return (
            <div id="css-wrapper">
                <div id="css-left">
                    <div id="css-media-wrapper">
                        Image
                    </div>
                    <div id="css-description">
                        {this.state.description}
                    </div>
                    <div id="css-comment-wrapper">
                        <ul id="css-comment-list">
                            {this
                                .state
                                .comments
                                .map((comment, index) => {
                                    return <li className="css-comment" key={index}>{comment}</li>;
                                })}
                        </ul>
                    </div>
                </div>
                <div id="css-right">
                    <div id="css-tag-wrapper">
                        <ul id="css-tag-list">
                            <li className="css-css-tag">Tag 1</li>
                            <li className="css-css-tag">Tag 2</li>
                            <li className="css-tag">Tag 3</li>
                        </ul>
                    </div>
                    <div id="css-css-suggested-wrapper">
                        <ul id="css-css-suggested-list">
                            <li className="css-suggestion">Suggestion 1</li>
                            <li className="css-suggestion">Suggestion 2</li>
                            <li className="css-suggestion">Suggestion 3</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Detail;