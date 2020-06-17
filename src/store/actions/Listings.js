import * as actionTypes from "./actionTypes";
import { database, storage } from "../../firebase/firebase";

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
export const clearExpandedListing = () => {
  return {
    type: actionTypes.CLEAR_EXPANDED_LISTING,
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

export const updateListing = (updatedListing) => {
  return {
    type: actionTypes.UPDATE_LISTING,
    updatedListing: updatedListing,
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
      })
      .catch((error) => {
        const message = error.message.split("-").join(" ");
        dispatch(fetchListingFail(message));
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
        let result = Object.assign([], getState().listing.listings);
        const key = snapShot.key;

        const listing = {
          key: key,
          unique: snapShot.val().unique,
          userId: snapShot.val().userId,
          displayName: snapShot.val().displayName,
          date: snapShot.val().date,
          time: snapShot.val().time,
          postDetails: snapShot.val().postDetails,
          numberOfImages: snapShot.val().numberOfImages,
          status: snapShot.val().status,
          comments: snapShot.val().comments,
          likedUsers: snapShot.val().likedUsers,
        };

        database
          .ref()
          .child("listings")
          .child(key)
          .on("child_changed", (snapShot) => {
            if (
              snapShot.val() === "available" ||
              (typeof snapShot.val() === String &&
                snapShot.val().split(" ")[0] === "loaned") ||
              snapShot.val() === "sold"
            ) {
              let updatedListing = Object.assign(
                [],
                getState().listing.listings
              ).filter((listing) => listing.key === key)[0];
              updatedListing.status = snapShot.val();
              dispatch(updateListing(updatedListing));
            }
          });

        result.push(listing);
        result.reverse();
        dispatch(fetchListingSuccess(result));
      })
      .catch((error) => {
        const message = error.message.split("-").join(" ");
        dispatch(fetchListingFail(message));
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
      },
      (error) => {
        const message = error.message.split("-").join(" ");
        dispatch(fetchListingFail(message));
      }
    );
  };
};

async function getDownloadURL(numImage, identifier, key) {
  const imageURL = [];
  while (key < numImage) {
    const ref = storage.ref(`/listingPictures/${identifier}/${key}`);

    const image = await ref.listAll();
    if (image.items.length === 0) {
      imageURL.push(null);
      key += 1;
      continue;
    }

    let link;
    await ref
      .child("" + key)
      .getDownloadURL()
      .then((url) => (link = url));

    let imageName;
    await ref
      .child("" + key)
      .getMetadata()
      .then((data) => (imageName = data.customMetadata.name));

    imageURL.push({ url: link, name: imageName });

    key += 1;
  }
  return imageURL;
}
