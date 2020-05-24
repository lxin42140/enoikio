import * as actionTypes from "./actionTypes";
import axios from "axios";

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


export const fetchListingInit = (filter) => {
  return (dispatch) => {
    let result = [];
    let url = "https://api.nusmods.com/v2/2019-2020/moduleList.json";
    if (filter !== "module code") {
    }
    axios
      .get(url)
      .then((response) => {
        response.data.forEach((element) => {
          result.push(element.moduleCode);
        });
        dispatch(fetchListingSuccess(result));
      })
      .catch((error) => {
        dispatch(fetchListingFail(error));
      });
  };
};
