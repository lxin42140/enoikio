import React, { Component } from "react";
import { connect } from "react-redux";

import classes from "./ChatBox.css";
import ChatMessage from "./Chat/ChatMessage";
import Button from "../../components/UI/Button/Button";
import firebaseAxios from "../../firebaseAxios";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import { database } from "../../firebase/firebase";

class ChatBox extends Component {
  state = {
    chats: [],
    message: "",
    chatListUID: "",
  };

  componentDidMount() {
    const UID = "userA" + "userB";
    const UID_TWO = "userB" + "userA";
    const CHAT_REF = database.ref().child("chats");

    CHAT_REF.orderByChild("UID")
      .equalTo(UID)
      .on("value", (snapShot) => {
        snapShot.forEach((data) => {
          this.setState({
            chats: data.val().chatHistory,
            chatListUID: data.key,
          });
        });
      });

    CHAT_REF.orderByChild("UID")
      .equalTo(UID_TWO)
      .on("value", (snapShot) => {
        snapShot.forEach((data) => {
          this.setState({
            chats: data.val().chatHistory,
            chatListUID: data.key,
          });
        });
      });
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

  createTimeStamp = () => {
    let today = new Date();
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    let time = today.getHours() + ":" + today.getMinutes();
    return {
      date: date,
      time: time,
    };
  };

  sendMessageHandler = (event) => {
    if (this.state.message !== "") {
      const message = {
        content: this.state.message,
        sender: this.props.displayName,
        timeStamp: this.createTimeStamp(),
      };

      const chatHistory = Object.assign([], this.state.chats);
      chatHistory.push(message);

      if (this.state.chats.length < 1) {
        const UID = "userA" + "userB";
        const chatRef = database.ref().child("chats");
        const pushMessageKey = chatRef.push().key;
        chatRef.child(pushMessageKey).set({
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
          <h3>Private Chat</h3>
        </div>
        <div className={classes.ChatBoxMessages}>
          {this.state.chats.length < 1
            ? "No messages"
            : this.state.chats.map((message) => (
                <ChatMessage
                  key={message.timeStamp}
                  displayName={message.sender}
                  message={message.content}
                  timeStamp={message.timeStamp.time}
                  // currentUser={this.props.displayName}
                />
              ))}
        </div>
        <div className={classes.ChatBoxFooter}>
          <input
            className={classes.Input}
            type="text"
            value={this.state.message}
            placeholder="Enter your message here"
            onChange={this.inputChangeHandler}
            onKeyDown={this.inputOnKeyDown}
          />
          <span style={{ paddingLeft: "15px" }}>
            <Button onClick={this.sendMessageHandler}>Send</Button>
          </span>
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

export default connect(mapStateToProps)(
  withErrorHandler(ChatBox, firebaseAxios)
);
