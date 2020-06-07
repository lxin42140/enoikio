import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  listings: [],
  error: null,
  loading: false,
  expandedListing: null,
  expandedListingLoading: false,
  filterType: "",
  searchObject: "",
};

const fetchListingSuccess = (state, listings) => {
  return updateObject(state, { listings: listings, loading: false });
};

const fetchListingFail = (state, error) => {
  return updateObject(state, { error: error, loading: false });
};

const fetchAllListingInit = (state, action) => {
  return updateObject(state, { loading: true });
};

const setExpandedListingInit = (state, action) => {
  return updateObject(state, { expandedListingLoading: true });
};

const setExpandedListing = (state, expandedListing) => {
  return updateObject(state, {
    expandedListing: expandedListing,
    expandedListingLoading: false,
  });
};

const filterListings = (state, filterType, searchObject) => {
  return updateObject(state, {
    filterType: filterType,
    searchObject: searchObject,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_LISTING_INIT:
      return fetchAllListingInit(state, action);
    case actionTypes.FETCH_LISTING_SUCCESS:
      return fetchListingSuccess(state, action.data);
    case actionTypes.FETCH_LISTING_FAIL:
      return fetchListingFail(state, action.error);
    case actionTypes.SET_EXPANDED_LISTING_INIT:
      return setExpandedListingInit(state, action);
    case actionTypes.SET_EXPANDED_LISTING:
      return setExpandedListing(state, action.expandedListing);
    case actionTypes.FILTER_LISTINGS:
      return filterListings(state, action.filterType, action.searchObject);
    default:
      return state;
  }
};

export default reducer;
