import * as actionTypes from "./actionTypes";
import { database, storage } from "../../firebase/firebase";
import profileImage from "../../assets/Images/chats/profile";

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
    dispatch(fetchChatContactsInit());

    database
      .ref()
      .child("chats")
      .once("value", (snapShot) => {
        if (!snapShot.exists()) {
          dispatch(fetchChatContactsSuccess(true, null, null));
        }
      });

    database
      .ref()
      .child("chats")
      .on("child_added", (snapShot) => {
        dispatch(fetchChatContactsInit());
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

          getProfileImage(userName).then((profilePic) => {
            chatSummary = {
              UID: snapShot.key,
              userName: userName,
              lastMessage: lastMessage,
              profilePic: profilePic,
            };

            existingChatNames.push(userName);
            chatContacts.push(chatSummary);
            chatContacts.reverse();
            dispatch(
              fetchChatContactsSuccess(false, chatContacts, existingChatNames)
            );
          });
        }
      });
  };
};

async function getProfileImage(userName) {
  let profilePic;
  await storage
    .ref()
    .child("userProfilePictures")
    .child(userName)
    .getDownloadURL()
    .then(
      (url) => (profilePic = url),
      (error) => (profilePic = profileImage)
    );

  return profilePic;
}

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
