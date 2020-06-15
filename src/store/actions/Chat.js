import * as actionTypes from "./actionTypes";
import { database } from "../../firebase/firebase";

export const fetchChatContactsInit = () => {
  return {
    type: actionTypes.FETCH_CHAT_CONTACTS_INIT,
  };
};

export const fetchFullChatInit = () => {
  return {
    type: actionTypes.FETCH_FULL_CHAT_INIT,
  };
};

export const fetchChatContactsSuccess = (chatContacts, existingChatNames) => {
  return {
    type: actionTypes.FETCH_CHAT_CONTACTS_SUCCESS,
    chatContacts: chatContacts,
    existingChatNames: existingChatNames,
  };
};

export const fetchFullChatInitSuccess = (fullChat, fullChatUID, recipient) => {
  return {
    type: actionTypes.FETCH_FULL_CHAT_INIT_SUCCESS,
    fullChat: fullChat,
    fullChatUID: fullChatUID,
    recipient: recipient,
  };
};

export const fetchFullChatHistorySuccess = (fullChat) => {
  return {
    type: actionTypes.FETCH_FULL_CHAT_HISTORY_SUCCESS,
    fullChat: fullChat,
  };
};

export const updateChatContacts = (updatedChatNames, updatedChatContacts) => {
  return {
    type: actionTypes.UPDATE_CHAT_CONTACTS,
    updatedChatNames: updatedChatNames,
    updatedChatContacts: updatedChatContacts,
  };
};

export const resetRecipient = () => {
  return {
    type: actionTypes.RESET_RECIPIENT,
  };
};

export const fetchChats = () => {
  return (dispatch, getState) => {
    dispatch(fetchChatContactsInit());
    database
      .ref()
      .child("chats")
      .on("child_added", (snapShot) => {
        if (
          snapShot.val().userA === getState().auth.displayName ||
          snapShot.val().userB === getState().auth.displayName
        ) {
          const existingChatNames = getState().chat.existingChatNames;
          const chatContacts = getState().chat.chatContacts;
          let lastMessage = "";
          let chatSummary = null;
          let userName = snapShot.val().userA;

          if (snapShot.val().chatHistory) {
            lastMessage = snapShot.val().chatHistory[
              snapShot.val().chatHistory.length - 1
            ].content;
          }
          if (userName === getState().auth.displayName) {
            userName = snapShot.val().userB;
          }
          chatSummary = {
            UID: snapShot.key,
            userName: userName,
            lastMessage: lastMessage,
          };
          existingChatNames.push(userName);
          chatContacts.push(chatSummary);
          dispatch(fetchChatContactsSuccess(chatContacts, existingChatNames));
        }
      });
  };
};

/**
 * If a chat has no chat history, remove specific chat from firebase and update contact list in chat redux store
 * Reset recipient in chat redux store
 */
export const chatCleanUp = () => {
  return (dispatch, getState) => {
    const fullChat = getState().chat.fullChat;
    const fullChatUID = getState().chat.fullChatUID;
    const recipient = getState().chat.recipient;
    let updatedChatNames = Object.assign([], getState().chat.existingChatNames);
    const chatContacts = getState().chat.chatContacts;
    if (fullChat.length < 1 && fullChatUID) {
      const updatedChatContacts = chatContacts.filter((contact) => {
        if (contact.userName !== recipient) {
          return true;
        }
        updatedChatNames = updatedChatNames.filter(
          (name) => name !== recipient
        );
        return false;
      });

      database
        .ref()
        .child("chats")
        .child(fullChatUID)
        .remove()
        .then((response) => {
          dispatch(updateChatContacts(updatedChatNames, updatedChatContacts));
        });
    } else {
      dispatch(resetRecipient());
    }
  };
};

export const fetchFullChat = (chatUID) => {
  return (dispatch, getState) => {
    dispatch(fetchFullChatInit());
    database
      .ref()
      .child("chats")
      .child(chatUID)
      .on("value", (snapShot) => {
        if (snapShot.exists()) {
          let fullChat = snapShot.val().chatHistory;
          if (!fullChat) {
            fullChat = [];
          }
          let recipient = snapShot.val().userA;
          if (recipient === getState().auth.displayName) {
            recipient = snapShot.val().userB;
          }
          if (getState().chat.fullChatUID !== snapShot.key) {
            dispatch(fetchFullChatInitSuccess(fullChat, chatUID, recipient));
          } else {
            dispatch(fetchFullChatHistorySuccess(fullChat));
          }
        }
      });
  };
};
