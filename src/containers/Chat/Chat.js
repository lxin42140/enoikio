import React, { Component } from "react";
import { connect } from "react-redux";

import { database } from "../../firebase/firebase";
import classes from "./Chat.css";
import Contact from "./Contact/Contact";
import ChatBox from "./ChatBox/ChatBox";

class Chat extends Component {
  state = {
    chatContacts: [],
    chatUID: "",
  };

  componentDidMount() {
    database
      .ref()
      .child("chats")
      .on("child_added", (snapShot) => {
        if (
          snapShot.val().userA === this.props.displayName ||
          snapShot.val().userB === this.props.displayName
        ) {
          const lastMessage = snapShot.val().chatHistory[
            snapShot.val().chatHistory.length - 1
          ].content;
          let chatSummary = null;
          if (snapShot.val().userA !== this.props.displayName) {
            chatSummary = {
              UID: snapShot.key,
              userName: snapShot.val().userA,
              lastMessage: lastMessage,
            };
          } else {
            chatSummary = {
              UID: snapShot.key,
              userName: snapShot.val().userB,
              lastMessage: lastMessage,
            };
          }
          const chatContacts = Object.assign([], this.state.chatContacts);
          chatContacts.push(chatSummary);
          this.setState({
            chatContacts: chatContacts,
          });
        }
      });

    // database
    //   .ref()
    //   .child("chats")
    //   .orderByChild("userA")
    //   .equalTo(this.props.displayName)
    //   .once("value", (snapShot) => {
    //     if (snapShot.exists()) {
    //       snapShot.forEach((data) => {
    //         const lastMessage = data.val().chatHistory[
    //           data.val().chatHistory.length - 1
    //         ].content;
    //         let chatSummary;
    //         if (data.val().userA !== this.props.displayName) {
    //           chatSummary = {
    //             UID: data.key,
    //             userName: data.val().userA,
    //             lastMessage: lastMessage,
    //           };
    //         } else {
    //           chatSummary = {
    //             UID: data.key,
    //             userName: data.val().userB,
    //             lastMessage: lastMessage,
    //           };
    //         }
    //         const chatContacts = Object.assign([], this.state.chatContacts);
    //         chatContacts.push(chatSummary);
    //         this.setState({
    //           chatContacts: chatContacts,
    //         });
    //       });
    //     }
    //   });

    // database
    //   .ref()
    //   .child("chats")
    //   .orderByChild("userB")
    //   .equalTo(this.props.displayName)
    //   .once("value", (snapShot) => {
    //     if (snapShot.exists()) {
    //       snapShot.forEach((data) => {
    //         const lastMessage = data.val().chatHistory[
    //           data.val().chatHistory.length - 1
    //         ].content;
    //         let chatSummary;
    //         if (data.val().userA !== this.props.displayName) {
    //           chatSummary = {
    //             UID: data.key(),
    //             userName: data.val().userA,
    //             lastMessage: lastMessage,
    //           };
    //         } else {
    //           chatSummary = {
    //             UID: data.key(),
    //             userName: data.val().userB,
    //             lastMessage: lastMessage,
    //           };
    //         }
    //         const chatContacts = Object.assign([], this.state.chatContacts);
    //         chatContacts.push(chatSummary);
    //         this.setState({
    //           chatContacts: chatContacts,
    //         });
    //       });
    //     }
    //   });
  }

  showFullChatHandler = (UID) => {
    this.setState({
      chatUID: UID,
    });
  };

  render() {
    return (
      <div className={classes.Chat}>
        <div className={classes.ChatContacts}>
          {this.state.chatContacts.map((contact) => {
            return (
              <Contact
                key={contact.userName}
                userName={contact.userName}
                lastMessage={contact.lastMessage}
                onClick={() => this.showFullChatHandler(contact.UID)}
              />
            );
          })}

          {/* <div className={classes.Search}>
            <input
              type="text"
              className={classes.SearchField}
              value="Search contacts..."
            />
          </div> */}
          <h4 style={{ color: "#444" }}>Chat Contacts</h4>
        </div>
        <div className={classes.ChatBox}>
          <ChatBox chatUID={this.state.chatUID} />
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
