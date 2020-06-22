import * as actions from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  displayName: "",
  photoURL: "",
  email: "",
  dateJoined: "",
  lastSignIn: "",
  uid: "",
  user: null,
  error: null,
  loading: false,
  sentEmailVerification: false,
  passwordReset: false,
  updatingUserDetails: false,
  updatedUserDetails: false,
  authRedirectPath: "/",
};

const authStart = (state, action) => {
  return updateObject(state, {
    updatingUserDetails: false,
    updatedUserDetails: false,
    displayName: "",
    photoURL: "",
    email: "",
    uid: "",
    dateJoined: "",
    lastSignIn: "",
    user: null,
    error: null,
    sentEmailVerification: false,
    passwordReset: false,
    authRedirectPath: "/",
    loading: true,
  });
};

const sentEmailConfirmation = (state, action) => {
  return updateObject(state, { sentEmailVerification: true, loading: false });
};

const passwordReset = (state, action) => {
  return updateObject(state, { passwordReset: true, loading: false });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    updatingUserDetails: false,
    updatedUserDetails: false,
    loading: false,
    displayName: "",
    photoURL: "",
    email: "",
    dateJoined: "",
    lastSignIn: "",
    uid: "",
    user: null,
    sentEmailVerification: false,
    passwordReset: false,
    authRedirectPath: "/",
  });
};

const authSuccess = (state, action) => {
  let photoURL = "";
  if (action.photoURL) {
    photoURL = action.photoURL;
  }
  return updateObject(state, {
    updatingUserDetails: false,
    updatedUserDetails: false,
    error: null,
    loading: false,
    user: action.user,
    displayName: action.displayName,
    photoURL: photoURL,
    email: action.email,
    uid: action.uid,
    dateJoined: action.dateJoined,
    lastSignIn: action.lastSignIn,
    sentEmailVerification: false,
    passwordReset: false,
  });
};

const authLogout = (state, action) => {
  return updateObject(state, {
    updatingUserDetails: false,
    updatedUserDetails: false,
    displayName: "",
    photoURL: "",
    email: "",
    uid: "",
    dateJoined: "",
    lastSignIn: "",
    user: null,
    error: null,
    loading: false,
    sentEmailVerification: false,
    passwordReset: false,
    authRedirectPath: "/",
  });
};

const updateUserDetailsInit = (state, action) => {
  return updateObject(state, {
    updatingUserDetails: true,
    updatedUserDetails: false,
  });
};

const updatePhotosDetails = (state, action) => {
  return updateObject(state, {
    photoURL: action.photoURL,
    updatingUserDetails: false,
    updatedUserDetails: true,
  });
};

const resetUserUpdate = (state, action) => {
  return updateObject(state, {
    updatingUserDetails: false,
    updatedUserDetails: false,
  });
};

const setAuthRedirectPath = (state, action) => {
  return updateObject(state, { authRedirectPath: action.path });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.AUTH_START:
      return authStart(state, action);
    case actions.AUTH_FAIL:
      return authFail(state, action);
    case actions.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actions.AUTH_LOGOUT:
      return authLogout(state, action);
    case actions.SET_AUTH_REDIRECT:
      return setAuthRedirectPath(state, action);
    case actions.SENT_EMAIL_CONFIRMATION:
      return sentEmailConfirmation(state, action);
    case actions.PASSWORD_RESET:
      return passwordReset(state, action);
    case actions.UPDATE_USER_DETAILS_INIT:
      return updateUserDetailsInit(state, action);
    case actions.UPDATE_USER_DETAILS_IMAGE:
      return updatePhotosDetails(state, action);
    case actions.RESET_USER_UPDATE:
      return resetUserUpdate(state, action);
    default:
      return state;
  }
};

export default reducer;
