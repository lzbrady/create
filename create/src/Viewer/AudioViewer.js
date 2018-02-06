import React, {Component} from "react";
import {loadMedia} from '../Backend/database';

class AudioViewer extends Component {
    constructor() {
        super();
        this.state = {
            audioUrl: "",
            error: "",
            albumArt: "none"
        }
    }

    componentWillMount() {
        let storageUrl = this.props.storageUrl;
        loadMedia(storageUrl).then((data) => {
            if (data.includes("Error")) {
                this.setState({error: data})
            } else {
                this.setState({audioUrl: data});
            }
        });

        let albumArtUrl = this.props.state.albumArt;
        loadMedia(albumArtUrl).then((data) => {
            if (data.includes("Error")) {
                this.setState({error: data})
            } else {
                this.setState({albumArt: data});
            }
        });
    }

    render() {
        return (
            <div id="detail-audio-wrapper">
                <img id="album-art-big" src={this.state.albumArt} alt="Album Art"/>
                <img id="album-art-small" src={this.state.albumArt} alt="Album Art"/>
                <audio id="audio" ref="audio_tag" src={this.state.audioUrl} controls/>
            </div>
        );
    }
}

export default AudioViewer;