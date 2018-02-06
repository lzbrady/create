import React, {Component} from "react";
import {loadMedia} from '../Backend/database';

class ImageViewer extends Component {
    constructor() {
        super();
        this.state = {
            imageUrl: "",
            error: ""
        }
    }

    componentWillMount() {
        let storageUrl = this.props.storageUrl;
        loadMedia(storageUrl).then((data) => {
            if (data.includes("Error")) {
                this.setState({error: data})
            } else {
                this.setState({imageUrl: data})
            }
        });
    }

    render() {
        return (
            <div id="detail-image-wrapper">
                {/*TODO: Fix weird gap at bottom*/}
                <a target="_blank" href={this.state.imageUrl}><img id="detail-image" src={this.state.imageUrl} alt="Error loading image"/></a>
                {/* <img id="detail-image" src={this.state.imageUrl} alt="Error loading image"/>             */}
            </div>
        );
    }
}

export default ImageViewer;