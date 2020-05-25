import * as actionTypes from "../actions/actionTypes";

const initialState = {
  error: null,
  loading: false,
  uploadingImageLoading: false,
  imageUploaded: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SUBMIT_NEW_PHOTO_INIT:
      return { ...state, uploadingImageLoading: true };
    case actionTypes.SUBMIT_NEW_LISTING_INIT:
      return { ...state, loading: true };

    case actionTypes.SUBMIT_NEW_PHOTO_SUCCESS:
      return { ...state, uploadingImageLoading: false, imageUploaded: true };
    case actionTypes.SUBMIT_NEW_LISTING_SUCCESS:
      return { ...state, loading: false, uploadingImageLoading: false, imageUploaded: false };

    case actionTypes.SUBMIT_NEW_PHOTO_FAIL:
      return { ...state, error: action.error, uploadingImageLoading: false };
    case actionTypes.SUBMIT_NEW_LISTING_FAIL:
      return { ...state, error: action.error, loading: false };

    default:
      return state;
  }
};

export default reducer;
