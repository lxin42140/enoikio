import * as actionTypes from "./actionTypes";
import { storage } from "../../firebase/firebase";
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

export const setExpandedListing = (expandedListing) => {
  return {
    type: actionTypes.SET_EXPANDED_LISTING,
    expandedListing: expandedListing,
  };
};

export const setExpandedListingInit = () => {
  return {
    type: actionTypes.SET_EXPANDED_LISTING_INIT,
  };
};

export const filterListings = (filterType, searchObject) => {
  return {
    type: actionTypes.FILTER_LISTINGS,
    filterType: filterType,
    searchObject: searchObject,
  };
};

export const interestedListing = (interestedListing) => {
  return {
    type: actionTypes.SET_INTERESTED_LISTING,
    interestedListing: interestedListing,
  };
};

export const clearInterestedListing = () => {
  return {
    type: actionTypes.CLEAR_INTERESTED_LISTING,
  };
};

export const setFilterListings = (filterType, searchObject) => {
  return (dispatch) => {
    dispatch(filterListings(filterType, searchObject));
  };
};

export const emptyInterestedListing = () => {
  return (dispatch) => {
    dispatch(clearInterestedListing());
  };
};

export const setInterestedListing = (listing) => {
  return (dispatch) => {
    storage
      .ref("/listingPictures/" + listing.unique)
      .child("0")
      .getDownloadURL()
      .then((url) => {
        const result = {
          textBook: listing.postDetails.textbook,
          price: listing.postDetails.price,
          displayName: listing.displayName,
          url: url,
          key: listing.key,
        };
        dispatch(interestedListing(result));
      });
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
          status: snapShot.val().status,
          comments: snapShot.val().comments,
          key: snapShot.key,
          likedUsers: snapShot.val().likedUsers,
        };
        result.push(listing);
        result.reverse();
        dispatch(fetchListingSuccess(result));
      });
  };
};

export const fetchExpandedListing = (identifier) => {
  return (dispatch, getState) => {
    dispatch(setExpandedListingInit());
    const expandedListing = getState().listing.listings.filter(
      (listing) => listing.unique === identifier
    )[0];
    getDownloadURL(expandedListing.numberOfImages, identifier, 0).then(
      (imageURL) => {
        expandedListing.imageURL = imageURL;
        dispatch(setExpandedListing(expandedListing));
      }
    );
  };
};

async function getDownloadURL(numImage, identifier, key) {
  const imageURL = [];
  while (key < numImage) {
    await storage
      .ref("/listingPictures/" + identifier)
      .child("" + key)
      .getDownloadURL()
      .then((url) => imageURL.push(url))
      .catch((error) => imageURL.push("error"));
    key += 1;
  }
  return imageURL;
}
