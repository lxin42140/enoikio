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

export const fetchChatContactsSuccess = (
  isEmpty,
  chatContacts,
  existingChatNames
) => {
  if (isEmpty) {
    return {
      type: actionTypes.FETCH_CHAT_CONTACTS_SUCCESS,
      isEmpty: isEmpty,
    };
  } else {
    return {
      type: actionTypes.FETCH_CHAT_CONTACTS_SUCCESS,
      isEmpty: isEmpty,
      chatContacts: chatContacts,
      existingChatNames: existingChatNames,
    };
  }
};

export const fetchFullChatInitSuccess = (
  fullChat,
  fullChatUID,
  recipient,
  lastMessage,
  profilePic
) => {
  return {
    type: actionTypes.FETCH_FULL_CHAT_INIT_SUCCESS,
    fullChat: fullChat,
    fullChatUID: fullChatUID,
    recipient: recipient,
    lastMessage: lastMessage,
    profilePic: profilePic,
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
    const displayName = getState().auth.displayName;
    dispatch(fetchChatContactsInit());

    database
      .ref()
      .child("chats")
      .orderByChild("userA")
      .equalTo(displayName)
      .once("value", (snapShot) => {
        if (!snapShot.exists()) {
          dispatch(fetchChatContactsSuccess(true, null, null));
        }
      });

    database
      .ref()
      .child("chats")
      .on("child_added", (snapShot) => {
        if (
          snapShot.val().userA === getState().auth.displayName ||
          snapShot.val().userB === getState().auth.displayName
        ) {
          dispatch(fetchChatContactsInit());
          let existingChatNames = getState().chat.existingChatNames;
          let chatContacts = getState().chat.chatContacts;
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

          let chatKey = snapShot.key;
          let formattedUserName = userName.split(" ").join("").toLowerCase();

          database
            .ref()
            .child("users")
            .orderByChild("formattedDisplayName")
            .equalTo(formattedUserName)
            .on("value", (snapShot) => {
              snapShot.forEach((data) => {
                const index = existingChatNames.indexOf(userName);
                let deletedIndex = null;
                let deletedLastMessage = "";
                if (index > -1) {
                  chatContacts = chatContacts.filter((chat, index) => {
                    if (chat.userName === userName) {
                      deletedIndex = index;
                      deletedLastMessage = chat.lastMessage;
                      return false;
                    }
                    return true;
                  });
                } else {
                  existingChatNames.push(userName);
                }

                if (deletedIndex) {
                  lastMessage = deletedLastMessage;
                }

                chatSummary = {
                  UID: chatKey,
                  userName: userName,
                  lastMessage: lastMessage,
                  profilePic: data.val().photoURL,
                };

                if (deletedIndex) {
                  chatContacts.splice(deletedIndex, 0, chatSummary);
                } else {
                  chatContacts.push(chatSummary);
                  chatContacts.reverse();
                }

                dispatch(
                  fetchChatContactsSuccess(
                    false,
                    chatContacts,
                    existingChatNames
                  )
                );
              });
            });
        }
      });
  };
};

export const fetchFullChat = (chatUID, profilePic) => {
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
            fetchFullChatInitSuccess(
              fullChat,
              chatUID,
              recipient,
              lastMessage,
              profilePic
            )
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
