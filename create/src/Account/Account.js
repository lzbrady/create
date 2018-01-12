import React, { Component } from 'react';
import defaultProfilePicture from '../images/default-profile-picture.png';
import './account.css';
import MdMusicVideo from 'react-icons/lib/md/music-video';

class Account extends Component {
    render() {
        return (
            <div id="wrapper">
                <div id="profile-info-div" className="info-div">
                    <img className="profile-info" id="profile-picture" src={defaultProfilePicture} alt="Profile Picture"/>
                    <p className="profile-info" id="profile-name">Luke Brady</p>
                    
                    <p className="profile-info account-heading" id="profile-skills-heading">Creates:</p>
                    <ul className="profile-info" id="skill-list">
                        <li className="skill">Music</li>
                        <li className="skill">Videos</li>
                        <li className="skill">Photos</li>
                        <li className="skill">Music</li>
                        <li className="skill">Videos</li>
                        <li className="skill">Photos</li>
                    </ul>
                </div>

                <div id="content-info-div" className="info-div">
                    <p className="account-heading"  id="content-heading">Creations:</p>
                    
                    <div className="creation">
                        <div className="creation-icon">
                            <MdMusicVideo size={125} />
                        </div>
                        <div className="creation-info">
                            <p className="creation-name">Creation Name</p>
                            <p>This is a description of the creation. It can be as long as the user likes, although there will probably be a cap on the number of characters allowed. For this display, the amount of the description will be significantly lower than that allowed in the detailed display of the actual creation.</p>
                        </div>
                    </div>

                    <div className="creation">
                        <div className="creation-icon">
                            <MdMusicVideo size={125} />
                        </div>
                        <div className="creation-info">
                            <p className="creation-name">Creation Name</p>
                            <p>This is a description of the creation. It can be as long as the user likes, although there will probably be a cap on the number of characters allowed. For this display, the amount of the description will be significantly lower than that allowed in the detailed display of the actual creation.</p>
                        </div>
                    </div>

                    <div className="creation">
                        <div className="creation-icon">
                            <MdMusicVideo size={125} />
                        </div>
                        <div className="creation-info">
                            <p className="creation-name">Creation Name</p>
                            <p>This is a description of the creation. It can be as long as the user likes, although there will probably be a cap on the number of characters allowed. For this display, the amount of the description will be significantly lower than that allowed in the detailed display of the actual creation.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Account;