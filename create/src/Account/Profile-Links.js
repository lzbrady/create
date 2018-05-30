import React, {Component} from "react";

import Applemusic from '../images/logos/applemusic-logo.png';
import Facebook from '../images/logos/facebook-logo.png';
import Soundcloud from '../images/logos/soundcloud-logo.png';
import Spotify from '../images/logos/spotify-logo.png';
import Twitter from '../images/logos/twitter-logo.png';
import Website from '../images/logos/web-logo.png';
import Youtube from '../images/logos/youtube-logo.png';

class ProfileLinks extends Component {

    constructor() {
        super();

        this.state = {
            post: ""
        }
    }

    render() {
        return (
            <div id="profile-links-wrapper">
                <div className="profile-links-container">
                    <img src={Applemusic} alt="Apple Music" className="profile-link"/>
                    <img src={Facebook} alt="Facebook" className="profile-link"/>
                    <img src={Soundcloud} alt="SoundCloud" className="profile-link"/>
                    <img src={Spotify} alt="Spotify" className="profile-link"/>
                    <img src={Twitter} alt="Twitter" className="profile-link"/>
                    <img src={Website} alt="Website" className="profile-link"/>
                    <img src={Youtube} alt="YouTube" className="profile-link"/>
                </div>
            </div>
        );
    }
}

export default ProfileLinks;