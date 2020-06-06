import * as actionTypes from "./actionTypes";
import { database } from "../../firebase/firebase";

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
  return (dispatch, getState) => {
    dispatch(fetchListingInit());
    database
      .ref()
      .child("listings")
      .on("child_added", (snapShot) => {
        const result = Object.assign([], getState().listing.listings);
        const listing = {
          date: snapShot.val().date,
          displayName: snapShot.val().displayName,
          numberOfImages: snapShot.val().numberOfImages,
          time: snapShot.val().time,
          unique: snapShot.val().unique,
          userId: snapShot.val().userId,
          postDetails: snapShot.val().postDetails,
          status: snapShot.val().status
        };
        result.push(listing);
        result.reverse();
        dispatch(fetchListingSuccess(result));
      });
  };
};
