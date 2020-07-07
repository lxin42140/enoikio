import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  filterType: "",
  searchObject: "",
};

const filterListings = (state, filterType, searchObject) => {
  return updateObject(state, {
    filterType: filterType,
    searchObject: searchObject,
  });
};

const filterProfile = (state, action) => {
  return updateObject(state, {
    filterType: "searchProfile",
    searchObject: action.displayName,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FILTER_LISTINGS:
      return filterListings(state, action.filterType, action.searchObject);
    case actionTypes.FILTER_PROFILE:
      return filterProfile(state, action);
    default:
      return state;
  }
};

export default reducer;
