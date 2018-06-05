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

export function post(post, imageFile) {
    if (imageFile.type && !imageFile.type.includes("image")) {
        return {error: "We currently only support posting text and images"};
    }
    if (imageFile.type) {
        return pushToStorage(imageFile).then((snapshot) => {
            let pid = fire
                .database()
                .ref('posts')
                .push({
                    post: post,
                    uid: "user1id",
                    imageLocation: snapshot.metadata.fullPath,
                    timestamp: Date.now()
                });
            fire
                .database()
                .ref('users')
                .child("user1id")
                .child("posts")
                .child(pid.key)
                .set(true);
            return {success: true};
        });
    } else {
        let pid = fire
            .database()
            .ref('posts')
            .push({
                post: post,
                uid: "user1id",
                timestamp: Date.now()
            });

        fire
            .database()
            .ref('users')
            .child("user1id")
            .child("posts")
            .child(pid.key)
            .set(true);
        return {success: true};

    }
}

export function getPosts() {
    return fire
        .database()
        .ref('posts')
        .orderByChild('uid')
        .equalTo('user2id')
        .once('value')
        .then((snapshot) => {
            let posts = [];
            snapshot.forEach((data) => {
                let post = {
                    post: data
                        .val()
                        .post,
                    pid: data.key,
                    timestamp: data
                        .val()
                        .timestamp
                };
                if (data.val().comments) {
                    let comments = [];
                    for (let comment in data.val().comments) {
                        if (data.val().comments.hasOwnProperty(comment)) {
                            comments.push(data.val().comments[comment]);
                        }
                    }
                    post.comments = comments;
                }
                if (data.val().imageLocation) {
                    post.image = data
                        .val()
                        .imageLocation;
                }

                posts.push(post);
            });
            return posts.reverse();
        });
}

export function loadComments(pid) {
    return fire
        .database()
        .ref('posts')
        .child(pid)
        .child('comments')
        .once('value')
        .then((snapshot) => {
            if (snapshot !== null) {
                let comments = [];
                for (let comment in snapshot.val()) {
                    if (snapshot.val().hasOwnProperty(comment)) {
                        let commentObj = {
                            content: snapshot.val()[comment],
                            cid: comment
                        };
                        comments.push(commentObj);
                    }
                }
                return getUsernames(comments);
            } else {
                return null;
            }
        });;
}

function getUsernames(comments) {
    let newComments = [];
    let promiseArray = [];

    for (let i = 0; i < comments.length; i++) {
        let newComment = {
            comment: comments[i].content.comment,
            cid: comments[i].cid
        };
        promiseArray.push(getUsername(comments[i].content.uid).then((username) => {
            newComment.commentedBy = username;
            newComments.push(newComment);
        }));
    }
    return Promise
        .all(promiseArray)
        .then(() => {
            return newComments.reverse();
        })
}

function getUsername(uid) {
    return fire
        .database()
        .ref('users')
        .child(uid)
        .child('name')
        .once('value')
        .then((snapshot) => {
            return snapshot.val();
        });
}

export function comment(pid, comment) {
    return fire
        .database()
        .ref('posts')
        .child(pid)
        .child('comments')
        .push()
        .set({
            comment: comment,
            uid: "user1id",
            timestamp: Date.now()
        });
}

export function saveLink(type, link) {
    let linkType = type
        .toLowerCase()
        .replace(' ', '');
    return fire
        .database()
        .ref('users')
        .child('user1id')
        .child(linkType)
        .set(link)
        .catch((error) => {
            return {error: "Invalid URL"};
        });
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
}

export function pushToStorage(selectorFiles) {
    return fire
        .storage()
        .ref()
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
        skills: []
    };

    let p = userRef.once('value');

    let promise = p.then((snapshot) => {
        let userInfo = snapshot.val();
        let newSkills = [];

        for (let key in userInfo.skills) {
            if (userInfo.skills.hasOwnProperty(key)) {
                newSkills.push(userInfo.skills[key]);
            }
        }

        let acceptedServices = [
            "applemusic",
            "facebook",
            "soundcloud",
            "spotify",
            "twitter",
            "website",
            "youtube"
        ];
        let links = [];
        for (let child in userInfo) {
            if (acceptedServices.includes(child)) {
                let linkObject = {
                    [child]: userInfo[child]
                };
                links.push(linkObject);
            }
        }

        account.name = userInfo.name;
        account.proPicUrl = userInfo.proPicUrl;
        account.skills = newSkills;
        account.links = links;

        return account;
    });
    return promise;
}

export function loadImage(imageLocation) {
    return fire
        .storage()
        .ref(imageLocation)
        .getDownloadURL()
        .then((url) => {
            return url;
        })
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

        // Comments
        let rtnComments = newCreation.comments;
        let comments = [];
        if (newCreation.comments) {
            for (let key in rtnComments) {
                if (rtnComments.hasOwnProperty(key)) {
                    let commentID = key;
                    let one_comment = {
                        id: commentID,
                        comment: rtnComments[key]
                    };
                    comments.push(one_comment);
                }
            }
            newCreation.comments = comments.reverse();
        }

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

export function updateCreationInfo(fbk, state) {
    fire
        .database()
        .ref('creations')
        .child(fbk)
        .update(state);
}

export function deleteCommentFromDatabase(post, comment) {
    fire
        .database()
        .ref('posts')
        .child(post.pid)
        .child('comments')
        .child(comment.cid)
        .remove();
}

export function deleteCreation(ck) {
    fire
        .database()
        .ref('creations')
        .child(ck)
        .remove();
    fire
        .database()
        .ref('users')
        .child('user1id')
        .child('creations')
        .child(ck)
        .remove();
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

export function setThumbnail(selectorFiles, fbk) {
    if (selectorFiles && selectorFiles.type.includes("image")) {
        const storageRef = fire
            .storage()
            .ref();

        // Delete old thumbnail from storage
        const oldThumbnail = fire
            .database()
            .ref()
            .child("creations")
            .child(fbk)
            .child('thumbnailUrl');

        oldThumbnail
            .once('value')
            .then((snapshot) => {
                if (!String(snapshot.val()).includes("default-thumbnail")) {
                    let thumbnailRef = fire
                        .storage()
                        .refFromURL(snapshot.val());
                    thumbnailRef
                        .delete()
                        .then(function () {
                            console.log("Deleted old thumbnail");
                        })
                        .catch(function (error) {
                            console.log("Error deleting old thumbnail");
                        });
                }
            });

        // Upload new storage and change database
        let rtn = pushToStorage(selectorFiles).then((newThumbnail) => {
            oldThumbnail.set("gs://creators-inc.appspot.com/" + newThumbnail.metadata.fullPath);
            return newThumbnail.downloadURL;
        });
        return rtn;
    }
}

// export default function ensureLoggedIn() {     return true; }