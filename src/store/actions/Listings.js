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

export const fetchListing = (filter) => {
  return (dispatch) => {
    dispatch(fetchListingInit());
    axios
      .get("/listings.json")
      .then((response) => {
        const result = [];
        for (let key in response.data) {
          const postDetails = [];
          for (let post in response.data[key]) {
            if (post === "postDetails") {
              for (let detail in response.data[key][post]) {
                postDetails.push(response.data[key][post][detail]);
              }
            } else {
              postDetails.push(response.data[key][post]);
            }
          }
          result.push(postDetails);
        }
        console.log(result)
        dispatch(fetchListingSuccess(result));
      })
      .catch((error) => {
        dispatch(fetchListingFail(error));
      });
  };
};

// handleFireBaseUpload = (e) => {
//   e.preventDefault();
//   console.log("start of upload");
//   // async magic goes here...
//   if (this.state.imageAsFile === "") {
//     console.error(
//       `not an image, the image file is a ${typeof this.state.imageAsFile}`
//     );
//   }
//   const uploadTask = storage
//     .ref(`/images/${this.state.imageAsFile.name}`)
//     .put(this.state.imageAsFile);
//   //initiates the firebase side uploading
//   uploadTask.on(
//     "state_changed",
//     (snapShot) => {
//       //takes a snap shot of the process as it is happening
//       console.log(snapShot);
//     },
//     (err) => {
//       //catches the errors
//       console.log(err);
//     },
//     () => {
//       // gets the functions from storage refences the image storage in firebase by the children
//       // gets the download url then sets the image from firebase as the value for the imgUrl key:
// storage
//   .ref("images")
//   .child(this.state.imageAsFile.name)
//   .getDownloadURL()
//   .then((fireBaseUrl) => {
//     this.setState({ imageAsUrl: fireBaseUrl });
//   });
//     }
//   );
// };
