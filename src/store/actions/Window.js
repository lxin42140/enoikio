import * as actionTypes from "./actionTypes";

export const setWindowWidth = (width) => {
  return {
    type: actionTypes.SET_WINDOW_WIDTH,
    width: width,
  };
};
