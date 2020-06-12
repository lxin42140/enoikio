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
  interestedListing: null,
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

const interestedListing = (state, interestedListing) => {
  return updateObject(state, {
    interestedListing: interestedListing,
  });
};

const clearInterestedListing = (state, action) => {
  return updateObject(state, {
    interestedListing: null,
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
    case actionTypes.SET_INTERESTED_LISTING:
      return interestedListing(state, action.interestedListing);
    case actionTypes.CLEAR_INTERESTED_LISTING:
      return clearInterestedListing(state, action);
    default:
      return state;
  }
};

export default reducer;
