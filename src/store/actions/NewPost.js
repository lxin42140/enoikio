import * as actionTypes from "./actionTypes";
import axios from "../../firebaseAxios";

export const submitNewPostInit = () => {
  return {
    type: actionTypes.SUBMIT_NEW_LISTING_INIT,
  };
};

export const submitNewPostSuccess = () => {
  return {
    type: actionTypes.SUBMIT_NEW_LISTING_SUCCESS,
  };
};

export const submitNewPostFail = (error) => {
  return {
    type: actionTypes.SUBMIT_NEW_LISTING_FAIL,
    error: error,
  };
};

export const submitNewPost = (data) => {
  return (dispatch) => {
    dispatch(submitNewPostInit());
    axios
      .post("/listings.json", data)
      .then((response) => dispatch(submitNewPostSuccess()))
      .catch((error) => submitNewPostFail(error));
  };
};
