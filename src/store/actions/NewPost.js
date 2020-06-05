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

export const clearPostData = () => {
  return {
    type: actionTypes.CLEAR_NEW_POST_DATA
  }
}

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

//Getting a warning here. "Don't make functions within a loop"
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
      let imageError = false;
      for (let key in imageAsFile) {
        storage
          .ref(`/listingPictures/${identifier}/${key}`)
          .put(imageAsFile[key])  
          .then(
            (error) => {
              imageError = true;
              dispatch(submitNewPhotoFail(error));
            }
          );
      }
      if (!imageError) {
        dispatch(submitNewPhotoSuccess());
      }
    }
  };
};