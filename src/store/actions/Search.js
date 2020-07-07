import * as actionTypes from "./actionTypes";
export const setFilterListings = (filterType, searchObject) => {
  return {
    type: actionTypes.FILTER_LISTINGS,
    filterType: filterType,
    searchObject: searchObject,
  };
};

export const setFilterProfile = (displayName) => {
  return {
    type: actionTypes.FILTER_PROFILE,
    displayName: displayName,
  };
};
