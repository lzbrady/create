import React, {Component} from "react";

import DefaultThumbnail from '../images/default-thumbnail.svg';

import './upload.css'

class UploadForm extends Component {

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

export default UploadForm;