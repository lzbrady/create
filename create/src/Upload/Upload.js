import React, {Component} from "react";
import fire from '../fire';

import MdFileUpload from 'react-icons/lib/md/file-upload';
import MdCheckCircle from 'react-icons/lib/md/check-circle';
import FaSpinner from 'react-icons/lib/fa/spinner';

import './upload.css'

class Upload extends Component {

    constructor() {
        super();

        this.state = {
            fileName: "",
            isUploading: false,
            progress: 0
        }
    }
    handleUploadStart = () => this.setState({isUploading: true, progress: 0});
    handleProgress = (progress) => this.setState({progress});
    handleUploadError = (error) => {
        this.setState({isUploading: false});
        console.error(error);
    }
    handleUploadSuccess = (filename) => {
        this.setState({avatar: filename, progress: 100, isUploading: false});
        fire
            .storage()
            .ref()
            .child(filename)
            .getDownloadURL()
            .then(url => this.setState({avatarURL: url}));
    };

    handleClick() {
        console.log("Test");
        document
            .getElementById('media-capture')
            .click();
    }

    handleChange(selectorFiles : FileList)
    {
        const fileName = selectorFiles.name
        const storageRef = fire
            .storage()
            .ref();
        const uploadTask = storageRef
            .child(fileName)
            .put(selectorFiles);

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

            console.log("Done");
        });
    }

    render() {
        return (
            <div id="wrapper">
                <div id="upload-container">
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
            </div>
        )
    }
}

export default Upload;