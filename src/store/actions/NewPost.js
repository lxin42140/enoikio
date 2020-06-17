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

export const submitNewPost = (data) => {
  return (dispatch) => {
    dispatch(submitNewPostInit());
    database
      .ref()
      .child("listings")
      .push(data)
      .then((res) => dispatch(submitNewPostSuccess()))
      .catch((error) => submitNewPostFail(error));
  };
};

export const editPost = (editedPost, node) => {
  return (dispatch) => {
    dispatch(submitNewPostInit());
    database
      .ref()
      .child(`/listings/${node}`)
      .update({ postDetails: editedPost })
      .then(dispatch(submitNewPostSuccess()));
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
      submitPhoto(imageAsFile, identifier, 0).then(() =>
        dispatch(submitNewPhotoSuccess(), (error) =>
          dispatch(submitNewPhotoFail(error))
        )
      );
    }
  };
};

async function submitPhoto(imageAsFile, identifier, key) {
  while (key < imageAsFile.length) {
    const imageRef = storage
      .ref(`/listingPictures/${identifier}/${key}`)
      .child(`/${key}`)

    await imageRef
      .put(imageAsFile[key]);

    const metadata = {
      customMetadata: {
        'name': imageAsFile[key].name,
        'index': key,
      }
    }
    imageRef
      .updateMetadata(metadata)
      .then(metadata => console.log(metadata));
    key += 1;
  }
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
      editPhoto(imageAsFile, identifier, 0).then(() =>
        dispatch(submitNewPhotoSuccess(), (error) =>
          dispatch(submitNewPhotoFail(error))
        )
      );
    }
  };
};

async function editPhoto(imageAsFile, identifier, key) {
  while (key < imageAsFile.length) {
    const imageRef = storage
      .ref(`/listingPictures/${identifier}/${key}`)
      .child(`/${key}`)
  
    if (imageAsFile[key] === null) {
      imageRef.delete()
      .catch(error => console.log(error))
    } else if (typeof imageAsFile[key] !== "string") {
      await imageRef.put(imageAsFile[key]);
      const metadata = {
        customMetadata: {
          'name': imageAsFile[key].name,
          'index': key,
        }
      }
      await imageRef
        .updateMetadata(metadata)
        .then(metadata => console.log(metadata));
    }
    key += 1;
  }
}
