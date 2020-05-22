import * as actionTypes from "../actions/actionTypes";
import { updateObject } from '../utility';

const initialState = {
    modules: [],
    textbook: [],
    locations: [],
    searchRequest: "",
}

const searchBarInit = (state, newValue) => {
    return updateObject(state, {modules: newValue})
}

const fetchSuggestionsFail = (state, newValue) => {
    return updateObject(state, {error: newValue})
}

const searchRequest = (state, newValue) => {
    return updateObject(state, {searchRequest: newValue})
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SEARCHBAR_INT:
        case actionTypes.FETCH_SUGGESTIONS_SUCCESS: return searchBarInit(state, action.data);
        case actionTypes.FETCH_SUGGESTIONS_FAIL: return fetchSuggestionsFail(state, action.error);
        case actionTypes.SEARCH_REQUEST: return searchRequest(state, action.searchQuery)
        default: return state;
    }
}

export default reducer;