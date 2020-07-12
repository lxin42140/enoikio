import moment from "moment";
import firebase, { auth, database } from "../../firebase/firebase";
import * as actionTypes from "./actionTypes";
import profileImage from "../../assets/Images/chats/profile";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (user) => {
  const userDateTime = formatDateTime(
    user.metadata.creationTime,
    user.metadata.lastSignInTime
  );

  return {
    type: actionTypes.AUTH_SUCCESS,
    user: user,
    displayName: user.displayName,
    photoURL: user.photoURL,
    uid: user.uid,
    email: user.email,
    dateJoined: userDateTime[0],
    lastSignIn: userDateTime[1],
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT,
    path: path,
  };
};

export const sentEmailConfirmation = () => {
  return {
    type: actionTypes.SENT_EMAIL_CONFIRMATION,
  };
};

export const passwordResetSuccess = () => {
  return {
    type: actionTypes.PASSWORD_RESET,
  };
};

export const updateUserDetailsInit = () => {
  return {
    type: actionTypes.UPDATE_USER_DETAILS_INIT,
  };
};

export const updatePhotosDetails = (photoURL) => {
  return {
    type: actionTypes.UPDATE_USER_DETAILS_IMAGE,
    photoURL: photoURL,
  };
};

export const resetUserUpdate = () => {
  return {
    type: actionTypes.RESET_USER_UPDATE,
  };
};

async function updateImageInUserComments(displayName, photoURL) {
  await database
    .ref()
    .child("users")
    .once("value", (snapShot) => {
      snapShot.forEach((data) => {
        const comments = Object.assign([], data.val().comments);
        for (let index in comments) {
          if (comments[index].sender === displayName) {
            comments[index].profilePicture = photoURL;
          }
        }

        database.ref().child("users").child(data.key).update({
          comments: comments,
        });
      });
    });
}

async function updateImageInListing(displayName, photoURL) {
  await database
    .ref()
    .child("listings")
    .once("value", (snapShot) => {
      snapShot.forEach((data) => {
        const comments = Object.assign([], data.val().comments);
        for (let index in comments) {
          if (comments[index].sender === displayName) {
            comments[index].profilePicture = photoURL;
          }
        }

        const replies = Object.assign([], data.val().replies);
        for (let index in replies) {
          if (replies[index].sender === displayName) {
            replies[index].profilePicture = photoURL;
          }
        }

        database.ref().child("listings").child(data.key).update({
          comments: comments,
          replies: replies,
        });
      });
    });
}

export const updateUserDetails = (user, photoURL) => {
  return (dispatch) => {
    updateImageInListing(user.displayName, photoURL);
    updateImageInUserComments(user.displayName, photoURL);
    database
      .ref()
      .child("users")
      .orderByChild("displayName")
      .equalTo(user.displayName)
      .once("child_added", (snapShot) => {
        database.ref().child("users").child(snapShot.key).update({
          photoURL: photoURL,
        });
      });

    database
      .ref()
      .child("listings")
      .orderByChild("displayName")
      .equalTo(user.displayName)
      .on("child_added", (snapShot) => {
        database.ref().child("listings").child(snapShot.key).update({
          photoURL: photoURL,
        });
      });

    user
      .updateProfile({
        photoURL: photoURL,
      })
      .then((res) => {
        dispatch(updatePhotosDetails(photoURL));
      })
      .catch((error) => {
        let message = error.message.split("-").join(" ");
        message = "Oops, something went wrong. Please try again later!";
        dispatch(authFail(message));
      });
  };
};

export const signOut = () => {
  return (dispatch) => {
    auth.signOut().then((res) => dispatch(logout()));
  };
};

export const autoSignIn = () => {
  return (dispatch) => {
    auth.onAuthStateChanged((user) => {
      // if (user && user.emailVerified) {
      //   dispatch(authSuccess(user));
      // }
      if (user) {
        dispatch(authSuccess(user));
      }
    });
  };
};

export const passwordReset = (email) => {
  return (dispatch) => {
    dispatch(authStart());
    auth
      .sendPasswordResetEmail(email)
      .then((res) => {
        dispatch(passwordResetSuccess());
      })
      .catch((error) => {
        const message = error.message.split("-").join(" ");
        dispatch(authFail(message));
      });
  };
};

