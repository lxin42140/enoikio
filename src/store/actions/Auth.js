import * as actionTypes from "./actionTypes";
import axios from "axios";
import firebaseAxios from "../../firebaseAxios";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, userId, displayName) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId,
    displayName: displayName,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, Number(expirationTime) * 1000);
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("userID");
  localStorage.removeItem("displayName");
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

export const auth = (email, password, displayName, isSignUp) => {
  return (dispatch) => {
    dispatch(authStart());
    const userData = {
      displayName: displayName,
      email: email,
    };

    let authData = {
      email: email,
      password: password,
      displayName: displayName,
      returnSecureToken: true,
    };

    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA8gGPPoETtgZc0vygcR2-ya0BYHDzQEIc";

    if (!isSignUp) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA8gGPPoETtgZc0vygcR2-ya0BYHDzQEIc";

      authData = {
        email: email,
        password: password,
        returnSecureToken: true,
      };
    }

    axios
      .post(url, authData)
      .then((response) => {
        const expirationDate = new Date(
          new Date().getTime() + response.data.expiresIn * 1000
        );
        localStorage.setItem("token", response.data.idToken);
        localStorage.setItem("expirationDate", expirationDate);
        localStorage.setItem("userID", response.data.localId);
        localStorage.setItem("displayName", response.data.displayName);
        firebaseAxios
          .post('/users.json?uid="response.data.localId"', userData)
          .then((updatedUserNodeSuccess) => {
            dispatch(
              authSuccess(
                response.data.idToken,
                response.data.localId,
                response.data.displayName
              )
            );
            dispatch(checkAuthTimeout(response.data.expiresIn));
          })
          .catch((error) => dispatch(authFail(error)));
      })
      .catch((error) => {
        dispatch(authFail(error.response.data.error));
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate < new Date()) {
        dispatch(logout());
      } else {
        const userID = localStorage.getItem("userID");
        const displayName = localStorage.getItem("displayName");
        dispatch(authSuccess(token, userID, displayName));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
