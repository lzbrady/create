import React, {Component} from 'react';
import defaultProfilePicture from '../images/default-profile-picture.png';
import './account.css';
import MdMusicVideo from 'react-icons/lib/md/music-video';
import fire from '../fire'

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            proPicUrl: defaultProfilePicture,
            skills: [],
            creations: []
        };
    }

    // Only method that uses Firebase. Kept in front end for real time updates, but has unused method in backend.
    componentWillMount() {
        let userRef = fire
            .database()
            .ref('users')
            .child('user1id');
        let creationIds = [];
        userRef.on('value', (snapshot) => {
            let userInfo = snapshot.val();
            let newSkills = [];
            for (let skill in userInfo.skills) {
                newSkills.push(skill);
            }

            for (let creation in userInfo.creations) {
                creationIds.push(creation);
            }
            this.setState({name: userInfo.name, proPicUrl: userInfo.proPicUrl, skills: newSkills});

            let creationsRef = fire
                .database()
                .ref('creations');

            let newCreations = [];
            creationIds.map(id => {
                return creationsRef
                    .child(id)
                    .on('value', (snapshot) => {
                        let newCreation = snapshot.val();
                        newCreation.key = snapshot.key;
                        newCreations.push(newCreation);
                        this.setState({creations: newCreations})
                        return snapshot;
                    })
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
                                    <p className="creation-name">{creation.name}</p>
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