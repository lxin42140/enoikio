import * as actionTypes from "./actionTypes";
import axios from "axios";

export const fetchSuggestionsSuccess = (data) => {
  return {
    type: actionTypes.FETCH_SUGGESTIONS_SUCCESS,
    data: data,
  };
};

export const fetchSuggestionsFail = (error) => {
  return {
    type: actionTypes.FETCH_SUGGESTIONS_FAIL,
    error: error,
  };
};

export const searchRequest = (query) => {
  return {
    type: actionTypes.SEARCH_REQUEST,
    searchQuery: query,
  };
};

export const suggestionsInit = (filter) => {
  return (dispatch) => {
    let result = [];
    let url = "https://api.nusmods.com/v2/2019-2020/moduleList.json";
    if (filter !== "modules") {
    }
    axios
      .get(url)
      .then((response) => {
        response.data.forEach((element) => {
          result.push(element.moduleCode);
        });
        dispatch(fetchSuggestionsSuccess(result));
      })
      .catch((error) => {
        dispatch(fetchSuggestionsFail(error));
      });
  };
};
