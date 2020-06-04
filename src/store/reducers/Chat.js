import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  chatContacts: [],
  existingChatNames: [],
  fullChat: [],
  fullChatUID: "",
  initialLoad: true,
  fullChatLoading: false,
  recipient: "",
};

const fetchChatContactsInit = (state, action) => {
  return updateObject(state, {
    initialLoad: false,
  });
};

const fetchChatContactsSuccess = (state, action) => {
  return updateObject(state, {
    chatContacts: action.chatContacts,
    existingChatNames: action.existingChatNames,
  });
};

const fetchFullChatInit = (state, action) => {
  return updateObject(state, { fullChatLoading: true });
};

const fetchFullChatInitSuccess = (state, action) => {
  return updateObject(state, {
    fullChat: action.fullChat,
    fullChatUID: action.fullChatUID,
    fullChatLoading: false,
    recipient: action.recipient,
  });
};

const fetchFullChatHistorySuccess = (state, action) => {
  return updateObject(state, {
    fullChat: action.fullChat,
    fullChatLoading: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CHAT_CONTACTS_INIT:
      return fetchChatContactsInit(state, action);
    case actionTypes.FETCH_CHAT_CONTACTS_SUCCESS:
      return fetchChatContactsSuccess(state, action);
    case actionTypes.FETCH_FULL_CHAT_INIT:
      return fetchFullChatInit(state, action);
    case actionTypes.FETCH_FULL_CHAT_INIT_SUCCESS:
      return fetchFullChatInitSuccess(state, action);
    case actionTypes.FETCH_FULL_CHAT_HISTORY_SUCCESS:
      return fetchFullChatHistorySuccess(state, action);
    default:
      return state;
  }
};

export default reducer;