const formatDateTime = (dateCreated, dateSignedIn) => {
  let formatted_dateCreated = null;
  let formatted_dateSigned = null;

  if (dateCreated) {
    const creationArr = dateCreated.split(",")[1].split(" ");
    creationArr.shift();
    formatted_dateCreated =
      creationArr[0] + " " + creationArr[1] + " " + creationArr[2];
  }

  if (dateSignedIn) {
    const lastSignArr = dateSignedIn.split(",")[1].split(" ");
    lastSignArr.shift();
    formatted_dateSigned =
      lastSignArr[0] +
      " " +
      lastSignArr[1] +
      " " +
      lastSignArr[2] +
      " @ " +
      moment(lastSignArr[3].split(":"), "HH:mm:ss")
        .add(8, "hours")
        .format("HH:mm");
  }

  return [formatted_dateCreated, formatted_dateSigned];
};

async function updateUserProfile(user) {
  database
    .ref()
    .child("users")
    .orderByChild("displayName")
    .equalTo(user.displayName)
    .once("value", (snapShot) => {
      if (snapShot.exists()) {
        const userDateTime = formatDateTime(null, user.metadata.lastSignInTime);
        database
          .ref()
          .child("users")
          .orderByChild("displayName")
          .equalTo(user.displayName)
          .once("child_added", (snapShot) => {
            let photoURL = user.photoURL;
            if (!photoURL || photoURL === "") {
              photoURL = profileImage;
            }
            database.ref().child("users").child(snapShot.key).update({
              photoURL: photoURL,
              lastSignIn: userDateTime[1],
            });
          });
      } else {
        const userDateTime = formatDateTime(
          user.metadata.creationTime,
          user.metadata.lastSignInTime
        );

        let photoURL = user.photoURL;
        if (!photoURL || photoURL === "") {
          photoURL = profileImage;
        }

        const profileDetails = {
          formattedDisplayName: user.displayName
            .toLowerCase()
            .split(" ")
            .join(""),
          displayName: user.displayName,
          photoURL: photoURL,
          dateJoined: userDateTime[0],
          lastSignIn: userDateTime[1],
        };

        database.ref().child("users").push(profileDetails);
      }
    });
}
export const signIn = (email, password) => {
  return (dispatch) => {
    dispatch(authStart());
    auth
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then((res) => {
        return auth.signInWithEmailAndPassword(email, password).then((user) => {
          // if (user.user.emailVerified) {
          dispatch(authSuccess(user.user));
          updateUserProfile(user.user);
          // } else {
          //   dispatch(authFail("Please verify email"));
          // }
        });
      })
      .catch((error) => {
        let message = error.message.split("-").join(" ");
        message = "Oops, something went wrong. Please try again later!";
        dispatch(authFail(message));
      });
  };
};

export const signUp = (email, password, displayName) => {
  return (dispatch) => {
    dispatch(authStart());
    updateDisplayNames(displayName).then((error) => {
      if (error) {
        dispatch(authFail(error));
      } else {
        auth
          .createUserWithEmailAndPassword(email, password)
          .then((user) => {
            user.user.updateProfile({
              displayName: displayName,
            });
            const actionCodeSettings = {
              url: "https://enoikio-orbit2020.web.app/auth",
            };
            return user.user
              .sendEmailVerification(actionCodeSettings)
              .then((res) => {
                dispatch(sentEmailConfirmation());
              });
          })
          .catch((error) => {
            const message = error.message.split("-").join(" ");
            database
              .ref()
              .child("displayNames")
              .once("value", (snapShot) => {
                snapShot.forEach((data) => {
                  const displayNames = Object.assign(
                    [],
                    data.val().displayNames
                  );
                  displayNames.pop();
                  database
                    .ref()
                    .child("displayNames")
                    .child(data.key)
                    .update({ displayNames: displayNames })
                    .then((res) => dispatch(authFail(message)));
                });
              });
          });
      }
    });
  };
};

async function updateDisplayNames(displayName) {
  let error = null;
  displayName = displayName.toLowerCase().split(" ").join("");
  await database
    .ref()
    .child("displayNames")
    .once("value", (snapShot) => {
      if (snapShot.exists()) {
        snapShot.forEach((data) => {
          const displayNames = Object.assign([], data.val().displayNames);
          displayNames.push(displayName);
          database
            .ref()
            .child("displayNames")
            .child(data.key)
            .update({ displayNames: displayNames });
        });
      } else {
        const nodeKey = database.ref().child("displayNames").push().key;
        const displayNames = [displayName];
        database
          .ref()
          .child("displayNames")
          .child(nodeKey)
          .set({ displayNames: displayNames });
      }
    })
    .catch((error) => (error = error.message.split("-").join(" ")));
  return error;
}
