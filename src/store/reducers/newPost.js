import * as actionTypes from "../actions/actionTypes";

const initialState = {
  uploadingPost: false,
  postUploaded: false,
  uploadingImage: false,
  imageUploaded: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SUBMIT_NEW_PHOTO_INIT:
      return { ...state, uploadingImage: true };
    case actionTypes.SUBMIT_NEW_LISTING_INIT:
      return { ...state, uploadingPost: true };

    case actionTypes.SUBMIT_NEW_PHOTO_SUCCESS:
      return { ...state, uploadingImage: false, imageUploaded: true };
    case actionTypes.SUBMIT_NEW_LISTING_SUCCESS:
      return { ...state, uploadingPost: false, postUploaded: true };

    case actionTypes.SUBMIT_NEW_PHOTO_FAIL:
      return { ...state, error: action.error, uploadingImage: false };
    case actionTypes.SUBMIT_NEW_LISTING_FAIL:
      return { ...state, error: action.error, uploadingPost: false };

    case actionTypes.CLEAR_NEW_POST_DATA:
      return {
        uploadingPost: false,
        postUploaded: false,
        uploadingImage: false,
        imageUploaded: false,
        error: null,
      };
    default:
      return state;
  }
};

export default reducer;
