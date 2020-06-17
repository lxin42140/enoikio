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
        const message = error.message.split("-").join(" ");
        dispatch(submitNewPostFail(message));
      });
  };
};

export const editPost = (editedPost, node) => {
  return (dispatch) => {
    dispatch(submitNewPostInit());
    database
      .ref()
      .child(`/listings/${node}`)
      .update({ postDetails: editedPost })
      .then(dispatch(submitNewPostSuccess()))
      .catch((error) => {
        const message = error.message.split("-").join(" ");
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
          dispatch(submitNewPostFail(error));
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
      .ref(`/listingPictures/${identifier}/${key}`)
      .child(`/${key}`)
      .catch((error) => (error = error.message.split("-").join(" ")));

    await imageRef.put(imageAsFile[key]);

    const metadata = {
      customMetadata: {
        name: imageAsFile[key].name,
        index: key,
      },
    };
    imageRef
      .updateMetadata(metadata)
      .catch((error) => (error = error.message.split("-").join(" ")));

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
          dispatch(submitNewPhotoFail(error));
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
      .ref(`/listingPictures/${identifier}/${key}`)
      .child(`/${key}`)
      .catch((error) => (error = error.message.split("-").join(" ")));

    if (imageAsFile[key] === null) {
      imageRef.delete().catch((error) => console.log(error));
    } else if (typeof imageAsFile[key] !== "string") {
      await imageRef.put(imageAsFile[key]);
      const metadata = {
        customMetadata: {
          name: imageAsFile[key].name,
          index: key,
        },
      };
      await imageRef
        .updateMetadata(metadata)
        .catch((error) => (error = error.message.split("-").join(" ")));
    }
    key += 1;
  }
  return error;
}
