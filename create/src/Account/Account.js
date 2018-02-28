import React, {Component} from 'react';
import './account.css';

import MdMusicVideo from 'react-icons/lib/md/music-video';
import FaPencil from 'react-icons/lib/fa/pencil';
import MdCameraAlt from 'react-icons/lib/md/camera-alt';
import AccountDetailCreation from './AccountDetailCreation';

import {getAccountInfo, getAccountCreation, updateAccountInfo, setProfilePicture} from '../Backend/database';

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            proPicUrl: "",
            skills: [],
            creations: [],
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
        this.viewCreationDetail = this
            .viewCreationDetail
            .bind(this);
        this.closeDetailView = this
            .closeDetailView
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
        });
    }

    componentWillMount() {
        getAccountInfo().then((snapshot) => {
            this.setState({name: snapshot.name, proPicUrl: snapshot.proPicUrl, skills: snapshot.skills});
            snapshot
                .creationIds
                .map(id => {
                    return getAccountCreation(id).then((creation) => {
                        let oldCreations = this.state.creations;
                        oldCreations.push(creation);
                        this.setState({creations: oldCreations});
                    });
                });
        });
    }

    viewCreationDetail(ck) {
        if (this.state.detailCreation === ck) {
            this.setState({detailCreation: ""});
        } else {
            this.setState({detailCreation: ck});
        }
    }

    closeDetailView(op, ck) {
        console.log("OP:", op);
        console.log("CK:", ck);
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
                        <p className="profile-picture-text">Refresh after Updating</p>
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
                    <AccountDetailCreation
                        ck={this.state.detailCreation}
                        closeOperation={(op) => this.closeDetailView(op, this.state.detailCreation)}/>
                    <p className="account-heading" id="content-heading">Creations:</p>
                    {this
                        .state
                        .creations
                        .map((creation) => {
                            return <div
                                className="creation"
                                key={creation.key}
                                onClick={e => this.viewCreationDetail(creation.key)}>
                                <div className="creation-icon">
                                    <MdMusicVideo size={125}/>
                                </div>
                                <div className="creation-info">
                                    <p className="creation-name">{creation.title}</p>
                                    <p>{creation.description}</p>
                                </div>
                            </div>;
                        })}
                </div>
            </div>
        );
    }
}

export default Account;