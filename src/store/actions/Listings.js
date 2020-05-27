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

export const fetchAllListings = () => {
  return (dispatch) => {
    dispatch(fetchListingInit());
    axios
      .get("/listings.json")
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
        dispatch(fetchListingSuccess(result));
      })
      .catch((error) => {
        dispatch(fetchListingFail(error));
      });
  };
};

export const fetchFilteredListing = (filterType, data) => {
  return (dispatch) => {
    let query;
    switch (filterType) {
      case "userID":
        query = '?orderBy="userId"&equalTo="' + data + '"';
        break;
      case "module":
        query = '?orderBy="module"&equalTo="' + data + '"';
        break;
      case "title":
        query = '?orderBy="textbook"&equalTo="' + data + '"';
        break;
      default:
        break;
    }
    dispatch(fetchListingInit());
    axios
      .get("/listings.json" + query)
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
        dispatch(fetchListingSuccess(result));
      })
      .catch((error) => {
        dispatch(fetchListingFail(error));
      });
  };
};
