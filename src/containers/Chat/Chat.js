import React, { Component } from "react";
import { connect } from "react-redux";

import { database } from "../../firebase/firebase";
import classes from "./Chat.css";
import Contact from "./Contact/Contact";
import ChatBox from "./ChatBox/ChatBox";

class Chat extends Component {
  state = {
    chatContacts: [],
  };

  // database
  //   .ref()
  //   .child("chats")
  //   .on("child_added", (snapShot) => {
  //     if (
  //       snapShot.val().userA === this.state.displayName ||
  //       snapShot.val().userB === this.state.displayName
  //     ) {
  //       const lastMessage = snapShot.val().chatHistory[
  //         snapShot.val().chatHistory.length - 1
  //       ].content;
  //       let chatSummary = null;
  //       if (snapShot.val().userA !== this.state.displayName) {
  //         chatSummary = {
  //           userName: snapShot.val().userA,
  //           lastMessage: lastMessage,
  //         };
  //       } else {
  //         chatSummary = {
  //           userName: snapShot.val().userB,
  //           lastMessage: lastMessage,
  //         };
  //       }
  //       this.setState((prevState) => ({
  //         chatContacts: prevState.chatContacts.push(chatSummary),
  //       }));
  //     }
  //   });

  render() {
    return (
      <div className={classes.Chat}>
        <div className={classes.ChatContacts}>
          <Contact />
          <Contact />
          <Contact />
          <Contact />
          <Contact />
          <Contact />
          <Contact />
          <Contact />

          {/* <div className={classes.Search}>
            <input
              type="text"
              className={classes.SearchField}
              value="Search contacts..."
            />
          </div> */}
          <h4 style={{ color: "#aab8c2" }}>Chat Contacts</h4>
        </div>
        <div className={classes.ChatBox}>
          <ChatBox />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    token: state.auth.token,
    displayName: state.auth.displayName,
  };
};

export default connect(mapStateToProps)(Chat);
