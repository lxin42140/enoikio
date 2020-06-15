import React, { Component } from "react";
import { connect } from "react-redux";

import classes from "./Chat.css";
import Contact from "../../components/Chat/Contact/Contact";
import ChatBox from "./ChatBox/ChatBox";
import * as actions from "../../store/actions/index";

class Chat extends Component {
  state = {
    initialLoad: true,
  };

  componentWillUnmount() {
    this.props.dispatchChatCleanUp(
      this.props.fullChat,
      this.props.fullChatUID,
      this.props.recipient,
      this.props.chatContacts
    );
    this.props.dispatchClearInterestedListing();
  }

  onSelectChatHandler = (ChatUID) => {
    this.props.dispatchFetchFullChat(ChatUID);
    this.setState({
      initialLoad: false,
    });
  };

  render() {
    return (
      <div className={classes.Chat}>
        <div className={classes.ChatContacts}>
          {this.props.chatContacts.map((contact) => {
            return (
              <Contact
                key={contact.userName}
                userName={contact.userName}
                lastMessage={contact.lastMessage}
                recipient={this.props.recipient}
                onClick={() => this.onSelectChatHandler(contact.UID)}
              />
            );
          })}
          <h4 style={{ color: "#444" }}>Chat Contacts</h4>
        </div>
        <div className={classes.ChatBox}>
          {this.state.initialLoad && this.props.chatContacts.length < 1 ? (
            <h3 style={{ color: "#aab8c2" }}>
              Make an offer to start chatting.
            </h3>
          ) : this.state.initialLoad ? (
            <h3 style={{ color: "#aab8c2" }}>
              Select a conversation to read from the list on the left.
            </h3>
          ) : (
            <ChatBox
              fullChatLoading={this.props.fullChatLoading}
              fullChat={this.props.fullChat}
              fullChatUID={this.props.fullChatUID}
              displayName={this.props.displayName}
              recipient={this.props.recipient}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    chatContacts: state.chat.chatContacts,
    interestedListing: state.listing.interestedListing,
    displayName: state.auth.displayName,

    recipient: state.chat.recipient,
    fullChat: state.chat.fullChat,
    fullChatUID: state.chat.fullChatUID,
    fullChatLoading: state.chat.fullChatLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchFetchFullChat: (chatUID) =>
      dispatch(actions.fetchFullChat(chatUID)),
    dispatchClearInterestedListing: () =>
      dispatch(actions.emptyInterestedListing()),
    dispatchChatCleanUp: (fullChat, fullChatUID, recipient, chatContacts) =>
      dispatch(
        actions.chatCleanUp(fullChat, fullChatUID, recipient, chatContacts)
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
