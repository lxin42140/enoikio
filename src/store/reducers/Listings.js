import * as actionTypes from "../actions/actionTypes";
import { updateObject } from '../utility';

const initialState = {
    listings: [],
    error: null,
}

const fetchListingSuccess = (state, listings) => {
    return updateObject(state, {listings: listings})
}

const fetchListingFail = (state, error) => {
    return updateObject(state, {error: error})
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_LISTING_SUCCESS: return fetchListingSuccess(state, action.data);
        case actionTypes.FETCH_LISTING_FAIL: return fetchListingFail(state, action.error);
        default: return state;
    }
}

export default reducer;