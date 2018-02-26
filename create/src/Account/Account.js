import React, {Component} from 'react';
import defaultProfilePicture from '../images/default-profile-picture.png';
import './account.css';
import MdMusicVideo from 'react-icons/lib/md/music-video';
import fire from '../fire'

import {getAccountInfo, getAccountCreation} from '../Backend/database';

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            proPicUrl: defaultProfilePicture,
            skills: [],
            creations: []
        };

        this.newSkill = this
            .newSkill
            .bind(this);
    }

    //TODO: fix
    newSkill(event) {
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

    componentWillMount() {
        getAccountInfo().then((snapshot) => {
            this.setState({name: snapshot.name, proPicUrl: snapshot.proPicUrl, skills: snapshot.skills});
            let accountCreations = [];
            snapshot
                .creationIds
                .map(id => {
                    getAccountCreation(id).then((creation) => {
                        let oldCreations = this.state.creations;
                        oldCreations.push(creation);
                        this.setState({creations: oldCreations});
                    });
                });
        });
    }

    render() {
        return (
            <div id="wrapper">
                <div id="profile-info-div" className="info-div">
                    <img
                        className="profile-info"
                        id="profile-picture"
                        src={this.state.proPicUrl}
                        alt="Profile Pic"/>
                    <p className="profile-info" id="profile-name">{this.state.name}</p>

                    <p className="profile-info account-heading" id="profile-skills-heading">Creates:</p>
                    <ul className="profile-info" id="skill-list">
                        {this
                            .state
                            .skills
                            .map((skill) => {
                                return <li className="skill" key={skill}>{skill}</li>;
                            })}
                    </ul>
                    <input
                        type="text"
                        className="skill-input"
                        placeholder="Add Skill!"
                        onKeyPress={this.newSkill}/>
                </div>

                <div id="content-info-div" className="info-div">
                    <p className="account-heading" id="content-heading">Creations:</p>
                    {this
                        .state
                        .creations
                        .map((creation) => {
                            return <div className="creation" key={creation.key}>
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