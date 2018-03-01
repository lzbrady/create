import React, {Component} from "react";

import {getAccountCreation, loadMedia, updateCreationInfo, deleteCommentFromDatabase, setThumbnail} from '../Backend/database';
import FaPencil from 'react-icons/lib/fa/pencil';
import FaTrashO from 'react-icons/lib/fa/trash-o';
import MdCameraAlt from 'react-icons/lib/md/camera-alt';

import './account-detail.css';

class AccountDetailCreation extends Component {
    constructor() {
        super();
        this.state = {
            thumbnailUrl: "",
            title: "",
            description: "",
            tags: [],
            comments: [],
            ck: ""
        }

        this.handleSubmit = this
            .handleSubmit
            .bind(this);
        this.handleInputChange = this
            .handleInputChange
            .bind(this);
        this.handleChange = this
            .handleChange
            .bind(this);
        this.handleClick = this
            .handleClick
            .bind(this);
        this.newTag = this
            .newTag
            .bind(this);
        this.removeTag = this
            .removeTag
            .bind(this);
        this.deleteComment = this
            .deleteComment
            .bind(this);
    }

    componentDidUpdate() {
        if (this.props.ck === "" && this.state.ck !== "") {
            this.setState({ck: ""});
        }
        if (this.props.ck !== "" && this.props.ck !== this.state.ck) {
            this.setState({thumbnailUrl: ""});            
            let fbk = this.props.ck;
            if (fbk !== "") {
                getAccountCreation(fbk).then((data) => {
                    let tags = data.tags || [];
                    let comments = data.comments || [];
                    this.setState({title: data.title, description: data.description, tags: tags, comments: comments});
                    loadMedia(data.thumbnailUrl).then((url) => {
                        this.setState({thumbnailUrl: url});
                    });
                });
                this.setState({ck: fbk});
            }
        }
    }

    handleInputChange(event, doubleCheck) {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;

        this.setState({[name]: value});
    }

    handleSubmit(event) {
        document
            .getElementById("comment-input")
            .value = "";
        this.setState({comment: ""});
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
        let creationObj = {
            [event.target.name]: event.target.value
        }
        updateCreationInfo(this.state.ck, creationObj);
    }

    handleClick() {
        document
            .getElementById('account-detail-thumbnail-capture')
            .click();
    }

    uploadThumbnail(selectorFiles : FileList) {
        setThumbnail(selectorFiles, this.state.ck).then((url) => {
            this.setState({thumbnailUrl: url});
        });
    }

    newTag(event) {
        if (event.key === "Enter") {
            let tag = event.target.value;
            if (tag !== undefined && tag.trim() !== "") {
                let contains = false;
                for (let i = 0; i < this.state.tags.length; i++) {
                    if (this.state.tags[i].toLowerCase().trim() === tag.toLowerCase().trim()) {
                        contains = true;
                    }
                }
                if (!contains) {
                    let newStateTags = this.state.tags;
                    newStateTags.push(tag.trim());
                    this.setState({tags: newStateTags});
                    let creationObj = {
                        tags: newStateTags
                    };
                    updateCreationInfo(this.state.ck, creationObj);
                }
                event.target.value = "";
            }
        }
    }

    removeTag(tagObject) {
        let tag = tagObject["tag"];
        if (tag !== undefined) {
            let newStateTags = this.state.tags;
            let index = newStateTags.indexOf(tag);
            if (index > -1) {
                newStateTags.splice(index, 1);
            }
            this.setState({tags: newStateTags});
            let creationObj = {
                tags: newStateTags
            };
            updateCreationInfo(this.state.ck, creationObj);
        }
    }

    deleteComment(commentObject) {
        let newComments = this.state.comments;
        let index = newComments.indexOf(commentObject);
        if (index > -1) {
            newComments.splice(index, 1);
            this.setState({comments: newComments});
            deleteCommentFromDatabase(this.state.ck, commentObject.id);
        }
    }

    render() {
        return (
            <div
                className={this.state.ck === ""
                ? "hide"
                : "show"}
                id="account-detail-wrapper">
                <div id="account-detail-left">
                    <div className="account-detail-thumbnail-container" onClick={this.handleClick}>
                        <img
                            id="account-detail-thumbnail"
                            src={this.state.thumbnailUrl}
                            alt="Error loading thumbnail"/>
                        <MdCameraAlt className="account-detail-thumbnail-camera-icon"/>
                    </div>
                    <input
                        id="account-detail-thumbnail-capture"
                        type="file"
                        onChange={(e) => this.uploadThumbnail(e.target.files[0])}/>
                    <div id="account-detail-title">
                        <FaPencil className="edit-icon"/>
                        <input
                            className="account-detail-info"
                            id="account-detail-title-input"
                            type="text"
                            value={this.state.title}
                            name="title"
                            onChange={this.handleChange}/>
                    </div>
                    <div id="account-detail-description">
                        <textarea
                            name="description"
                            type="text"
                            value={this.state.description}
                            className="account-detail-info"
                            id="account-detail-description-input"
                            onChange={this.handleChange}/>
                    </div>
                </div>
                <div id="account-detail-right">
                    <div id="account-detail-tag-wrapper" className="account-detail-right-div">
                        <h1 className="account-detail-heading">Tags</h1>
                        {this
                            .state
                            .tags
                            .map((tag) => {
                                return <div className="tag" key={tag}>
                                    <p className="tag-text">{tag}</p>
                                    <div className="tag-x" onClick={e => this.removeTag({tag})}>
                                        x
                                    </div>
                                </div>
                            })}
                        <input
                            type="text"
                            className="tag-input"
                            placeholder="Tag Your Media!"
                            onKeyPress={this.newTag}/>
                    </div>

                    <h1 className="account-detail-heading">Comments</h1>
                    <div id="account-detail-comment-wrapper" className="account-detail-right-div">
                        <ul className="account-detail-list" id="account-detail-comment-list">
                            {(this.state.comments.length === 0)
                                ? <p id="account-detail-no-comments">No Comments Yet</p>
                                : this.state.comments.map((c, index) => {
                                    return <li className="account-detail-comment" key={c.id}>
                                        <p className="account-detail-comment-id">{c
                                                .id
                                                .substr(0, c.id.length - 6)}</p>
                                        <p className="account-detail-comment-comment">{c.comment}</p>
                                        <FaTrashO
                                            className="account-detail-trash-icon"
                                            onClick={e => this.deleteComment(c)}/>
                                    </li>;
                                })}
                        </ul>
                    </div>
                </div>
                <div id="account-detail-bottom">
                    <button
                        onClick={e => this
                        .props
                        .closeOperation(this.state.ck)}
                        id="account-detail-done">Done</button>
                    <button
                        onClick={e => this
                        .props
                        .deleteOperation(this.state.ck)}
                        id="account-detail-delete">Delete</button>
                </div>
            </div>
        )
    }
}

export default AccountDetailCreation;