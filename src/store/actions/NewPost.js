import * as actionTypes from "./actionTypes";
import axios from "../../firebaseAxios";
import { storage } from "../../firebase/firebase";

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

export const submitNewPost = (data, token) => {
  return (dispatch) => {
    dispatch(submitNewPostInit());
    axios
      .post("/listings.json?auth=" + token, data)
      .then((response) => dispatch(submitNewPostSuccess()))
      .catch((error) => submitNewPostFail(error));
  };
};

export const submitNewPhotoInit = () => {
  return {
    type: actionTypes.SUBMIT_NEW_PHOTO_INIT,
  };
};

export const submitNewPhotoFail = (error) => {
  return {
    type: actionTypes.SUBMIT_NEW_PHOTO_FAIL,
  };
};

export const submitNewPhotoSuccess = () => {
  return {
    type: actionTypes.SUBMIT_NEW_PHOTO_SUCCESS,
  };
};

export const submitNewPhoto = (imageAsFile, identifier) => {
  return (dispatch) => {
    if (imageAsFile === "") {
      dispatch(
        submitNewPhotoFail(
          `not an image, the image file is a ${typeof imageAsFile}`
        )
      );
    } else {
      dispatch(submitNewPhotoInit());
      storage
        .ref(`/listingPictures/${identifier}`)
        .put(imageAsFile)
        .then(
          () => {
            dispatch(submitNewPhotoSuccess());
          },
          (error) => {
            dispatch(submitNewPhotoFail(error));
          }
        );
    }
  };
};
