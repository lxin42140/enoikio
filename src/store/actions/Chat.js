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

export const fetchFullChatInitSuccess = (
  fullChat,
  fullChatUID,
  recipient,
  lastMessage
) => {
  return {
    type: actionTypes.FETCH_FULL_CHAT_INIT_SUCCESS,
    fullChat: fullChat,
    fullChatUID: fullChatUID,
    recipient: recipient,
    lastMessage: lastMessage,
  };
};

export const removeEmptyChatContacts = (
  updatedChatNames,
  updatedChatContacts
) => {
  return {
    type: actionTypes.REMOVE_EMPTY_CHAT_CONTACTS,
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
          let lastMessage = "";

          if (fullChat) {
            lastMessage = fullChat[fullChat.length - 1].content;
          } else {
            fullChat = [];
          }

          let recipient = snapShot.val().userA;
          if (recipient === getState().auth.displayName) {
            recipient = snapShot.val().userB;
          }

          dispatch(
            fetchFullChatInitSuccess(fullChat, chatUID, recipient, lastMessage)
          );
        }
      });
  };
};

/**
 * If a chat has no chat history, remove specific chat from firebase and update contact list in chat redux store
 * Reset recipient in chat redux store
 */
export const chatCleanUp = (chatContacts) => {
  return (dispatch, getState) => {
    let updatedChatNames = getState().chat.existingChatNames;
    let updatedChatContacts = chatContacts;

    updatedChatContacts = updatedChatContacts.filter((chatSummary) => {
      if (chatSummary.lastMessage === "") {
        removeChat(chatSummary.UID);
        updatedChatNames = updatedChatNames.filter(
          (name) => name !== chatSummary.userName
        );
        return false;
      }
      return true;
    });

    if (chatContacts.length === updatedChatContacts.length) {
      dispatch(resetRecipient());
    } else {
      dispatch(removeEmptyChatContacts(updatedChatNames, updatedChatContacts));
    }
  };
};

async function removeChat(fullChatUID) {
  database.ref().child("chats").child(fullChatUID).remove();
}
