import React, {
    Component
} from "react";

import Applemusic from '../images/logos/applemusic-logo.png';
import Facebook from '../images/logos/facebook-logo.png';
import Soundcloud from '../images/logos/soundcloud-logo.png';
import Spotify from '../images/logos/spotify-logo.png';
import Twitter from '../images/logos/twitter-logo.png';
import Website from '../images/logos/web-logo.png';
import Youtube from '../images/logos/youtube-logo.png';

import AddLink from './AddLink';

import { saveLink, getLinks } from '../Backend/database';
import ReactTooltip from 'react-tooltip';

class ProfileLinks extends Component {

    constructor() {
        super();

        this.state = {
            post: "",
            addingLink: false,
            linkType: "",
            link: "",
            error: "",
            applemusic: "wawawa",
            facebook: "",
            soundcloud: "",
            spotify: "",
            twitter: "",
            website: "",
            youtube: ""
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

    componentDidMount() {
        getLinks().then((links) => {
            for (let i in links) {
                this.setState({ [i]: links[i] });
            }
        });
    }

    showLinkDialog(linkType) {
        let service = linkType.toLowerCase().replace(' ', '');
        if (this.state[service] !== "") {
            this.setState({ link: this.state[service] });
        }
        this.setState({
            linkType: linkType,
            addingLink: true
        });
    }

    cancel() {
        this.setState({
            addingLink: false,
            link: "",
            error: ""
        });
    }

    confirm() {
        saveLink(this.state.linkType, this.state.link).then((error) => {
            if (error) {
                this.setState({
                    error: error.error
                });
            } else {
                let newLinkType = this.state.linkType
                    .toLowerCase()
                    .replace(' ', '');
                this.setState({
                    addingLink: false,
                    link: "",
                    [newLinkType]: this.state.link
                });
            }
        });
    }

    updateLink(event) {
        this.setState({
            link: event.target.value
        });
    }

    render() {
        return (<div id="profile-links-wrapper" >
            <div className="profile-links-container" >
                <img onClick={() => this.showLinkDialog('Apple Music')}
                    src={Applemusic}
                    alt="Apple Music"
                    className={this.state.applemusic === "" ? "inactive-profile-link profile-link" : "profile-link"} />
                <img onClick={() => this.showLinkDialog('Facebook')}
                    src={Facebook}
                    alt="Facebook"
                    className={this.state.facebook === "" ? "inactive-profile-link profile-link" : "profile-link"} />
                <img onClick={() => this.showLinkDialog('SoundCloud')}
                    src={Soundcloud}
                    alt="SoundCloud"
                    className={this.state.soundcloud === "" ? "inactive-profile-link profile-link" : "profile-link"} />
                <img onClick={() => this.showLinkDialog('Spotify')}
                    src={Spotify}
                    alt="Spotify"
                    className={this.state.spotify === "" ? "inactive-profile-link profile-link" : "profile-link"} />
                <img onClick={() => this.showLinkDialog('Twitter')}
                    src={Twitter}
                    alt="Twitter"
                    className={this.state.twitter === "" ? "inactive-profile-link profile-link" : "profile-link"} />
                <img onClick={() => this.showLinkDialog('Website')}
                    src={Website
                    } alt="Website"
                    className={this.state.website === "" ? "inactive-profile-link profile-link" : "profile-link"} />
                <img onClick={() => this.showLinkDialog('YouTube')}
                    src={Youtube}
                    alt="YouTube"
                    className={this.state.youtube === "" ? "inactive-profile-link profile-link" : "profile-link"} />
            </div>

            {this.state.addingLink && < AddLink
                title={this.state.linkType}
                confirm={this.confirm}
                cancel={this.cancel}
                link={this.state.link}
                updateLink={this.updateLink}
                error={this.state.error}
            />}
        </div>
        );
    }
}

export default ProfileLinks;