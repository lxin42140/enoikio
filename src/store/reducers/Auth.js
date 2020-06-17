import * as actions from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  displayName: "",
  photoURL: "",
  email: "",
  uid: "",
  user: null,
  error: null,
  loading: false,
  sentEmailVerification: false,
  passwordReset: false,
  authRedirectPath: "/",
};

const authStart = (state, action) => {
  return updateObject(state, {
    displayName: "",
    photoURL: "",
    email: "",
    uid: "",
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
    loading: false,
    displayName: "",
    photoURL: "",
    email: "",
    uid: "",
    user: null,
    sentEmailVerification: false,
    passwordReset: false,
    authRedirectPath: "/",
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false,
    user: action.user,
    displayName: action.displayName,
    photoURL: action.photoURL,
    email: action.email,
    uid: action.uid,
    sentEmailVerification: false,
    passwordReset: false,
  });
};

const authLogout = (state, action) => {
  return updateObject(state, {
    displayName: "",
    photoURL: "",
    email: "",
    uid: "",
    user: null,
    error: null,
    loading: false,
    sentEmailVerification: false,
    passwordReset: false,
    authRedirectPath: "/",
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
    default:
      return state;
  }
};

export default reducer;
