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

export const displayExpandedListing = (identifer) => {
  return {
    type: actionTypes.DISPLAY_EXPANDED_LISTING,
    identifer: identifer,
  };
};

export const fetchAllListings = () => {
  return (dispatch) => {
    dispatch(fetchListingInit());
    axios
      .get('/listings.json?orderBy="dateAndTime"')
      .then((response) => {
        const result = [];
        for (let post in response.data) {
          const postDetails = [];
          for (let detail in response.data[post]) { 
            if (detail === "postDetails") {
              for (let element in response.data[post][detail]) {
                postDetails.push(response.data[post][detail][element]);
              }
            } else {
              postDetails.push(response.data[post][detail]);
            }
          }
          result.push(postDetails);
        }
        result.reverse();
        dispatch(fetchListingSuccess(result));
      })
      .catch((error) => {
        dispatch(fetchListingFail(error));
      });
  };
};
