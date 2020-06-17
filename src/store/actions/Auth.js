import * as actionTypes from "./actionTypes";
import firebase, { database, auth } from "../../firebase/firebase";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (user) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    user: user,
    displayName: user.displayName,
    photoURL: user.photoURL,
    email: user.email,
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

export const signIn = (email, password) => {
  return (dispatch) => {
    dispatch(authStart());
    auth
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then((res) => {
        return auth.signInWithEmailAndPassword(email, password).then((user) => {
          if (user.user.emailVerified) {
            dispatch(authSuccess(user.user));
          } else {
            dispatch(authFail("Please verify email"));
          }
        });
      })
      .catch((error) => {
        const message = error.message.split("-").join(" ");
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
              url: "http://localhost:3000/auth",
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
    .catch((error) => (error = error.message));
  return error;
}
