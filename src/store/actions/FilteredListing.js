import * as actionTypes from "./actionTypes";
import axios from "../../firebaseAxios";

export const fetchFilteredListingInit = () => {
  return {
    type: actionTypes.FETCH_FILTERED_LISTINGS_INIT,
  };
};

export const fetchFilteredListingSuccess = (data) => {
  return {
    type: actionTypes.FETCH_FILTERED_LISTINGS_SUCCESS,
    data: data,
  };
};

export const fetchFilteredListingFail = (error) => {
  return {
    type: actionTypes.FETCH_LISTING_FAIL,
    error: error,
  };
};

export const fetchFilteredListing = (filterType, data) => {
  return (dispatch) => {
    dispatch(fetchFilteredListingInit());
    const term = data.toLowerCase();
    let query;
    switch (filterType) {
      case "userID":
        query = '?orderBy="userId"&equalTo="' + data + '"';
        break;
      case "module":
        query = '?orderBy="/postDetails/module"&equalTo="' + term + '"';
        break;
      case "title":
        query = '?orderBy="/postDetails/textbook"&equalTo="' + term + '"';
        break;
      default:
        query = '?orderBy="/postDetails/location"&equalTo="' + term + '"';
        break;
    }
    axios
      .get("/listings.json".concat(query).concat('&orderBy="dateAndTime"'))
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
        dispatch(fetchFilteredListingSuccess(result));
      })
      .catch((error) => {
        dispatch(fetchFilteredListingFail(error));
      });
  };
};
