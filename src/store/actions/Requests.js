import * as actionTypes from "./actionTypes";
import { database } from "../../firebase/firebase";

export const fetchRequestInit = () => {
  return {
    type: actionTypes.FETCH_REQUEST_INIT,
  };
};

export const fetchRequestSuccess = (data) => {
  return {
    type: actionTypes.FETCH_REQUEST_SUCCESS,
    data: data,
  };
};

export const fetchRequestFail = (error) => {
  return {
    type: actionTypes.FETCH_REQUEST_FAIL,
    error: error,
  };
};

export const removedRequest = (key) => {
  return {
    type: actionTypes.REMOVED_REQUEST,
    key: key,
  };
};

export const submitNewRequestInit = () => {
  return {
    type: actionTypes.SUBMIT_NEW_REQUEST_INIT,
  };
};

export const submitNewRequestSuccess = () => {
  return {
    type: actionTypes.SUBMIT_NEW_REQUEST_SUCCESS,
  };
};

export const submitNewRequestFail = (error) => {
  return {
    type: actionTypes.SUBMIT_NEW_REQUEST_FAIL,
    error: error,
  };
};

export const clearRequestData = () => {
  return {
    type: actionTypes.CLEAR_REQUEST_DATA,
  };
};

export const setResolveRequest = (request) => {
  return {
    type: actionTypes.SET_RESOLVE_REQUEST,
    request: request,
  };
};

export const fetchAllRequests = () => {
  return (dispatch, getState) => {
    dispatch(fetchRequestInit());

    database
      .ref()
      .child("requests")
      .on("child_removed", (snapShot) => {
        dispatch(removedRequest(snapShot.key));
      });

    database
      .ref()
      .child("requests")
      .on("child_added", (snapShot) => {
        let result = Object.assign([], getState().request.requests);
        const key = snapShot.key;
        const request = {
          key: key,
          unique: snapShot.val().unique,
          displayName: snapShot.val().displayName,
          date: snapShot.val().date,
          time: snapShot.val().time,
          requestDetails: snapShot.val().requestDetails,
        };

        result.push(request);
        result.reverse();
        dispatch(fetchRequestSuccess(result));
      });
  };
};

export const submitNewRequest = (data) => {
  return (dispatch) => {
    dispatch(submitNewRequestInit());
    database
      .ref()
      .child("requests")
      .push(data)
      .then((res) => dispatch(submitNewRequestSuccess()))
      .catch((error) => {
        const message = error.message.split("-").join(" ");
        dispatch(submitNewRequestFail(message));
      });
  };
};

export const resolveRequest = (request) => {
  return (dispatch) => {
    request = {
      key: request.key,
      module: request.requestDetails.module,
      textbook: request.requestDetails.textbook,
      displayName: request.displayName,
    };
    dispatch(setResolveRequest(request));
  };
};
