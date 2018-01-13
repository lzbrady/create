import firebase from 'firebase'

let config = {
    apiKey: "AIzaSyA7Z70a9UMx-LMWxLP9lHRYdRQyjTPvtMQ",
    authDomain: "creators-inc.firebaseapp.com",
    databaseURL: "https://creators-inc.firebaseio.com",
    projectId: "creators-inc",
    storageBucket: "creators-inc.appspot.com",
    messagingSenderId: "151070106489"
};

let fire = firebase.initializeApp(config);
export default fire;