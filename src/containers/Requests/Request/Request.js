import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Button from "../../../components/UI/Button/Button";
import classes from "./Request.css";
import { database } from "../../../firebase/firebase";
import Modal from "../../../components/UI/Modal/Modal";

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
    // this.props.dispatchSetInterestedListing(this.props.expandedListing);
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
      <div style={{ flexDirection: "column" }}>
        <div className={classes.Textbook}>
          <p>
            {this.props.module}:《{this.props.textbook}》
          </p>
        </div>
        <div>
          <ul className={classes.Description}>
            <li>
              <b>Posted by: </b>
              {this.props.userId}
            </li>
            <li>
              <b>Posted on: </b>
              {this.props.date}
            </li>
          </ul>
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

    return (
      <React.Fragment>
        <div className={classes.Request}>
          {request}
          {isOwner ? (
            <Button onClick={this.askUserToDelete}>Delete</Button>
          ) : (
            <Link
              to={{
                pathname: "/chats",
                search: "?" + this.props.displayName,
              }}
            >
              <Button onClick={() => this.onChatHandler(this.props.userId)}>
                Chat
              </Button>
            </Link>
          )}
        </div>
        {this.state.askUserToDelete ? askForConfirmation : null}
        {this.state.confirmDelete ? confirmDeleteModal : null}
      </React.Fragment>
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

// const mapDispatchToProps = (dispatch) => {
//   return {
//     dispatchExpandedListing: (identifier) =>
//       dispatch(actions.fetchExpandedListing(identifier)),
//   };
// };

export default connect(mapStateToProps)(Request);
