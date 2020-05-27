import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  listings: [],
  error: null,
  loading: false,
  filteredListing: false,
};

const fetchListingSuccess = (state, listings) => {
  return updateObject(state, { listings: listings, loading: false });
};

const fetchListingFail = (state, error) => {
  return updateObject(state, { error: error, loading: false });
};

const fetchAllListingInit = (state, action) => {
  return updateObject(state, { loading: true, filteredListing: false });
};

const fetchFilteredListingInit = (state, action) => {
  return updateObject(state, { loading: true, filteredListing: true });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_LISTING_INIT:
      return fetchAllListingInit(state, action);
    case actionTypes.FETCH_FILTERED_LISTINGS_INIT:
      return fetchFilteredListingInit(state, action);
    case actionTypes.FETCH_LISTING_SUCCESS:
      return fetchListingSuccess(state, action.data);
    case actionTypes.FETCH_LISTING_FAIL:
      return fetchListingFail(state, action.error);
    default:
      return state;
  }
};

export default reducer;
