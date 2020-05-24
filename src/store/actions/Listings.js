import * as actionTypes from "./actionTypes";
import axios from "../../firebaseAxios";

export const fetchListingInit = () => {
  return {
    type: actionTypes.FETCH_LISTING_INIT
  }
}

export const fetchListingSuccess = (data) => {
  return {
    type: actionTypes.FETCH_LISTING_SUCCESS,
    data: data,
  };
};

export const fetchListingFail = (error) => {
  return {
    type: actionTypes.FETCH_LISTING_FAIL,
    error: error,
  };
};

export const fetchListing = (filter) => {
  return (dispatch) => {
    dispatch(fetchListingInit())
    axios
      .get("/listings.json")
      .then((response) => {
        dispatch(fetchListingSuccess(response.data));
      })
      .catch((error) => {
        dispatch(fetchListingFail(error));
      });
  };
};