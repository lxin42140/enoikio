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

export const interestedListing = (interestedListing) => {
  return {
    type: actionTypes.SET_INTERESTED_LISTING,
    interestedListing: interestedListing,
  };
};

export const updateListing = (updatedListing) => {
  return {
    type: actionTypes.UPDATE_LISTING,
    updatedListing: updatedListing,
  };
};

export const emptyInterestedListing = () => {
  return (dispatch) => {
    dispatch(clearInterestedListing());
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

export const setInterestedListing = (listing) => {
  return (dispatch) => {
    storage
      .ref("/listingPictures/" + listing.unique)
      .child("0")
      .child("0")
      .getDownloadURL()
      .then(
        (url) => {
          let offerType = "";
          if (listing.offerType) {
            offerType = listing.offerType;
          }
          const result = {
            listingType: listing.postDetails.listingType,
            textbook: listing.postDetails.textbook,
            price: listing.postDetails.price,
            displayName: listing.displayName,
            url: url,
            key: listing.key,
            offerType: offerType,
          };
          dispatch(interestedListing(result));
        },
        (error) => {
          // const message = error.message.split("-").join(" ");
          // dispatch(fetchListingFail(message));
          // .catch(error => {
          switch (error.code) {
            case('storage/unauthenticated'):
              dispatch(fetchListingFail("Oops, you are unauthenticated. Log in and try again!"));
              break;
            case ('storage/canceled'):
              dispatch(fetchListingFail("Oops, you have cancelled the operation. Please try again!"));
              break;
            case('storage/invalid-url'):
              dispatch(fetchListingFail("Oops, the URL is invalid. Please try again!"));
              break;
            default:
              dispatch(fetchListingFail("Oops, something went wrong. Please try again later!"))
          }
          // });
        }
      );
  };
};

export const removedListing = (key) => {
  return {
    type: actionTypes.REMOVED_LISTING,
    key: key,
  };
};

export const fetchAllListings = () => {
  return (dispatch, getState) => {
    dispatch(fetchListingInit());

    database
      .ref()
      .child("listings")
      .on("child_removed", (snapShot) => {
        dispatch(removedListing(snapShot.key));
      }, error => {
        let message;
        switch (error.getCode()) {
          case (-24): //NETWORK_ERROR
          case (-4): //DISCONNECTED
            message = "Oops, please check your network connection and try again!";
            break;
          case (-10): //UNAVAILABLE
          case (-2): //OPERATION_FAILED
            message = "Oops, the service is currently unavailable. Please try again later!";
            break;
          default:
            message = "Oops, something went wrong. Please try again later!";
        }
        dispatch(fetchListingFail(message));
      });

    database
      .ref()
      .child("listings")
      .on("child_added", (snapShot) => {
        let result = Object.assign([], getState().listing.listings);
        const key = snapShot.key;
        const listing = {
          key: key,
          unique: snapShot.val().unique,
          displayName: snapShot.val().displayName,
          formattedDisplayName: snapShot.val().formattedDisplayName,
          photoURL: snapShot.val().photoURL,
          date: snapShot.val().date,
          time: snapShot.val().time,
          postDetails: snapShot.val().postDetails,
          numberOfImages: snapShot.val().numberOfImages,
          status: snapShot.val().status,
          comments: snapShot.val().comments,
          replies: snapShot.val().replies,
          likedUsers: snapShot.val().likedUsers,
          lessee: snapShot.val().lessee,
        };

        database
          .ref()
          .child("listings")
          .child(key)
          .on("child_changed", (snapShot) => {
            let updatedListing = Object.assign(
              [],
              getState().listing.listings
            ).filter((listing) => listing.key === key)[0];
            if (snapShot.key === "status") {
              updatedListing.status = snapShot.val();
              dispatch(updateListing(updatedListing));
            } else if (snapShot.key === "likedUsers") {
              updatedListing.likedUsers = snapShot.val();
              dispatch(updateListing(updatedListing));
            } else if (snapShot.key === "comments") {
              updatedListing.comments = snapShot.val();
              dispatch(updateListing(updatedListing));
            } else if (snapShot.key === "replies") {
              updatedListing.replies = snapShot.val();
              dispatch(updateListing(updatedListing));
            } else if (snapShot.key === "photoURL") {
              updatedListing.photoURL = snapShot.val();
              dispatch(updateListing(updatedListing));
            } else if (snapShot.key === "lessee") {
              updatedListing.lessee = snapShot.val();
              dispatch(updateListing(updatedListing));
            } else {
              updatedListing = {
                ...updatedListing,
                postDetails: {
                  ...snapShot.val(),
                },
              };
              dispatch(updateListing(updatedListing));
            }
          }, error => {
            let message;
            switch (error.getCode()) {
              case (-24): //NETWORK_ERROR
              case (-4): //DISCONNECTED
                message = "Oops, please check your network connection and try again!";
                break;
              case (-10): //UNAVAILABLE
              case (-2): //OPERATION_FAILED
                message = "Oops, the service is currently unavailable. Please try again later!";
                break;
              default:
                message = "Oops, something went wrong. Please try again later!";
            }
            dispatch(fetchListingFail(message));
          });

        if (!snapShot.val().comments) {
          database
            .ref()
            .child("listings")
            .child(key)
            .on("child_added", (snapShot) => {
              let updatedListing = Object.assign(
                [],
                getState().listing.listings
              ).filter((listing) => listing.key === key)[0];
              if (snapShot.key === "comments") {
                updatedListing.comments = snapShot.val();
                dispatch(updateListing(updatedListing));
              } else if (snapShot.key === "replies") {
                updatedListing.replies = snapShot.val();
                dispatch(updateListing(updatedListing));
              }
            }, error => {
              let message;
              switch (error.getCode()) {
                case (-24): //NETWORK_ERROR
                case (-4): //DISCONNECTED
                  message = "Oops, please check your network connection and try again!";
                  break;
                case (-10): //UNAVAILABLE
                case (-2): //OPERATION_FAILED
                  message = "Oops, the service is currently unavailable. Please try again later!";
                  break;
                default:
                  message = "Oops, something went wrong. Please try again later!";
              }
              dispatch(fetchListingFail(message));
            });
        }

        result.push(listing);
        result.reverse();
        dispatch(fetchListingSuccess(result));
      }, error => {
        let message;
        switch (error.getCode()) {
          case (-24): //NETWORK_ERROR
          case (-4): //DISCONNECTED
            message = "Oops, please check your network connection and try again!";
            break;
          case (-10): //UNAVAILABLE
          case (-2): //OPERATION_FAILED
            message = "Oops, the service is currently unavailable. Please try again later!";
            break;
          default:
            message = "Oops, something went wrong. Please try again later!";
        }
        dispatch(fetchListingFail(message));
      })
      // .catch((error) => {
      //   const message = error.message.split("-").join(" ");
      //   dispatch(fetchListingFail(message));
      // });
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
        // const message = error.message.split("-").join(" ");
        // dispatch(fetchListingFail(message));
        switch (error.code) {
          case('storage/unauthenticated'):
            dispatch(fetchListingFail("Oops, you are unauthenticated. Log in and try again!"));
            break;
          case ('storage/canceled'):
            dispatch(fetchListingFail("Oops, you have cancelled the operation. Please try again!"));
            break;
          case('storage/invalid-url'):
            dispatch(fetchListingFail("Oops, the URL is invalid. Please try again!"));
            break;
          default:
            dispatch(fetchListingFail("Oops, something went wrong. Please try again later!"))
        }
      }
    );
  };
};

async function getDownloadURL(numImage, identifier, key) {
  const imageURL = [];
  while (key < numImage) {
    const ref = storage
      .ref()
      .child("listingPictures")
      .child(identifier)
      .child("" + key);

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
