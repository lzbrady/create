import React from "react";

function AddLink(props) {
    return <div className="add-link-container">
        <div className="add-link-wrapper">
            <p className="add-link-heading">Add link for {props.title}</p>
            <input
                className="add-link-input"
                value={props.link}
                placeholder="www..."
                onChange={props.updateLink}/>
            <p className="error-message">{props.error}</p>
            <div className="add-link-button-wrapper">
                <button
                    className="save-button save-add-link-button add-link-button"
                    onClick={props.confirm}>Save</button>
                <button
                    className="cancel-button cancel-add-link-button add-link-button"
                    onClick={props.cancel}>Cancel</button>
            </div>
        </div>
    </div>
}

export default AddLink;