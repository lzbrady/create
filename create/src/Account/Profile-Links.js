import React, {Component} from "react";

import Applemusic from '../images/logos/applemusic-logo.png';
import Facebook from '../images/logos/facebook-logo.png';
import Soundcloud from '../images/logos/soundcloud-logo.png';
import Spotify from '../images/logos/spotify-logo.png';
import Twitter from '../images/logos/twitter-logo.png';
import Website from '../images/logos/web-logo.png';
import Youtube from '../images/logos/youtube-logo.png';

import AddLink from './AddLink';

import {saveLink} from '../Backend/database';

class ProfileLinks extends Component {

    constructor() {
        super();

        this.state = {
            post: "",
            addingLink: false,
            linkType: "",
            link: "",
            error: ""
        }

        this.showLinkDialog = this
            .showLinkDialog
            .bind(this);

        this.confirm = this
            .confirm
            .bind(this);

        this.cancel = this
            .cancel
            .bind(this);

        this.updateLink = this
            .updateLink
            .bind(this);
    }

    showLinkDialog(linkType) {
        this
            .props
            .links
            .forEach((linkObj) => {
                let service = linkType
                    .toLowerCase()
                    .replace(' ', '');
                if (service in linkObj) {
                    this.setState({link: linkObj[service]});
                }
            });
        this.setState({linkType: linkType, addingLink: true});
    }

    cancel() {
        this.setState({addingLink: false, link: "", error: ""});
    }

    confirm() {
        saveLink(this.state.linkType, this.state.link).then((error) => {
            if (error) {
                console.log("Error", error.error);
                this.setState({error: error.error});
            } else {
                this.setState({addingLink: false, link: ""});
            }
        });
    }

    updateLink(event) {
        this.setState({link: event.target.value});
    }

    render() {
        return (
            <div id="profile-links-wrapper">
                <div className="profile-links-container">
                    <img
                        onClick={() => this.showLinkDialog('Apple Music')}
                        src={Applemusic}
                        alt="Apple Music"
                        className="profile-link"/>
                    <img
                        onClick={() => this.showLinkDialog('Facebook')}
                        src={Facebook}
                        alt="Facebook"
                        className="profile-link"/>
                    <img
                        onClick={() => this.showLinkDialog('SoundCloud')}
                        src={Soundcloud}
                        alt="SoundCloud"
                        className="profile-link"/>
                    <img
                        onClick={() => this.showLinkDialog('Spotify')}
                        src={Spotify}
                        alt="Spotify"
                        className="profile-link"/>
                    <img
                        onClick={() => this.showLinkDialog('Twitter')}
                        src={Twitter}
                        alt="Twitter"
                        className="profile-link"/>
                    <img
                        onClick={() => this.showLinkDialog('Website')}
                        src={Website}
                        alt="Website"
                        className="profile-link"/>
                    <img
                        onClick={() => this.showLinkDialog('YouTube')}
                        src={Youtube}
                        alt="YouTube"
                        className="profile-link"/>
                </div>

                {this.state.addingLink && <AddLink
                    title={this.state.linkType}
                    confirm={this.confirm}
                    cancel={this.cancel}
                    link={this.state.link}
                    updateLink={this.updateLink}
                    error={this.state.error}/>}
            </div>
        );
    }
}

export default ProfileLinks;