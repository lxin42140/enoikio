import * as actionTypes from "../actions/actionTypes";

const initialState = {
    error: null,
    loading: false
}

const reducer = (state=initialState, action) => {
    switch(action.type) {
        case actionTypes.SUBMIT_NEW_LISTING_INIT: return {...state, loading: true}
        case actionTypes.SUBMIT_NEW_LISTING_SUCCESS: return {...state, loading: false}
        case actionTypes.SUBMIT_NEW_LISTING_FAIL: return {...state, error: action.error}
        default: return state;
    }
}

export default reducer;