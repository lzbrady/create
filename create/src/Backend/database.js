import fire from '../fire';

const defaultProfilePictureUrl = "https://firebasestorage.googleapis.com/v0/b/creators-inc.appspot.com/o/default-p" +
        "rofile-picture.png?alt=media&token=60c3fc4c-5ab9-4b8c-b168-4dfc3b233a56";

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
    //TODO: Remove hard coded username
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
    // purgeFromPendingList("user1id");
}

// function purgeFromPendingList(username) {     fire         .database()
// .ref('pending')         .child(username + "0")         .remove();     fire
// .database()         .ref('pending')         .child(username + "1") .remove();
// }

export function pushToStorage(selectorFiles) {
    const storageRef = fire
        .storage()
        .ref();

    return storageRef
        .child("user1id")
        .child(guid())
        .put(selectorFiles);
}

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

// export function addToPendingList(storageUrl, int) {     //TODO: remove
// hardcoded username     let ref = fire         .database() .ref('pending');
// ref         .child("user1id" + int) .once('value', function (snapshot) { let
// exists = (snapshot.val() !== null);             if (exists) {    let
// storageRef = fire                  .storage()     .ref() .child("user1id")
// .child(snapshot.val()); // Delete the file storageRef .delete()
// .then(function () { console.log("Deleted") }) .catch(function (error) {
// console.log("Error", error); });      }         }); ref .child("user1id" +
// int)         .set(storageUrl); }

export function pushCommentToCreation(comment, fbk) {
    let adder = Math.floor(Math.random() * 100000) + 100000;
    let commentKey = "user1id" + adder;
    fire
        .database()
        .ref('creations')
        .child(fbk)
        .child("comments")
        .update({[commentKey]: comment});
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
                    let commentID = key.substr(0, key.length - 6);
                    let one_comment = {
                        id: commentID,
                        comment: rtnComments[key]
                    };
                    comments.push(one_comment);
                }
            }
            rtn.comments = comments.reverse();
        }

        // Tags
        let rtnTags = rtn.tags;
        let tags = [];
        if (rtn.tags) {
            for (let key in rtnTags) {
                if (rtnTags.hasOwnProperty(key)) {
                    tags.push(rtnTags[key]);
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
        creationIds: []
    };

    let p = userRef.once('value');

    let promise = p.then((snapshot) => {
        let userInfo = snapshot.val();
        let newSkills = [];
        let creationIds = [];

        for (let key in userInfo.skills) {
            if (userInfo.skills.hasOwnProperty(key)) {
                newSkills.push(userInfo.skills[key]);
            }
        }

        for (let creation in userInfo.creations) {
            creationIds.push(creation);
        }

        account.name = userInfo.name;
        account.proPicUrl = userInfo.proPicUrl;
        account.skills = newSkills;
        account.creationIds = creationIds;

        return account;
    });
    return promise;
}

export function getAccountCreation(creationId) {
    let creationsRef = fire
        .database()
        .ref('creations');

    let p = creationsRef
        .child(creationId)
        .once('value');

    let promise = p.then((snapshot) => {
        let newCreation = snapshot.val();
        newCreation.key = snapshot.key;
        return newCreation;
    });
    return promise;
}

export function updateAccountInfo(state) {
    fire
        .database()
        .ref('users')
        .child('user1id')
        .update(state);
}

export function setProfilePicture(selectorFiles) {
    if (selectorFiles && selectorFiles.type.includes("image")) {
        const storageRef = fire
            .storage()
            .ref();

        let mediaRef = storageRef
            .child("user1id")
            .child('profilePicture');
        mediaRef.put(selectorFiles);

        // Get the download URL
        let promise = mediaRef
            .getDownloadURL()
            .then(function (url) {
                updateAccountInfo({proPicUrl: url});
                return url;
            })
            .catch(function (error) {
                console.log(error);
                return defaultProfilePictureUrl;
            });
        return promise;
    } else {
        return defaultProfilePictureUrl;
    }
}

// export default function ensureLoggedIn() {     return true; }