import React, {Component} from "react";
import fire from '../fire';

import MdFileUpload from 'react-icons/lib/md/file-upload';
import MdCheckCircle from 'react-icons/lib/md/check-circle';
import FaSpinner from 'react-icons/lib/fa/spinner';
import DefaultThumbnail from '../images/default-thumbnail.svg';

import './upload.css'

class Upload extends Component {

    constructor() {
        super();

        this.state = {
            thumbnail: DefaultThumbnail,
            title: "",
            description: "",
            tags: []
        }
        this.handleInputChange = this
            .handleInputChange
            .bind(this);
    }

    handleClick() {
        console.log("Test");
        document
            .getElementById('media-capture')
            .click();
    }

    handleChange(selectorFiles : FileList)
    {
        const fileName = selectorFiles.name
        // var filePath = currentUser.uid + '/' + data.key + '/' + file.name;
        const storageRef = fire
            .storage()
            .ref();
        const uploadTask = storageRef
            .child(fileName)
            .put(selectorFiles);

        uploadTask.on('state_changed', snapshot => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            document
                .getElementById('xxl-upload')
                .style
                .display = "none";
            document
                .getElementById('xxl-uploading')
                .style
                .display = "initial";
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
            console.log(uploadTask.snapshot);
            // let creationsRef = fire     .database()     .ref('creations')     .push({ });
            // userRef.push({name: currentUser.displayName}) let userRef = fire .database()
            // .ref('users')     .child('user1'); userRef.push({name:
            // currentUser.displayName});
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;

        this.setState({[name]: value});
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    render() {
        return (
            <div id="wrapper">
                <div id="upload-container">
                    <div id="thumbnail-container">
                        <img
                            id="thumbnail-image"
                            src={this.state.thumbnail}
                            alt="Click to upload a thumbnail"/>
                    </div>
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

                <form onSubmit={this.handleSubmit}>
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
                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}

export default Upload;