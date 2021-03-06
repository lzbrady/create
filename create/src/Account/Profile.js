import React, {Component} from 'react';
import './account.css';

import MdMusicVideo from 'react-icons/lib/md/music-video';
import FaPencil from 'react-icons/lib/fa/pencil';
import MdCameraAlt from 'react-icons/lib/md/camera-alt';
import AccountDetailCreation from './AccountDetailCreation';

import Applemusic from '../images/logos/applemusic-logo.png';
import Facebook from '../images/logos/facebook-logo.png';
import Soundcloud from '../images/logos/soundcloud-logo.png';
import Spotify from '../images/logos/spotify-logo.png';
import Twitter from '../images/logos/twitter-logo.png';
import Website from '../images/logos/web-logo.png';
import Youtube from '../images/logos/youtube-logo.png';

import {getAccountInfo, getAccountCreation, updateAccountInfo, setProfilePicture, deleteCreation} from '../Backend/database';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            proPicUrl: "",
            skills: [],
            detailCreation: ""
        };

        this.newSkill = this
            .newSkill
            .bind(this);
        this.handleChange = this
            .handleChange
            .bind(this);
        this.handleClick = this
            .handleClick
            .bind(this);
        this.uploadProfilePicture = this
            .uploadProfilePicture
            .bind(this);
    }

    newSkill(event) {
        if (event.key === "Enter") {
            let skill = event.target.value;
            if (skill !== undefined && skill.trim() !== "") {
                let contains = false;
                for (let i = 0; i < this.state.skills.length; i++) {
                    if (this.state.skills[i].toLowerCase().trim() === skill.toLowerCase().trim()) {
                        contains = true;
                    }
                }
                if (!contains) {
                    let newStateSkills = this.state.skills;
                    newStateSkills.push(skill.trim());
                    this.setState({skills: newStateSkills});
                    let accountObj = {
                        skills: newStateSkills
                    }
                    updateAccountInfo(accountObj);
                }
                event.target.value = "";
            }
        }
    }

    removeSkill(skillObject) {
        let skill = skillObject["skill"];
        if (skill !== undefined) {
            let newStateSkills = this.state.skills;
            let index = newStateSkills.indexOf(skill);
            if (index > -1) {
                newStateSkills.splice(index, 1);
                let accountObj = {
                    skills: newStateSkills
                }
                updateAccountInfo(accountObj);
            }
            this.setState({skills: newStateSkills});
        }
    }

    handleChange(event) {
        this.setState({name: event.target.value});
        let accountObj = {
            name: event.target.value
        }
        updateAccountInfo(accountObj);
    }

    handleClick() {
        document
            .getElementById('profile-picture-capture')
            .click();
    }

    uploadProfilePicture(selectorFiles : FileList) {
        setProfilePicture(selectorFiles).then((url) => {
            this.setState({proPicUrl: url});
            window
                .location
                .reload();
        });
    }

    componentWillMount() {
        getAccountInfo().then((snapshot) => {
            this.setState({name: snapshot.name, proPicUrl: snapshot.proPicUrl, skills: snapshot.skills});
        });
    }

    render() {
        return (
            <div id="wrapper">
                <div id="profile-info-div" className="info-div">
                    <div id="profile-picture-container" onClick={this.handleClick}>
                        <img
                            className="profile-info"
                            id="profile-picture"
                            src={this.state.proPicUrl}
                            alt="Profile Pic"/>
                        <MdCameraAlt className="profile-picture-camera-icon"/>
                        <input
                            id="profile-picture-capture"
                            type="file"
                            onChange={(e) => this.uploadProfilePicture(e.target.files[0])}/>
                    </div>

                    <div className="profile-name-container">
                        <FaPencil className="edit-icon"/>
                        <input
                            className="profile-info"
                            id="profile-name"
                            value={this.state.name}
                            onChange={this.handleChange}/>
                    </div>

                    <p className="profile-info account-heading" id="profile-skills-heading">Creates:</p>
                    <ul className="profile-info" id="skill-list">
                        {this
                            .state
                            .skills
                            .map((skill) => {
                                return <li className="skill" key={skill}>{skill}
                                    <div className="tag-x" onClick={e => this.removeSkill({skill})}>
                                        x
                                    </div>
                                </li>;
                            })}
                    </ul>
                    <input
                        type="text"
                        className="skill-input"
                        placeholder="Add Skill! (Hit Enter)"
                        onKeyPress={this.newSkill}/>
                </div>

                <div id="content-info-div" className="info-div">
                    <div className="profile-btn-div">
                        <p className="profile-btn">Contact</p>
                    </div>
                    <div className="profile-links-container">
                        <img src={Applemusic} alt="Apple Music" className="profile-link"/>
                        <img src={Facebook} alt="Apple Music" className="profile-link"/>
                        <img src={Soundcloud} alt="Apple Music" className="profile-link"/>
                        <img src={Spotify} alt="Apple Music" className="profile-link"/>
                        <img src={Twitter} alt="Apple Music" className="profile-link"/>
                        <img src={Website} alt="Apple Music" className="profile-link"/>
                        <img src={Youtube} alt="Apple Music" className="profile-link"/>
                    </div>
                    <AccountDetailCreation
                        ck={this.state.detailCreation}
                        closeOperation={this.closeDetailView}
                        deleteOperation={this.deleteCreation}/>
                    <p className="account-heading" id="content-heading">Creations:</p>
                </div>
            </div>
        );
    }
}

export default Profile;