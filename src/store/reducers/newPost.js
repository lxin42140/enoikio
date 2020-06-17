import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  uploadingPost: false,
  postUploaded: false,
  uploadingImage: false,
  imageUploaded: false,
  error: null,
};

const submitNewPhotoInit = (state, action) => {
  return updateObject(state, {
    uploadingImage: true,
  });
};

const submitNewPhotoSuccess = (state, action) => {
  return updateObject(state, {
    uploadingImage: false,
    imageUploaded: true,
  });
};

const submitNewListingInit = (state, action) => {
  return updateObject(state, {
    uploadingPost: true,
  });
};

const submitNewListingSuccess = (state, action) => {
  return updateObject(state, {
    uploadingPost: false,
    postUploaded: true,
  });
};

const submitNewPhotoFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    uploadingImage: false,
  });
};

const submitNewListingFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    uploadingPost: false,
  });
};

const clearNewPostData = (state, action) => {
  return updateObject(state, {
    uploadingPost: false,
    postUploaded: false,
    uploadingImage: false,
    imageUploaded: false,
    error: null,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SUBMIT_NEW_PHOTO_INIT:
      return submitNewPhotoInit(state, action);
    case actionTypes.SUBMIT_NEW_LISTING_INIT:
      return submitNewListingInit(state, action);
    case actionTypes.SUBMIT_NEW_PHOTO_SUCCESS:
      return submitNewPhotoSuccess(state, action);
    case actionTypes.SUBMIT_NEW_LISTING_SUCCESS:
      return submitNewListingSuccess(state, action);
    case actionTypes.SUBMIT_NEW_PHOTO_FAIL:
      return submitNewPhotoFail(state, action);
    case actionTypes.SUBMIT_NEW_LISTING_FAIL:
      return submitNewListingFail(state, action);
    case actionTypes.CLEAR_NEW_POST_DATA:
      return clearNewPostData(state, action);
    default:
      return state;
  }
};

export default reducer;
