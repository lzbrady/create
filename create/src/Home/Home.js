import React, {Component} from "react";
import fire from '../fire';
import MdMusicVideo from 'react-icons/lib/md/music-video';


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
      let creations = snapshot.val();
      snapshot.forEach(function (child) {
        console.log(child.val());
        let creationToAdd = child.val();
        creationToAdd.key = child.key;
        newCreations.push(creationToAdd);
      });
      this.setState({creations: newCreations});
    });
  }

  render() {
    return (
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
    );
  }
}

export default Home;