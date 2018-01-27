import React, {Component} from "react";
import {Route, NavLink, HashRouter} from "react-router-dom";

import Detail from "../Detail/Detail";

import fire from '../fire';
import MdMusicVideo from 'react-icons/lib/md/music-video';
import './home.css'

class Home extends Component {
  constructor() {
    super();

    this.state = {
      creations: []
    };
  }

  componentWillMount() {
    let creationsRef = fire
      .database()
      .ref('creations');
    let newCreations = [];
    creationsRef.on('value', (snapshot) => {
      snapshot
        .forEach(function (child) {
          let creationToAdd = child.val();
          creationToAdd.key = child.key;
          newCreations.push(creationToAdd);
        });
      this.setState({creations: newCreations});
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
            return <div className="creation" onClick={() => {<Detail />}} key={creation.key}>
              <div className="creation-icon">
                <MdMusicVideo size={125}/>
              </div>
              <div className="creation-info">
                <p className="creation-title">{creation.title}</p>
                <p>{creation.description}</p>
              </div>
            </div>;
          })}
      </div>
    );
  }
}

export default Home;