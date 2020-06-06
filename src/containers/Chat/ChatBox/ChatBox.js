import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

import classes from "./ChatBox.css";
import Button from "../../../components/UI/Button/Button";
import { database } from "../../../firebase/firebase";
import * as actions from "../../../store/actions/index";
import Spinner from "../../../components/UI/Spinner/Spinner";
import ChatMessage from "../../../components/Chat/ChatMessage/ChatMessage";

class ChatBox extends Component {
  state = {
    message: "",
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentDidMount() {
    this.scrollToBottom();
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

      const chatHistory = Object.assign([], this.props.fullChat);
      chatHistory.push(message);

      database
        .ref()
        .child("chats/" + this.props.fullChatUID)
        .update({ chatHistory: chatHistory });
      this.setState({
        message: "",
      });
    }
  };

  render() {
    return (
      <div className={classes.ChatBox}>
        <div className={classes.ChatBoxHeader}>
          <h4>{this.props.recipient}</h4>
        </div>
        <div className={classes.ChatBoxMessages}>
          {this.props.fullChat.length < 1 ? (
            <p style={{ color: "#aab8c2" }}>Please select to send a message</p>
          ) : this.props.fullChatLoading ? (
            <Spinner />
          ) : (
            this.props.fullChat.map((message) => (
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
          {this.props.fullChatUID === "" ? null : (
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
    fullChat: state.chat.fullChat,
    fullChatUID: state.chat.fullChatUID,
    fullChatLoading: state.chat.fullChatLoading,
    recipient: state.chat.recipient,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchFetchFullChat: (chatUID) =>
      dispatch(actions.fetchFullChat(chatUID)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatBox);
