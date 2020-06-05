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
          if (snapShot.val().chatHistory) {
            lastMessage = snapShot.val().chatHistory[
              snapShot.val().chatHistory.length - 1
            ].content;
          }
          if (snapShot.val().userA !== getState().auth.displayName) {
            chatSummary = {
              UID: snapShot.key,
              userName: snapShot.val().userA,
              lastMessage: lastMessage,
            };
            existingChatNames.push(snapShot.val().userA);
          } else {
            chatSummary = {
              UID: snapShot.key,
              userName: snapShot.val().userB,
              lastMessage: lastMessage,
            };
            existingChatNames.push(snapShot.val().userB);
          }
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
      });
  };
};

export const goToChat = (chatDisplayName) => {
  return (dispatch, getState) => {
    if (getState().chat.existingChatNames.indexOf(chatDisplayName) < 0) {
      const UID = getState().auth.displayName + chatDisplayName;
      const chatRef = database.ref().child("chats");
      const pushMessageKey = chatRef.push().key;
      chatRef.child(pushMessageKey).set({
        userA: getState().auth.displayName,
        userB: chatDisplayName,
        UID: UID,
      });
      console.log("push message key", pushMessageKey);
      dispatch(fetchFullChat(pushMessageKey));
    } else {
      database
        .ref()
        .child("chats")
        .orderByChild("userA")
        .equalTo(chatDisplayName)
        .once("value", (snapShot) => {
          snapShot.forEach((data) => dispatch(fetchFullChat(data.key)));
        });

      database
        .ref()
        .child("chats")
        .orderByChild("userB")
        .equalTo(chatDisplayName)
        .once("value", (snapShot) => {
          snapShot.forEach((data) => dispatch(fetchFullChat(data.key)));
        });
    }
  };
};
