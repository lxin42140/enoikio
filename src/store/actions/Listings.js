import * as actionTypes from "./actionTypes";
import axios from "../../firebaseAxios";

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

export const fetchListingInit = (filter) => {
  return (dispatch) => {
    let result = [];
    axios
      .get("/listings.json")
      .then((response) => {
        response.data.forEach((element) => {
          result.push(element.moduleCode);
        });
        dispatch(fetchListingSuccess(result));
      })
      .catch((error) => {
        dispatch(fetchListingFail(error));
      });
  };
};
