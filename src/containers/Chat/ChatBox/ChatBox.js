import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

import classes from "./ChatBox.css";
import ChatMessage from "../ChatMessage/ChatMessage";
import Button from "../../../components/UI/Button/Button";
import { database } from "../../../firebase/firebase";

class ChatBox extends Component {
  state = {
    chats: [],
    message: "",
    chatListUID: "",
  };

  componentDidUpdate() {
    if (
      this.props.chatUID !== "" &&
      this.state.chatListUID !== this.props.chatUID
    ) {
      database
        .ref()
        .child("chats")
        .child(this.props.chatUID)
        .on("value", (snapShot) => {
          if (this.state.chatListUID === "") {
            this.setState({
              chats: snapShot.val().chatHistory,
              chatListUID: this.props.chatUID,
            });
          } else {
            this.setState({
              chats: snapShot.val().chatHistory,
            });
          }
        });
      this.scrollToBottom();
    } else {
      this.scrollToBottom();
    }
  }

  componentDidMount() {
    // const UID = "userA" + "userB";
    // const UID_TWO = "userB" + "userA";
    // const CHAT_REF = database.ref().child("chats");
    // CHAT_REF.orderByChild("UID")
    //   .equalTo(UID)
    //   .on("value", (snapShot) => {
    //     snapShot.forEach((data) => {
    //       if (this.state.chatListUID === "") {
    //         this.setState({
    //           chats: data.val().chatHistory,
    //           chatListUID: data.key,
    //         });
    //       } else {
    //         this.setState({
    //           chats: data.val().chatHistory,
    //         });
    //       }
    //     });
    //   });
    // CHAT_REF.orderByChild("UID")
    //   .equalTo(UID_TWO)
    //   .on("value", (snapShot) => {
    //     snapShot.forEach((data) => {
    //       if (this.state.chatListUID === "") {
    //         this.setState({
    //           chats: data.val().chatHistory,
    //           chatListUID: data.key,
    //         });
    //       } else {
    //         this.setState({
    //           chats: data.val().chatHistory,
    //         });
    //       }
    //     });
    //   });
    // this.scrollToBottom();
  }

  scrollToBottom() {
    this.element.scrollIntoView({ behavior: "smooth" });
  }

  inputChangeHandler = (event) => {
    this.setState({
      message: event.target.value,
    });
  };

  inputOnKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.sendMessageHandler();
    }
  };

  sendMessageHandler = (event) => {
    if (this.state.message !== "") {
      const message = {
        content: this.state.message,
        sender: this.props.displayName,
        date: moment().format("DD-MM-YYYY"),
        time: moment().format("HH:mm:ss"),
      };

      const chatHistory = Object.assign([], this.state.chats);
      chatHistory.push(message);

      if (this.state.chats.length < 1) {
        const UID = "userA" + "userB";
        const chatRef = database.ref().child("chats");
        const pushMessageKey = chatRef.push().key;
        chatRef.child(pushMessageKey).set({
          userA: this.props.displayName,
          userB: "userB",
          chatHistory: chatHistory,
          UID: UID,
        });
        this.setState({
          message: "",
          chatListUID: pushMessageKey,
        });
      } else {
        database
          .ref()
          .child("chats/" + this.state.chatListUID)
          .update({ chatHistory: chatHistory });
        this.setState({
          message: "",
        });
      }
    }
  };

  render() {
    return (
      <div className={classes.ChatBox}>
        <div className={classes.ChatBoxHeader}>
          <h4>Private Chat</h4>
        </div>
        <div className={classes.ChatBoxMessages}>
          {this.state.chats.length < 1 ? (
            <p style={{ color: "#aab8c2" }}>Please select to send a message</p>
          ) : (
            this.state.chats.map((message) => (
              <ChatMessage
                key={message.date + " " + message.time}
                displayName={message.sender}
                message={message.content}
                timeStamp={message.time}
                currentUser={this.props.displayName}
              />
            ))
          )}
          <div
            ref={(element) => {
              this.element = element;
            }}
          />
        </div>
        <div className={classes.ChatBoxFooter}>
          {this.state.chatListUID === "" ? null : (
            <React.Fragment>
              <input
                className={classes.input}
                type="text"
                value={this.state.message}
                placeholder="Enter your message here"
                onChange={this.inputChangeHandler}
                onKeyDown={this.inputOnKeyDown}
              />
              <span style={{ paddingLeft: "15px" }}>
                <Button onClick={this.sendMessageHandler}>Send</Button>
              </span>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    token: state.auth.token,
    uid: state.auth.userId,
    displayName: state.auth.displayName,
  };
};

export default connect(mapStateToProps)(ChatBox);
