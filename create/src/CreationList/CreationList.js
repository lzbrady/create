import React, {Component} from "react";
import {Link} from "react-router-dom";

import {getAllCreations} from '../Backend/database'
import MdMusicVideo from 'react-icons/lib/md/music-video';
import './creation-list.css'

class CreationList extends Component {
  constructor() {
    super();

    this.state = {
      creations: []
    };
  }

  componentWillMount() {
    getAllCreations().then((arr) => {
      this.setState({
        creations: arr
      })
    });
  }

  handleClick(element) {
    console.log(element);
  }

  render() {
    return (
      <div id="creations-div">
        <p className="account-heading" id="content-heading">Creations:</p>
        {this
          .state
          .creations
          .map((creation) => {
            return <div className="creation" key={creation.key}>
              <Link to={`/view/${creation.key}`}>
                <div className="creation-icon">
                  <MdMusicVideo size={125}/>
                </div>
                <div className="creation-info">
                  <p className="creation-title">{creation.title}</p>
                  <p>{creation.description}</p>
                </div>
              </Link>
            </div>;
          })}
      </div>
    );
  }
}

export default CreationList;