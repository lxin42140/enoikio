import React, { Component } from "react";
import { connect } from "react-redux";
import { database } from "../../../firebase/firebase";
import { Link } from "react-router-dom";
import Modal from "../../../components/UI/Modal/Modal";
import * as actions from "../../../store/actions/index";

import Button from "../../../components/UI/Button/Button";
import classes from "./Request.css";

class Request extends Component {
  state = {
    askUserToDelete: false,
    confirmDelete: false,
  };

  cancelConfirmation = () => {
    this.setState({ askUserToDelete: false });
  };

  askUserToDelete = () => {
    this.setState({ askUserToDelete: true });
  };

  deleteRequest = () => {
    console.log(this.props.key);
    database.ref().child("requests").child(this.props.node).remove();

    this.setState({ confirmDelete: true, askUserToDelete: false });
  };

  onChatHandler = (chatDisplayName) => {
    this.props.dispatchResolveRequest(this.props.request);
    if (this.props.existingChatNames.indexOf(chatDisplayName) < 0) {
      const UID = this.props.displayName + chatDisplayName;
      const chatRef = database.ref().child("chats");
      const pushMessageKey = chatRef.push().key;
      chatRef.child(pushMessageKey).set({
        userA: this.props.displayName,
        userB: chatDisplayName,
        UID: UID,
      });
    }
  };

  render() {
    let request = (
      <div className={classes.Content}>
        <div className={classes.Textbook}>
          <p style={{ fontSize: "14px", color: "black" }}>
            {this.props.module}:《{this.props.textbook}》
          </p>
        </div>
        <div className={classes.Details}>
          <p>
            <b>Request type: </b> <br />
            {this.props.requestType}
          </p>
        </div>
        <div className={classes.Details}>
          <p>
            <b>Posted by: </b> <br />
            {this.props.userId}
          </p>
        </div>
        <div className={classes.Details}>
          <p>
            <b>Posted on: </b> <br />
            {this.props.date}
          </p>
        </div>
      </div>
    );

    const askForConfirmation = (
      <Modal show={this.state.askUserToDelete}>
        <div>
          <p>Confirm delete request?</p>
          <p>This action cannot be undone.</p>
          <Button onClick={this.cancelConfirmation}>Go back</Button>
          <Button onClick={this.deleteRequest}>Delete</Button>
        </div>
      </Modal>
    );

    const confirmDeleteModal = (
      <Modal show={this.state.confirmDelete}>
        Listing deleted.
        <Link to="/">
          <Button>Home</Button>
        </Link>
      </Modal>
    );

    const isOwner = this.props.displayName === this.props.userId;

    let button;

    if (!this.props.isAuthenticated) {
      button = (
        <Link to="/auth">
          <Button>Chat</Button>
        </Link>
      );
    } else {
      if (isOwner) {
        button = <Button onClick={this.askUserToDelete}>Delete</Button>
      } else {
        button = (
          <Link
            to={{
              pathname: "/chats",
            }}
          >
            <Button onClick={() => this.onChatHandler(this.props.userId)}>
              Chat
              </Button>
          </Link>
        );
      }
    }

    return (
      <div className={classes.Requests}>
        <div className={classes.Request}>
          {request}
          {button}
        </div>
        {this.state.askUserToDelete ? askForConfirmation : null}
        {this.state.confirmDelete ? confirmDeleteModal : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.user !== null,
    displayName: state.auth.displayName,
    existingChatNames: state.chat.existingChatNames,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchResolveRequest: (request) =>
      dispatch(actions.resolveRequest(request)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Request);
