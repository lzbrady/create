import React, {Component} from "react";
import fire from '../fire';

import MdFileUpload from 'react-icons/lib/md/file-upload';
import MdCheckCircle from 'react-icons/lib/md/check-circle';
import FaSpinner from 'react-icons/lib/fa/spinner';
import DefaultThumbnail from '../images/default-thumbnail-image.svg';
import {uploadMediaToDatabase, pushToStorage} from '../Backend/database';
import MdMusicVideo from 'react-icons/lib/md/music-video';

import './upload.css'

class UploadFile extends Component {
    constructor() {
        super();

        this.handleChange = this
            .handleChange
            .bind(this);
    }

    handleClick() {
        document
            .getElementById('media-capture')
            .click();
    }

    handleChange(selectorFiles : FileList) {
        document
            .getElementById('xxl-upload')
            .style
            .display = "none";
        document
            .getElementById('xxl-uploading')
            .style
            .display = "initial";
        if (selectorFiles.type.includes("image")) {
            this
                .props
                .giveSelectorFile(selectorFiles);
        } else if (selectorFiles.type.includes("audio")) {
            this
                .props
                .giveSelectorFile(selectorFiles);
        } else if (selectorFiles.type.includes("video")) {
            this
                .props
                .giveSelectorFile(selectorFiles);
        } else if (selectorFiles.type.includes("text")) {
            this
                .props
                .giveSelectorFile(selectorFiles);
        } else {
            console.log("NAH")
        }
    }

    render() {
        return (
            <div id="upload-file-wrapper" className={this.props.className}>
                <MdFileUpload
                    onClick={this.handleClick}
                    className="xxl-icon"
                    id="xxl-upload"
                    size={200}/>
                <FaSpinner
                    onClick={this.handleClick}
                    className="xxl-icon"
                    id="xxl-uploading"
                    size={100}/>
                <MdCheckCircle
                    onClick={this.handleClick}
                    className="xxl-icon"
                    id="xxl-uploaded"
                    size={150}/>

                <input
                    id="media-capture"
                    type="file"
                    onChange={(e) => this.handleChange(e.target.files[0])}/>
            </div>
        )
    }
}

export default UploadFile;