import * as actionTypes from "../actions/actionTypes";
import { updateObject } from '../utility';

const initialState = {
    listings: [],
    error: null,
    loading: false
}

const fetchListingSuccess = (state, listings) => {
    return updateObject(state, {listings: listings, loading: false})
}

const fetchListingFail = (state, error) => {
    return updateObject(state, {error: error, loading: false})
}

const fetchListingInit = (state, action) => {
    return updateObject(state, {loading: true})
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_LISTING_INIT: return fetchListingInit(state, action);
        case actionTypes.FETCH_LISTING_SUCCESS: return fetchListingSuccess(state, action.data);
        case actionTypes.FETCH_LISTING_FAIL: return fetchListingFail(state, action.error);
        default: return state;
    }
}

export default reducer;