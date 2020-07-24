import * as actionTypes from "./actionTypes";
import { storage, database } from "../../firebase/firebase";

export const submitNewPostInit = () => {
  return {
    type: actionTypes.SUBMIT_NEW_LISTING_INIT,
  };
};

export const submitNewPostSuccess = () => {
  return {
    type: actionTypes.SUBMIT_NEW_LISTING_SUCCESS,
  };
};

export const submitNewPostFail = (error) => {
  return {
    type: actionTypes.SUBMIT_NEW_LISTING_FAIL,
    error: error,
  };
};

export const clearPostData = () => {
  return {
    type: actionTypes.CLEAR_NEW_POST_DATA,
  };
};

export const submitNewPhotoInit = () => {
  return {
    type: actionTypes.SUBMIT_NEW_PHOTO_INIT,
  };
};

export const submitNewPhotoFail = (error) => {
  return {
    type: actionTypes.SUBMIT_NEW_PHOTO_FAIL,
  };
};

export const submitNewPhotoSuccess = () => {
  return {
    type: actionTypes.SUBMIT_NEW_PHOTO_SUCCESS,
  };
};

export const submitNewPost = (data) => {
  return (dispatch) => {
    dispatch(submitNewPostInit());
    database
      .ref()
      .child("listings")
      .push(data)
      .then((res) => dispatch(submitNewPostSuccess()))
      .catch((error) => {
        // const message = error.message.split("-").join(" ");
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
        dispatch(submitNewPostFail(message));
      });
  };
};

export const editPost = (editedDetails, node) => {
  return (dispatch) => {
    dispatch(submitNewPostInit());
    database
      .ref()
      .child("listings")
      .child(node)
      .set(editedDetails)
      .then(dispatch(submitNewPostSuccess()), (error) => {
        // const message = error.message.split("-").join(" ");
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
        dispatch(submitNewPostFail(message));
      });
  };
};

export const submitNewPhoto = (imageAsFile, identifier) => {
  return (dispatch) => {
    if (imageAsFile === "") {
      dispatch(
        submitNewPhotoFail(
          `not an image, the image file is a ${typeof imageAsFile}`
        )
      );
    } else {
      dispatch(submitNewPhotoInit());
      submitPhoto(imageAsFile, identifier, 0).then((error) => {
        if (error) {
          switch (error.code) {
            case ('storage/unauthenticated'):
              dispatch(submitNewPostFail("Oops, you are unauthenticated. Log in and try again!"));
              break;
            case ('storage/canceled'):
              dispatch(submitNewPostFail("Oops, you have cancelled the operation. Please try again!"));
              break;
            case ('storage/invalid-url'):
              dispatch(submitNewPostFail("Oops, the URL is invalid. Please try again!"));
              break;
            default:
              dispatch(submitNewPostFail("Oops, something went wrong. Please try again later!"))
          }
          // dispatch(submitNewPostFail(error));
        } else {
          dispatch(submitNewPhotoSuccess());
        }
      });
    }
  };
};

async function submitPhoto(imageAsFile, identifier, key) {
  let error = null;
  while (key < imageAsFile.length) {
    const imageRef = storage
      .ref()
      .child("listingPictures")
      .child(identifier)
      .child("" + key)
      .child("" + key);

    await imageRef.put(imageAsFile[key]);

    const metadata = {
      customMetadata: {
        name: imageAsFile[key].name,
        index: key,
      },
    };
    imageRef.updateMetadata(metadata);

    key += 1;
  }
  return error;
}

export const submitEditedPhoto = (imageAsFile, identifier) => {
  return (dispatch) => {
    if (imageAsFile === "") {
      dispatch(
        submitNewPhotoFail(
          `not an image, the image file is a ${typeof imageAsFile}`
        )
      );
    } else {
      dispatch(submitNewPhotoInit());
      editPhoto(imageAsFile, identifier, 0).then((error) => {
        if (error) {
          switch (error.code) {
            case ('storage/unauthenticated'):
              dispatch(submitNewPostFail("Oops, you are unauthenticated. Log in and try again!"));
              break;
            case ('storage/canceled'):
              dispatch(submitNewPostFail("Oops, you have cancelled the operation. Please try again!"));
              break;
            case ('storage/invalid-url'):
              dispatch(submitNewPostFail("Oops, the URL is invalid. Please try again!"));
              break;
            default:
              dispatch(submitNewPostFail("Oops, something went wrong. Please try again later!"));
          }
          // dispatch(submitNewPhotoFail(error));
        } else {
          dispatch(submitNewPhotoSuccess());
        }
      });
    }
  };
};

async function editPhoto(imageAsFile, identifier, key) {
  let error = null;
  while (key < imageAsFile.length) {
    const imageRef = storage
      .ref()
      .child("listingPictures")
      .child(identifier)
      .child("" + key);
    // .child("" + key);

    if (imageAsFile[key] === null) {
      const list = await imageRef.listAll();
      if (list.items.length !== 0) {
        await imageRef
          .child("" + key)
          .delete()
        // .catch((error) => (error = error.message.split("-").join(" ")));
      }
    } else if (typeof imageAsFile[key] !== "string") {
      await imageRef
        .child("" + key)
        .put(imageAsFile[key])
      // .catch((error) => (error = error.message.split("-").join(" ")));
      const metadata = {
        customMetadata: {
          name: imageAsFile[key].name,
          index: key,
        },
      };
      await imageRef
        .child("" + key)
        .updateMetadata(metadata)
      // .catch((error) => (error = error.message.split("-").join(" ")));
    }
    key += 1;
  }
  return error;
}
