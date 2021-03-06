import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";

import { database } from "../../../firebase/firebase";
import classes from "./ChatBox.css";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import ChatMessage from "../../../components/Chat/ChatMessage/ChatMessage";
import Offer from "../Offer/Offer";
import { faWindowClose, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as actions from "../../../store/actions/index";
class ChatBox extends Component {
  state = {
    message: "",
    errorMessage: "",
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
        .update({ chatHistory: chatHistory })
        .catch((error) => {
          let message;
          switch (error.getCode()) {
            case -24: //NETWORK_ERROR
            case -4: //DISCONNECTED
              message =
                "Oops, please check your network connection and try again!";
              break;
            case -10: //UNAVAILABLE
            case -2: //OPERATION_FAILED
              message =
                "Oops, the service is currently unavailable. Please try again later!";
              break;
            default:
              message = "Oops, something went wrong. Please try again later!";
          }
          this.setState({
            errorMessage: message,
          });
        });

      this.setState({
        message: "",
      });
    }
  };

  searchProfileHandler = (displayName) => {
    const pathName = this.props.history.location.pathname;
    let formattedDisplayName = displayName.toLowerCase().split(" ").join("");
    this.props.setFilterProfile(formattedDisplayName);
    const query =
      "/searchProfile?from=" + pathName + "&&profile=" + formattedDisplayName;
    this.props.history.push(query);
  };

  render() {
    return this.state.errorMessage ? (
      <div className={classes.ChatBox}>
        <p style={{ color: "red", fontSize: "small" }}>
          {this.state.errorMessage}
        </p>
      </div>
    ) : (
      <div className={classes.ChatBox}>
        <div className={classes.ChatBoxHeader} style={{ cursor: "pointer" }}>
          <div
            className={classes.DisplayName}
            onClick={() => this.searchProfileHandler(this.props.recipient)}
          >
            <div className={classes.tooltip}>
              <span className={classes.tooltiptext}>Click to go profile</span>
              <h4>{this.props.recipient}</h4>
            </div>
          </div>
          {this.props.smallScreen ? (
            <div onClick={this.props.onClick} className={classes.goBackButton}>
              <FontAwesomeIcon icon={faWindowClose} />
            </div>
          ) : null}
        </div>
        <div style={{ position: "relative" }}>
          <Offer
            fullChat={this.props.fullChat}
            fullChatUID={this.props.fullChatUID}
          />
        </div>
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
                <Button onClick={this.sendMessageHandler}>
                  {
                    <FontAwesomeIcon
                      icon={faPaperPlane}
                      style={{ paddingRight: "5px" }}
                    />
                  }
                </Button>
              </span>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFilterProfile: (displayName) =>
      dispatch(actions.setFilterProfile(displayName)),
    setFilterTermForListing: (filterType, object) =>
      dispatch(actions.setFilterListings(filterType, object)),
  };
};

export default connect(null, mapDispatchToProps)(ChatBox);
