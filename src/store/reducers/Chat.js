import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  initialLoad: true,
  fetchChatContactsLoading: false,
  chatContacts: [],
  existingChatNames: [],
  fullChat: [],
  fullChatUID: "",
  fullChatLoading: false,
  recipient: "",
};

const fetchChatContactsInit = (state, action) => {
  return updateObject(state, {
    initialLoad: false,
    fetchChatContactsLoading: true,
  });
};

const fetchChatContactsSuccess = (state, action) => {
  return updateObject(state, {
    chatContacts: action.chatContacts,
    existingChatNames: action.existingChatNames,
    fetchChatContactsLoading: false,
  });
};

const fetchFullChatInit = (state, action) => {
  return updateObject(state, {
    fullChatLoading: true,
    fetchChatContactsLoading: false,
  });
};

const fetchFullChatInitSuccess = (state, action) => {
  const chatContacts = state.chatContacts.map((chatSummary) => {
    if (
      chatSummary.UID === action.fullChatUID &&
      chatSummary.lastMessage !== action.lastMessage
    ) {
      chatSummary.lastMessage = action.lastMessage;
      return chatSummary;
    }
    return chatSummary;
  });
  return updateObject(state, {
    fullChat: action.fullChat,
    fullChatUID: action.fullChatUID,
    fullChatLoading: false,
    recipient: action.recipient,
    chatContacts: chatContacts,
  });
};

const updateContacts = (state, action) => {
  return updateObject(state, {
    chatContacts: action.updatedChatContacts,
    existingChatNames: action.updatedChatNames,
    recipient: "",
  });
};

const resetRecipient = (state, action) => {
  return updateObject(state, {
    recipient: "",
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
    case actionTypes.REMOVE_EMPTY_CHAT_CONTACTS:
      return updateContacts(state, action);
    case actionTypes.RESET_RECIPIENT:
      return resetRecipient(state, action);
    default:
      return state;
  }
};

export default reducer;
