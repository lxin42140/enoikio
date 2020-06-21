import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  requests: [],
  error: null,
  loadingRequest: false,
  uploadingRequest: false,
  requestUploaded: false,
  resolve: null,
};

const fetchRequestSuccess = (state, request) => {
  return updateObject(state, { requests: request, loadingRequest: false });
};

const fetchRequestFail = (state, error) => {
  return updateObject(state, { error: error, loadingRequest: false });
};

const fetchAllRequestInit = (state, action) => {
  return updateObject(state, { loadingRequest: true });
};

const submitNewRequestInit = (state, action) => {
  return updateObject(state, {
    uploadingRequest: true,
  });
};

const submitNewRequestSuccess = (state, action) => {
  return updateObject(state, {
    uploadingRequest: false,
    requestUploaded: true,
  });
};

const submitNewRequestFail = (state, error) => {
  return updateObject(state, {
    error: error,
    uploadingRequest: false,
  });
};

const clearRequestData = (state, action) => {
  return updateObject(state, {
    uploadingRequest: false,
    requestUploaded: false,
  })
}

const removedRequest = (state, key) => {
  const updatedRequests = Object.assign([], state.requests).filter(
    (request) => request.key !== key
  );
  return updateObject(state, {
    requests: updatedRequests,
  });
};

const setResolveRequest = (state, request) => {
  return updateObject(state, { resolve: request })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_REQUEST_INIT:
      return fetchAllRequestInit(state, action);
    case actionTypes.FETCH_REQUEST_SUCCESS:
      return fetchRequestSuccess(state, action.data);
    case actionTypes.FETCH_REQUEST_FAIL:
      return fetchRequestFail(state, action.error);
    
    case actionTypes.SUBMIT_NEW_REQUEST_INIT:
      return submitNewRequestInit(state, action);
    case actionTypes.SUBMIT_NEW_REQUEST_SUCCESS:
      return submitNewRequestSuccess(state, action);
    case actionTypes.SUBMIT_NEW_REQUEST_FAIL:
      return submitNewRequestFail(state, action.error);

    case actionTypes.SET_RESOLVE_REQUEST:
      return setResolveRequest(state, action.request);

    case actionTypes.CLEAR_REQUEST_DATA:
      return clearRequestData(state, action);

    // case actionTypes.UPDATE_REQUEST:
    //   return updateRequest(state, action.updatedRequest);
    case actionTypes.REMOVED_REQUEST:
      return removedRequest(state, action.key);


    default:
      return state;
  }
};

export default reducer;
