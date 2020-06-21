import React, { Component } from "react";
import moment from "moment";

import { database } from "../../../firebase/firebase";
import classes from "./ChatBox.css";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import ChatMessage from "../../../components/Chat/ChatMessage/ChatMessage";
import Offer from "../Offer/Offer";
import Request from "../Offer/Request";
import { connect } from 'react-redux';

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
      let message = {
        content: this.state.message,
        sender: this.props.displayName,
        type: "NORMAL",
        date: moment().format("DD/MM/YYYY"),
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
        {this.props.interestedListing ? 
        <Offer
          fullChat={this.props.fullChat}
          fullChatUID={this.props.fullChatUID}
        /> : 
        <Request
          fullChat={this.props.fullChat}
          fullChatUID={this.props.fullChatUID}
        />}
        <div className={classes.ChatBoxMessages}>
          {this.props.fullChatLoading ? (
            <Spinner />
          ) : (
            this.props.fullChat.map((message) => (
              <ChatMessage
                key={message.date + " " + message.time}
                type={message.type}
                displayName={message.sender}
                message={message.content}
                date={message.date}
                time={message.time}
                currentUser={this.props.displayName}
                photoURL={this.props.photoURL}
                recipientProfilePic={this.props.recipientProfilePic}
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
                placeholder="Type your message here..."
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
    interestedListing: state.listing.interestedListing,
    resolveRequest: state.request.resolve,
  }
}

export default connect(mapStateToProps)(ChatBox);
