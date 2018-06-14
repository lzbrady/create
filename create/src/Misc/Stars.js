import React from "react";

import './misc.css';

function Stars(props) {
    return <div className="star-container">
        <div className="star-wrapper">
            {props.stars === 0.5 && <p className="half-star">&#9733;</p>}
            <p className={props.stars >= 1 ? "full-star" : "empty-star"}>&#9733;</p>
        </div>
        <div className="star-wrapper">
            {props.stars === 1.5 && <p className="half-star">&#9733;</p>}
            <p className={props.stars >= 2 ? "full-star" : "empty-star"}>&#9733;</p>
        </div>
        <div className="star-wrapper">
            {props.stars === 2.5 && <p className="half-star">&#9733;</p>}
            <p className={props.stars >= 3 ? "full-star" : "empty-star"}>&#9733;</p>
        </div>
        <div className="star-wrapper">
            {props.stars === 3.5 && <p className="half-star">&#9733;</p>}
            <p className={props.stars >= 4 ? "full-star" : "empty-star"}>&#9733;</p>
        </div>
        <div className="star-wrapper">
            {props.stars === 4.5 && <p className="half-star">&#9733;</p>}
            <p className={props.stars >= 5 ? "full-star" : "empty-star"}>&#9733;</p>
        </div>
    </div>
}

export default Stars;