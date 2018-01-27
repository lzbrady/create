import React, {Component} from "react";
import DefaultThumbnail from '../images/default-thumbnail-image.svg';
import fire from '../fire';

class Detail extends Component {
    constructor() {
        super();
        this.state = {
            thumbnailUrl: DefaultThumbnail, //TODO
            title: "",
            description: "",
            tags: [], //TODO
            contentType: "",
            storageUrl: ""
        }
    }

    render() {
        return (
            <div>Detail View</div>
        )
    }
}

export default Detail;