import React, {Component} from "react";
import fire from '../fire';

import UploadFile from './UploadFile';
import UploadInfo from './UploadInfo';

import {uploadMediaToDatabase, pushToStorage} from '../Backend/database';

import './upload.css'

class Upload extends Component {

    constructor() {
        super();

        this.state = {
            thumbnailUrl: "",
            title: "",
            description: "",
            tags: [],
            contentType: "",
            storageUrl: ""
        }
    }

    getSelectorFile = (selectorFile) => {
        this.setState({contentType: selectorFile.type});

        let uploadTask = pushToStorage(selectorFile);
        uploadTask.on('state_changed', snapshot => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Progress: ", progress);
        }, error => {
            console.log("Error: ", error);
        }, () => {
            let fullPath = uploadTask.snapshot.metadata.fullPath;
            // addToPendingList(fire.storage().ref(fullPath).toString(), "0");
            this.setState({
                contentType: uploadTask.snapshot.metadata.contentType,
                storageUrl: fire
                    .storage()
                    .ref(fullPath)
                    .toString()
            });
        });
    };

    getThumbnailSelectorFile = (selectorFile) => {
        let uploadTask = pushToStorage(selectorFile);
        uploadTask.on('state_changed', snapshot => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Progress: ", progress);
        }, error => {
            console.log("Error: ", error);
        }, () => {
            let fullPath = uploadTask.snapshot.metadata.fullPath;
            // addToPendingList(fire.storage().ref(fullPath).toString(), "1");
            this.setState({
                thumbnailUrl: fire
                    .storage()
                    .ref(fullPath)
                    .toString()
            });
        });
    }

    getCreationMetadata = (metadata) => {
        let databaseObj = this.state;
        databaseObj.title = metadata.title;
        databaseObj.description = metadata.description;
        databaseObj.tags = metadata.tags;
        uploadMediaToDatabase(databaseObj);
    };

    render() {
        return (
            <div id="upload-wrapper">
                <UploadFile
                    className={this.state.contentType === ""
                    ? "show"
                    : "hide"}
                    giveSelectorFile={this.getSelectorFile}/>
                <UploadInfo
                    className={this.state.contentType === ""
                    ? "hide"
                    : "show"}
                    giveCreationMetadata={this.getCreationMetadata}
                    giveThumbnailSelectorFile={this.getThumbnailSelectorFile}/>
            </div>
        );
    }
}

export default Upload;