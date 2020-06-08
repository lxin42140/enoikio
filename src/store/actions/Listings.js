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

export const toggleFavouriteListing = (displayName, node, type) => {

  return (dispatch, getState) => {
    const currLikedUsers = 
      getState().listing.listings.filter(listing => 
        listing.key === node)[0]
        .likedUsers
    if (type === "LIKE") {
      currLikedUsers.push(displayName);
    } else {
      const indexOfUser = currLikedUsers.indexOf(displayName);
      currLikedUsers.splice(indexOfUser, 1);
    }
    database
      .ref()
      .child(`/listings/${node}`)
      .update({
        "likedUsers" : currLikedUsers
      })
  }
}

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
