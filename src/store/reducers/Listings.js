import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  listings: [],
  error: null,
  loading: false,
  expandedListingDetail: null,
  expandedListingImage: null,
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

// const fetchExpandedListing = (state, image) => {
//   return updateObject(state, { expandedListingImage: image});
// };

const fetchExpandedListing = (state, listing) => {
  return updateObject(state, { expandedListingDetail: listing });
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_LISTING_INIT:
      return fetchAllListingInit(state, action);
    case actionTypes.FETCH_LISTING_SUCCESS:
      return fetchListingSuccess(state, action.data);
    case actionTypes.FETCH_LISTING_FAIL:
      return fetchListingFail(state, action.error);
    // case actionTypes.RECORD_EXPANDED_LISTING:
    //   return recordExpandedListing(state, action.listing);
    case actionTypes.DISPLAY_EXPANDED_LISTING:
      return fetchExpandedListing(state, action.listing);
    default:
      return state;
  }
};

export default reducer;
