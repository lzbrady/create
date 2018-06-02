import React, {Component} from 'react';
import {NavLink} from "react-router-dom";
import Upload from '../Upload/Upload';

import './account.css';

import FaPencil from 'react-icons/lib/fa/pencil';
import MdCameraAlt from 'react-icons/lib/md/camera-alt';

import ProfileLinks from './Profile-Links';
import Feed from './Feed';
import Reviews from './Reviews';
import Collabs from './Collabs';

import {getAccountInfo, updateAccountInfo, setProfilePicture} from '../Backend/database';

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            proPicUrl: "",
            skills: [],
            detailCreation: "",
            showFeed: false,
            showReviews: false,
            showWorkedWith: false
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

    uploadProfilePicture(selectorFiles) {
        setProfilePicture(selectorFiles).then((url) => {
            this.setState({proPicUrl: url});
            window
                .location
                .reload();
        });
    }

    componentDidMount() {
        getAccountInfo().then((snapshot) => {
            this.setState({name: snapshot.name, proPicUrl: snapshot.proPicUrl, skills: snapshot.skills, showFeed: true});
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
                        <Upload/>
                    </div>

                    <ProfileLinks/>

                    <div className="profile-tabs">
                        <p
                            className="profile-tab"
                            onClick={() => this.setState({showFeed: true, showReviews: false, showWorkedWith: false})}>Feed</p>
                        <p
                            className="profile-tab"
                            onClick={() => this.setState({showFeed: false, showReviews: true, showWorkedWith: false})}>Reviews</p>
                        <p
                            className="profile-tab"
                            onClick={() => this.setState({showFeed: false, showReviews: false, showWorkedWith: true})}>Collabs</p>
                    </div>

                    {this.state.showFeed && <Feed name={this.state.name} proPicUrl={this.state.proPicUrl}/>}
                    {this.state.showReviews && <Reviews/>}
                    {this.state.showWorkedWith && <Collabs/>}
                </div>
            </div>
        );
    }
}

export default Account;