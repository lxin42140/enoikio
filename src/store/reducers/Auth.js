import * as actions from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  authRedirectPath: "/"
};

const authStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const authFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false,
    token: action.idToken,
    userId: action.userId,
  });
};

const authLogout = (state, action) => {
  return updateObject(state, { token: null, userId: null });
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
    case action.SET_AUTH_REDIRECT:
      return setAuthRedirectPath(state, action);
    default:
      return state;
  }
};

export default reducer;
