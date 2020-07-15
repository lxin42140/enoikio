import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  width: window.innerWidth,
  showSideBar: false,
};

const setWindowWidth = (state, width) => {
  return updateObject(state, {
    width: width,
  });
};

const toggleSideBar = (state, action) => {
  return updateObject(state, {
    showSideBar: !state.showSideBar
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_WINDOW_WIDTH:
      return setWindowWidth(state, action.width);
    case actionTypes.TOGGLE_SIDE_BAR:
      return toggleSideBar(state, action);
    default:
      return state;
  }
};

export default reducer;
