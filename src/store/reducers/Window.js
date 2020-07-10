import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  width: window.innerWidth,
};

const setWindowWidth = (state, width) => {
  return updateObject(state, {
    width: width,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_WINDOW_WIDTH:
      return setWindowWidth(state, action.width);
    default:
      return state;
  }
};

export default reducer;
