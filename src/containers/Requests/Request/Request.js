import React, { Component } from "react";
import { connect } from "react-redux";
import {
  faComments,
  faTrash,
  faTimes,
  faHome,
  faExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  closePopup = () => {
    this.setState({
      askUserToDelete: false,
      confirmDelete: false,
    });
  };

  searchProfileHandler = (displayName) => {
    let formattedDisplayName = displayName.toLowerCase().split(" ").join("");
    if (
      this.props.displayName.toLowerCase().split(" ").join("") ===
      formattedDisplayName
    ) {
      this.props.setFilterTermForListing("displayName");
      this.props.history.push("/profile?from=/profile&&profile=personal");
    } else {
      this.props.setFilterProfile(formattedDisplayName);

      let query =
        "/searchProfile?from=" +
        this.props.history.location.pathname +
        "&&profile=" +
        formattedDisplayName;

      this.props.history.push(query);
    }
  };

  deleteRequest = () => {
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

    this.props.history.push("/chats");
  };

  render() {
    const defaultDetails = [classes.Details, classes.Default];

    const priorityColour = [classes.Details];
    if (this.props.priority === "urgent") {
      priorityColour.push(classes.Enabled);
    } else if (this.props.priority === "moderate") {
      priorityColour.push(classes.Moderate);
    } else {
      priorityColour.push(classes.Low);
    }

    const contentStyle = this.props.isProfile
      ? classes.ProfileContent
      : classes.Content;
    const textbookStyle = this.props.isProfile
      ? classes.ProfileTextbook
      : classes.Textbook;
    const infoStyle = this.props.isProfile ? classes.ProfileInfo : classes.Info;

    const request = (
      <div
        className={contentStyle}
        style={this.props.isProfile ? null : { cursor: "pointer" }}
        onClick={() =>
          this.props.isProfile
            ? null
            : this.searchProfileHandler(this.props.userId)
        }
      >
        <div className={textbookStyle}>
          <p>
            {this.props.module}:《{this.props.textbook}》
          </p>
        </div>

        <div className={infoStyle}>
          <p className={classes.Header}>Request type: </p>
          <p className={defaultDetails.join(" ")}>{this.props.requestType}</p>
        </div>

        <div className={infoStyle}>
          <p className={classes.Header}>Priority level: </p>
          <p className={priorityColour.join(" ")}>
            <span style={{ paddingRight: "2px" }}>
              {this.props.priority === "urgent" ? (
                <span style={{ color: "red" }}>
                  <FontAwesomeIcon icon={faExclamation} />
                  <FontAwesomeIcon icon={faExclamation} />
                  <FontAwesomeIcon icon={faExclamation} />
                </span>
              ) : this.props.priority === "moderate" ? (
                <span style={{ color: "orange" }}>
                  <FontAwesomeIcon icon={faExclamation} />
                  <FontAwesomeIcon icon={faExclamation} />
                </span>
              ) : (
                <span style={{ color: "green" }}>
                  <FontAwesomeIcon icon={faExclamation} />
                </span>
              )}
            </span>
            {this.props.priority}
          </p>
        </div>

        <div className={infoStyle}>
          <p className={classes.Header}>Posted by: </p>
          <p className={defaultDetails.join(" ")}>{this.props.userId}</p>
        </div>

        <div className={infoStyle}>
          <p className={classes.Header}>Posted on: </p>
          <p className={defaultDetails.join(" ")}>{this.props.date}</p>
        </div>
      </div>
    );

    const askForConfirmation = (
      <Modal show={this.state.askUserToDelete}>
        <div>
          <p>Confirm delete?</p>
          <p style={{ fontSize: "small", color: "red" }}>
            <i>This action cannot be undone!</i>
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button onClick={this.deleteRequest} btnType="Important">
              {
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{ paddingRight: "5px" }}
                />
              }
              Delete
            </Button>
            <span style={{ paddingRight: "3px" }} />
            <Button onClick={this.cancelConfirmation}>
              {
                <FontAwesomeIcon
                  icon={faTimes}
                  style={{ paddingRight: "5px" }}
                />
              }
              Go back
            </Button>
          </div>
        </div>
      </Modal>
    );

    const confirmDeleteModal = (
      <Modal show={this.state.confirmDelete}>
        <p style={{ color: "green", fontWeight: "bold" }}>Listing deleted</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            btnType="Important"
            onClick={() => this.props.history.push("/")}
          >
            {<FontAwesomeIcon icon={faHome} style={{ paddingRight: "5px" }} />}
            Home
          </Button>
          <span style={{ paddingRight: "3px" }} />
          <Button onClick={this.closePopup}>
            {<FontAwesomeIcon icon={faTrash} style={{ paddingRight: "5px" }} />}
            Close
          </Button>
        </div>
      </Modal>
    );

    const isOwner = this.props.displayName === this.props.userId;

    let button;

    if (!this.props.isAuthenticated) {
      button = (
        // <Link to="/auth">
        <Button onClick={() => this.props.history.push("/auth")}>
          {
            <FontAwesomeIcon
              icon={faComments}
              style={{ paddingRight: "5px" }}
            />
          }
        </Button>
        // </Link>
      );
    } else if (isOwner) {
      button = (
        <Button onClick={this.askUserToDelete}>
          {<FontAwesomeIcon icon={faTrash} style={{ paddingRight: "5px" }} />}
        </Button>
      );
    } else {
      button = (
        // <Link
        //   to={{
        //     pathname: "/chats",
        //   }}
        // >
        <Button onClick={() => this.onChatHandler(this.props.userId)}>
          {
            <FontAwesomeIcon
              icon={faComments}
              style={{ paddingRight: "5px" }}
            />
          }
        </Button>
        // </Link>
      );
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
    setFilterProfile: (displayName) =>
      dispatch(actions.setFilterProfile(displayName)),
    setFilterTermForListing: (filterType, object) =>
      dispatch(actions.setFilterListings(filterType, object)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Request);
