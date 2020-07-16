import React, { Component } from "react";
import { connect } from "react-redux";

import classes from "./Chat.css";
import Contact from "../../components/Chat/Contact/Contact";
import ChatBox from "./ChatBox/ChatBox";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";

class Chat extends Component {
  state = {
    initialLoad: true,
    showMessages: false,
  };

  componentWillUnmount() {
    this.props.dispatchChatCleanUp(this.props.chatContacts);
    this.props.dispatchClearInterestedListing();
  }

  onSelectChatHandler = (ChatUID, profilePic) => {
    this.props.dispatchFetchFullChat(ChatUID, profilePic);
    this.setState({
      initialLoad: false,
      showMessages: true,
    });
  };

  onGoBackHandler = () => {
    this.setState({ showMessages: false });
  };

  render() {
    const chatContacts = (
      <div className={classes.ChatContacts}>
        {this.props.fetchChatContactsLoading ? (
          <Spinner />
        ) : this.props.isEmpty ? null : (
          this.props.chatContacts.map((contact) => {
            return (
              <Contact
                key={contact.userName}
                profilePic={contact.profilePic}
                userName={contact.userName}
                lastMessage={contact.lastMessage}
                recipient={this.props.recipient}
                onClick={() =>
                  this.onSelectChatHandler(contact.UID, contact.profilePic)
                }
              />
            );
          })
        )}
        <h4 style={{ color: "#444" }}>Chat Contacts</h4>
      </div>
    );

    let chatMessages;

    if (this.props.windowWidth > 700) {
      chatMessages = (
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
              recipientProfilePic={this.props.recipientProfilePic}
              photoURL={this.props.photoURL}
              history={this.props.history}
            />
          )}
        </div>
      );
    } else {
      chatMessages = (
        <div className={classes.ChatBox}>
          <ChatBox
            fullChatLoading={this.props.fullChatLoading}
            fullChat={this.props.fullChat}
            fullChatUID={this.props.fullChatUID}
            displayName={this.props.displayName}
            recipient={this.props.recipient}
            recipientProfilePic={this.props.recipientProfilePic}
            photoURL={this.props.photoURL}
            smallScreen
            onClick={this.onGoBackHandler}
            history={this.props.history}
          />
        </div>
      );
    }

    return this.props.windowWidth <= 700 ? (
      <div className={classes.Chat}>
        {this.state.showMessages ? null : chatContacts}
        {this.state.showMessages ? chatMessages : null}
      </div>
    ) : (
      <div className={classes.Chat}>
        {chatContacts}
        {chatMessages}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    displayName: state.auth.displayName,
    photoURL: state.auth.photoURL,

    interestedListing: state.listing.interestedListing,

    chatContacts: state.chat.chatContacts,
    fetchChatContactsLoading: state.chat.fetchChatContactsLoading,
    isEmpty: state.chat.isEmpty,

    recipient: state.chat.recipient,
    recipientProfilePic: state.chat.recipientProfilePic,

    fullChat: state.chat.fullChat,
    fullChatUID: state.chat.fullChatUID,
    fullChatLoading: state.chat.fullChatLoading,

    windowWidth: state.window.width,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchFetchFullChat: (chatUID, profilePic) =>
      dispatch(actions.fetchFullChat(chatUID, profilePic)),
    dispatchClearInterestedListing: () =>
      dispatch(actions.emptyInterestedListing()),
    dispatchChatCleanUp: (chatContacts) =>
      dispatch(actions.chatCleanUp(chatContacts)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
