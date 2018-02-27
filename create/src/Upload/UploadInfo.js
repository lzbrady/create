import React, {Component} from "react";

import './upload.css'

class UploadInfo extends Component {

    constructor() {
        super();

        this.state = {
            title: "",
            description: "",
            tags: []
        }

        this.handleInputChange = this
            .handleInputChange
            .bind(this);
        this.handleSubmit = this
            .handleSubmit
            .bind(this);
        this.uploadThumbnail = this
            .uploadThumbnail
            .bind(this);
        this.newTag = this
            .newTag
            .bind(this);
        this.removeTag = this
            .removeTag
            .bind(this);
    }

    selectThumbnail() {
        document
            .getElementById('thumbnail-capture')
            .click();
    }

    uploadThumbnail(selectorFile : FileList) {
        console.log(selectorFile.type);
        if (selectorFile.type.includes("image")) {
            this
                .props
                .giveThumbnailSelectorFile(selectorFile);
        } else {
            console.log("TODO: Tell user it needs to be an image");
        }
    }

    handleSubmit(event) {
        console.log(this.state);
        this
            .props
            .giveCreationMetadata(this.state);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;

        this.setState({[name]: value});
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
                    this.setState({tags: newStateTags})
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
            this.setState({tags: newStateTags})
        }
    }

    render() {
        return (
            <div id="upload-info-wrapper" className={this.props.className}>
                <div id="upload-info-left">
                    <div className="upload-info-thumbnail-container">
                        <img
                            className="upload-info-thumbnail"
                            src={this.state.albumArtImg}
                            alt="Thumbnail Image"
                            onClick={this.selectThumbnail}/>
                    </div>
                    <h3 id="tags-title">Tags:</h3>
                    <div id="upload-info-tags">
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
                    </div>
                    <input
                        type="text"
                        className="tag-input"
                        placeholder="Tag Your Media!"
                        onKeyPress={this.newTag}/>
                </div>

                <div id="upload-info-right">
                    <p className="upload-info-label">Privacy:</p>
                    <select>
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                        <option value="unlisted">Unlisted</option>
                    </select>
                    <p className="upload-info-label">Title:</p>
                    <input
                        name="title"
                        type="text"
                        className="upload-info-input"
                        id="upload-info-input-title"
                        onChange={this.handleInputChange}/>
                    <p className="upload-info-label">Description:</p>
                    <textarea
                        name="description"
                        type="text"
                        className="upload-info-input"
                        id="upload-info-input-description"
                        onChange={this.handleInputChange}/>
                    <button
                        disabled={!this.state.title}
                        className={!this.state.title
                        ? "disabled"
                        : "enabled"}
                        id="upload-info-submit-button"
                        onClick={this.handleSubmit}>Submit</button>
                </div>

                <input
                    id="thumbnail-capture"
                    type="file"
                    onChange={(e) => this.uploadThumbnail(e.target.files[0])}/>
            </div>
        )
    }
}

export default UploadInfo;