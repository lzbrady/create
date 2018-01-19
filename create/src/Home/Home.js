import React, {Component} from "react";
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
      snapshot.forEach(function (child) {
        let creationToAdd = child.val();
        creationToAdd.key = child.key;
        newCreations.push(creationToAdd);
      });
      this.setState({creations: newCreations});
    });
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