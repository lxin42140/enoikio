import * as actionTypes from "./actionTypes";
import axios from "../../firebaseAxios";

export const fetchListingInit = () => {
  return {
    type: actionTypes.FETCH_LISTING_INIT,
  };
};

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
    dispatch(fetchListingInit());
    axios
      .get("/listings.json")
      .then((response) => {
        const result = [];
        for (let key in response.data) {
          const postDetails = [];
          for (let post in response.data[key]) {
            if (post === "postDetails") {
              for (let detail in response.data[key][post]) {
                postDetails.push(response.data[key][post][detail]);
              }
            } else {
              postDetails.push(response.data[key][post]);
            }
          }
          result.push(postDetails);
        }
        dispatch(fetchListingSuccess(result));
      })
      .catch((error) => {
        dispatch(fetchListingFail(error));
      });
  };
};
