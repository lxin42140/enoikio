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
        dispatch(fetchListingSuccess(result));
      })
      .catch((error) => {
        dispatch(fetchListingFail(error));
      });
  };
};

// postDetails:
// Description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,"
// deliveryMethod: "mail"
// location: "NUS COMP2"
// module: "cs2030"
// price: "20"
// textbook: "Introduction to programming"
// __proto__: Object
// userId: 1590374010637
