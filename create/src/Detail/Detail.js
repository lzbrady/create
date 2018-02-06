import React, {Component} from "react";
import DefaultThumbnail from '../images/default-thumbnail-image.svg';
import {getCreationDetail} from '../Backend/database';
import ViewMedia from '../Viewer/Viewer'

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
            comments: [],
            albumArt: "none"
        }
    }

    componentWillMount() {
        let fbk = this.props.match.params.String;
        getCreationDetail(fbk).then((data) => {
            let tags = data.tags || ["No Tags Yet"];
            let comments = data.comments || ["No Comments Yet"];
            this.setState({
                thumbnailUrl: data.thumbnailUrl,
                title: data.title,
                description: data.description,
                tags: tags,
                comments: comments,
                contentType: data.contentType,
                storageUrl: data.storageUrl,
                albumArt: data.albumArt
            });
        });
    }

    render() {
        return (
            <div id="detail-wrapper">
                <div id="detail-left">
                    <div id="detail-media-wrapper">
                        <ViewMedia state={this.state} storageUrl={this.state.storageUrl}/>
                    </div>
                    <div id="detail-title">
                        {this.state.title}
                    </div>
                    <div id="detail-description">
                        {this.state.description}
                    </div>
                    <div id="detail-comment-wrapper">
                        <h1 className="detail-heading">Comments</h1>
                        <ul className="detail-list">
                            {this
                                .state
                                .comments
                                .map((comment, index) => {
                                    return <li className="detail-comment" key={index}>{comment}</li>;
                                })}
                        </ul>
                    </div>
                </div>
                <div id="detail-right">
                    <div id="detail-tag-wrapper">
                        <h1 className="detail-heading">Tags</h1>
                        <ul className="detail-list">
                            {this
                                .state
                                .tags
                                .map((tag, index) => {
                                    return <li className="detail-tag" key={index}>{tag}</li>;
                                })}
                        </ul>
                    </div>
                    <div id="detail-suggested-wrapper">
                        <h1 className="detail-heading">Suggestions</h1>
                        <ul className="detail-list">
                            <li className="detail-suggestion">Coming Soon!</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Detail;