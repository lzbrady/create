import React, {Component} from "react";
import fire from '../fire';

import MdFileUpload from 'react-icons/lib/md/file-upload';
import MdCheckCircle from 'react-icons/lib/md/check-circle';
import FaSpinner from 'react-icons/lib/fa/spinner';
import DefaultThumbnail from '../images/default-thumbnail-image.svg';

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
            storageUrl: ""
        }
        this.handleInputChange = this
            .handleInputChange
            .bind(this);
        this.handleSubmit = this
            .handleSubmit
            .bind(this);
    }

    handleClick() {
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

            console.log("Done");

            let fullPath = uploadTask.snapshot.metadata.fullPath;
            console.log(fire.storage().ref(fullPath).toString());
            this.setState({
                contentType: uploadTask.snapshot.metadata.contentType,
                storageUrl: fire
                    .storage()
                    .ref(fullPath)
                    .toString()
            });
        });
    }

    handleSubmit(event) {
        let newCreationRef = fire
            .database()
            .ref('creations')
            .push();

        console.log(this.state);
        newCreationRef.set(this.state);

        let userCreationsRef = fire
            .database()
            .ref('users')
            .child('user1id')
            .child('creations');

        userCreationsRef.update({
            [newCreationRef.key]: true
        });
        newCreationRef.update({owner: "user1id"});
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

                <label>
                    Title:
                    <input
                        name="title"
                        type="text"
                        checked={this.state.isGoing}
                        onChange={this.handleInputChange}/>
                </label>
                <br/>
                <label>
                    Description:
                    <input
                        name="description"
                        type="text"
                        value={this.state.numberOfGuests}
                        onChange={this.handleInputChange}/>
                </label>
                <button
                    disabled={!this.state.title || !this.state.storageUrl || !this.state.contentType}
                    id="submit-button"
                    onClick={this.handleSubmit}>Submit</button>
            </div>
        )
    }
}

export default Upload;