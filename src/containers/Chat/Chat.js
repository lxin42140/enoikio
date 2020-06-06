import React, { Component } from "react";
import { connect } from "react-redux";

import classes from "./Chat.css";
import Contact from "./Contact/Contact";
import ChatBox from "./ChatBox/ChatBox";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";

class Chat extends Component {
  render() {
    return (
      <div className={classes.Chat}>
        <div className={classes.ChatContacts}>
          {this.props.fetchChatContactsLoading ? (
            <Spinner />
          ) : (
            this.props.chatContacts.map((contact) => {
              return (
                <Contact
                  key={contact.userName}
                  userName={contact.userName}
                  lastMessage={contact.lastMessage}
                  onClick={() => this.props.dispatchFetchFullChat(contact.UID)}
                />
              );
            })
          )}
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
    chatContacts: state.chat.chatContacts,
    fetchChatContactsLoading: state.chat.fetchChatContactsLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchFetchFullChat: (chatUID) =>
      dispatch(actions.fetchFullChat(chatUID)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
