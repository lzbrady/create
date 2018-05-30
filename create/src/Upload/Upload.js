import React, {Component} from "react";

import MdImage from 'react-icons/lib/md/image';
import {post} from '../Backend/database';

import './upload.css'

class Upload extends Component {

    constructor() {
        super();

        this.state = {
            post: "",
            image: {},
            postSuccess: false,
            postError: false,
            errorMessage: "",
            postButtonMessage: "Post"
        }

        this.handleChange = this
            .handleChange
            .bind(this);
        this.handleInputChange = this
            .handleInputChange
            .bind(this);
        this.handlePost = this
            .handlePost
            .bind(this);
    }

    handleClick() {
        document
            .getElementById('media-capture')
            .click();
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;

        this.setState({[name]: value, postSuccess: false, postError: false, postButtonMessage: "Post", errorMessage: ""});
    }

    handleChange(selectorFiles) {
        if (selectorFiles.type.includes("image")) {
            this.setState({image: selectorFiles});
        } else {
            console.log("NAH")
        }
    }

    handlePost() {
        let postRequest = post(this.state.post, this.state.image);
        if (postRequest.success) {
            this.setState({postSuccess: true, postError: false, errorMessage: ""});
        } else if (postRequest.error) {
            this.setState({postSuccess: false, postError: true, errorMessage: postRequest.error});
        } else {
            postRequest.then((result) => {
                if (result.success) {
                    this.setState({postSuccess: true, postError: false, errorMessage: ""});
                } else if (result.error) {
                    this.setState({postSuccess: false, postError: true, errorMessage: postRequest.error});
                }
            })
        }
    }

    render() {
        return (
            <div id="upload-wrapper">
                <textarea
                    name="post"
                    type="text"
                    className="post-text-input"
                    placeholder="Write post"
                    onChange={this.handleInputChange}/>

                <div className="post-button-container">
                    <button
                        className={this.state.postSuccess
                        ? "post-button post-button-success"
                        : this.state.postError
                            ? "post-button post-button-error"
                            : "post-button"}
                        onClick={this.handlePost}>{this.state.postButtonMessage}</button>
                    <MdImage onClick={this.handleClick} className="post-icon" size={200}/>
                </div>

                <input
                    id="media-capture"
                    type="file"
                    onChange={(e) => this.handleChange(e.target.files[0])}/>
            </div>
        );
    }
}

export default Upload;