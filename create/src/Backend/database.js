import fire from '../fire'

export function getAllCreations() {
    let creationsRef = fire
        .database()
        .ref('creations');
    let p = creationsRef
        .limitToLast(20)
        .once('value');
    let newCreations = [];
    let promise = p.then((snapshot) => {
        snapshot
            .forEach(function (child) {
                let creationToAdd = child.val();
                creationToAdd.key = child.key;
                newCreations.push(creationToAdd);
            });
        return newCreations;
    });
    return promise;
}

export function uploadMediaToDatabase(state) {
    let newCreationRef = fire
        .database()
        .ref('creations')
        .push();

    newCreationRef.set(state);

    let userCreationsRef = fire
        .database()
        .ref('users')
        .child('user1id')
        .child('creations');

    userCreationsRef.update({
        [newCreationRef.key]: true
    });
    newCreationRef.update({owner: "user1id"});
}

export function pushToStorage(selectorFiles) {
    const storageRef = fire
        .storage()
        .ref();

    return storageRef
        .child(selectorFiles.name)
        .put(selectorFiles);
}

//TODO remove hard coded key
export function getUsername() {
    let userRef = fire
        .database()
        .ref('users')
        .child('user1id');
    let p = userRef.once('value');
    let promise = p.then((snapshot) => {
        let userInfo = snapshot.val();
        return userInfo.name;
    });
    return promise;
}

export function getCreationDetail(fbk) {
    let creationRef = fire
        .database()
        .ref('creations')
        .child(fbk);
    let p = creationRef.once('value');
    let rtn = {};
    let promise = p.then((snapshot) => {
        rtn = snapshot.val();

        // Comments
        let rtnComments = rtn.comments;
        let comments = [];
        if (rtn.comments) {
            for (let key in rtnComments) {
                if (rtnComments.hasOwnProperty(key)) {
                    comments.push(rtnComments[key]);
                }
            }
            rtn.comments = comments;
        }

        // Tags
        let rtnTags = rtn.tags;
        let tags = [];
        if (rtn.tags) {
            for (let key in rtnTags) {
                if (rtnTags.hasOwnProperty(key)) {
                    tags.push(key);
                }
            }
            rtn.tags = tags;
        }

        return rtn;
    });
    return promise;
}

export function loadMedia(storageUrl) {
    let mediaRef = fire
        .storage()
        .refFromURL(storageUrl);

    // Get the download URL
    let promise = mediaRef
        .getDownloadURL()
        .then(function (url) {
            return url;
        })
        .catch(function (error) {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            let e = "";
            switch (error.code) {
                case 'storage/object_not_found':
                    e = "Error: Unavailable, the owner may have removed the content";
                    break;
                case 'storage/unauthorized':
                    e = "Error: Unauthorized to view content";
                    break;
                case 'storage/canceled':
                    e = "Error: Please refresh";
                    break;
                default:
                    e = "Error: Content unavailable at this time";
                    break;
            }
            return e;
        });
    return promise;
}

// Unused
export function getAccountInfo() {
    //TODO: Don't hard code user1id
    let userRef = fire
        .database()
        .ref('users')
        .child('user1id');

    let account = {
        name: "",
        proPicUrl: "",
        skills: [],
        creations: []
    };

    let p = userRef.once('value');

    let promise = p.then((snapshot) => {
        let userInfo = snapshot.val();
        let newSkills = [];
        // let creationsRef = fire     .database()     .ref('creations'); let
        // newCreations = [];
        let creationIds = [];

        for (let skill in userInfo.skills) {
            newSkills.push(skill);
        }

        for (let creation in userInfo.creations) {
            creationIds.push(creation);
        }

        account.name = userInfo.name;
        account.proPicUrl = userInfo.proPicUrl;
        account.skills = newSkills;
        account.creations = creationIds;

        return account;
    });
    return promise;
}

// export default function ensureLoggedIn() {     return true; }