import React, {Component} from "react";
import fire from '../fire';

import MdFileUpload from 'react-icons/lib/md/file-upload';
import MdCheckCircle from 'react-icons/lib/md/check-circle';
import FaSpinner from 'react-icons/lib/fa/spinner';
import DefaultThumbnail from '../images/default-thumbnail-image.svg';
import {uploadMediaToDatabase, pushToStorage, loadMedia} from '../Backend/database';
import MdMusicVideo from 'react-icons/lib/md/music-video';

import './upload.css'

class Upload extends Component {

    constructor() {
        super();

        this.state = {
            thumbnailUrl: DefaultThumbnail, //TODO
            title: "",
            description: "",
            tags: [], //TODO
            contentType: "",
            storageUrl: "",
            albumArt: "none",
            albumArtImg: ""
        }
        this.handleInputChange = this
            .handleInputChange
            .bind(this);
        this.handleSubmit = this
            .handleSubmit
            .bind(this);
        this.uploadAlbumArt = this
            .uploadAlbumArt
            .bind(this);
        this.albumArtToDatabase = this
            .albumArtToDatabase
            .bind(this);
    }

    handleClick() {
        document
            .getElementById('media-capture')
            .click();
    }

    uploadAlbumArt() {
        document
            .getElementById('album-capture')
            .click();
    }

    // Talks to Firebase Storage
    handleChange(selectorFiles : FileList) {
        let uploadTask = pushToStorage(selectorFiles);

        // Upload to Firebase Storage, most of this code is changing image displays
        uploadTask.on('state_changed', snapshot => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            document
                .getElementById('xxl-upload')
                .style
                .display = "none";
            document
                .getElementById('xxl-uploading')
                .style
                .display = "initial";
            console.log("Progress: ", progress);
        }, error => {
            document
                .getElementById('xxl-upload')
                .style
                .display = "intial";
            document
                .getElementById('xxl-uploading')
                .style
                .display = "none";
            console.log("Error: ", error);
        }, () => {
            document
                .getElementById('xxl-upload')
                .style
                .display = "none";
            document
                .getElementById('xxl-uploading')
                .style
                .display = "none";
            document
                .getElementById('xxl-uploaded')
                .style
                .display = "initial";

            let fullPath = uploadTask.snapshot.metadata.fullPath;
            this.setState({
                contentType: uploadTask.snapshot.metadata.contentType,
                storageUrl: fire
                    .storage()
                    .ref(fullPath)
                    .toString()
            });
        });
    }

    albumArtToDatabase(selectorFiles : FileList) {
        let uploadTask = pushToStorage(selectorFiles);

        uploadTask.on('state_changed', snapshot => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Progress: ", progress);
        }, error => {
            console.log("Error: ", error);
        }, () => {
            console.log("UploadTask", uploadTask);
            console.log("UploadTask Snapshot", uploadTask.snapshot);

            let fullPath = uploadTask.snapshot.metadata.fullPath;
            this.setState({
                albumArt: fire
                    .storage()
                    .ref(fullPath)
                    .toString(),
                albumArtImg: uploadTask.snapshot.downloadURL
            });
        });
    }

    handleSubmit(event) {
        let databaseObj = {
            thumbnailUrl: this.state.thumbnailUrl,
            title: this.state.title,
            description: this.state.description,
            tags: this.state.tags,
            contentType: this.state.contentType,
            storageUrl: this.state.storageUrl
        }
        if (this.state.albumArt !== "none") {
            databaseObj.albumArt = this.state.albumArt;
        }
        uploadMediaToDatabase(databaseObj);
    }

    handleInputChange(event, doubleCheck) {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;

        this.setState({[name]: value});
    }

    render() {
        return (
            <div id="upload-wrapper">

                <div id="input-container">
                    <p className="label">Title:</p>
                    <input
                        name="title"
                        type="text"
                        className="input"
                        id="input-title"
                        checked={this.state.isGoing}
                        onChange={this.handleInputChange}/>
                    <p className="label">Description:</p>
                    <textarea
                        name="description"
                        type="text"
                        className="input"
                        id="input-description"
                        value={this.state.numberOfGuests}
                        onChange={this.handleInputChange}/>
                    <button
                        disabled={!this.state.title || !this.state.storageUrl || !this.state.contentType}
                        className={(!this.state.title || !this.state.storageUrl || !this.state.contentType)
                        ? "disabled"
                        : "enabled"}
                        id="submit-button"
                        onClick={this.handleSubmit}>Submit</button>
                </div>

                <div
                    className={this
                    .state
                    .contentType
                    .includes("audio")
                    ? "upload-album-art-container"
                    : "hide"}
                    onClick={this.uploadAlbumArt}>
                    <p id="upload-album-art-text">Click here for custom album art.</p>
                    <MdMusicVideo
                        size={150}
                        className={this.state.albumArt === "none"
                        ? "album-art-show"
                        : "hide"}/>
                    <img
                        className={this.state.albumArt === "none"
                        ? "hide"
                        : "album-art-show"}
                        src={this.state.albumArtImg}
                        alt="Album Art"/>
                </div>

                <div
                    id={this
                    .state
                    .contentType
                    .includes("audio")
                    ? "upload-container-small"
                    : "upload-container"}>

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
                </div>

                <input
                    id="media-capture"
                    type="file"
                    onChange={(e) => this.handleChange(e.target.files[0])}/>

                <input
                    id="album-capture"
                    type="file"
                    onChange={(e) => this.albumArtToDatabase(e.target.files[0])}/>
            </div>
        )
    }
}

export default Upload;