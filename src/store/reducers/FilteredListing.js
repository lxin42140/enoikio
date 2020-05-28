import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  filteredListing: [],
  error: null,
  loading: false,
};

const fetchFilteredListingInit = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchFilteredListingSuccess = (state, listings) => {
  return updateObject(state, { filteredListing: listings, loading: false });
};

const fetchFilteredListingFail = (state, error) => {
  return updateObject(state, { error: error, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_FILTERED_LISTINGS_INIT:
      return fetchFilteredListingInit(state, action);
    case actionTypes.FETCH_FILTERED_LISTINGS_SUCCESS:
      return fetchFilteredListingSuccess(state, action.data);
    case actionTypes.FETCH_FILTERED_LISTINGS_FAIL:
      return fetchFilteredListingFail(state, action.error);
    default:
      return state;
  }
};

export default reducer;
