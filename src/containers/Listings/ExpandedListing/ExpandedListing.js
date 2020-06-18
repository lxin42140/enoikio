import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import classes from "./ExpandedListing.css";
import * as actions from "../../../store/actions/index";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Comments from "../../Comments/Comments";
import Modal from "../../../components/UI/Modal/Modal";
import { database } from "../../../firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWindowClose,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

class ExpandedListing extends Component {
  state = {
    imageIndex: 0,
    askUserToDelete: false,
    confirmDelete: false,
  };

  prevImageHandler = () => {
    this.setState((prevState) => {
      return { imageIndex: prevState.imageIndex - 1 };
    });
  };

  nextImageHandler = () => {
    this.setState((prevState) => {
      return { imageIndex: prevState.imageIndex + 1 };
    });
  };

  onChatHandler = (chatDisplayName) => {
    this.props.dispatchSetInterestedListing(this.props.expandedListing);
    if (this.props.existingChatNames.indexOf(chatDisplayName) < 0) {
      const UID = this.props.displayName + chatDisplayName;
      const chatRef = database.ref().child("chats");
      const pushMessageKey = chatRef.push().key;
      chatRef
        .child(pushMessageKey)
        .set({
          userA: this.props.displayName,
          userB: chatDisplayName,
          UID: UID,
        })
        .then((res) => {
          this.props.history.push({
            pathname: "/chats",
            search: "?" + this.props.expandedListing.displayName,
          });
        });
    } else {
      this.props.history.push({
        pathname: "/chats",
        search: "?" + this.props.expandedListing.displayName,
      });
    }
  };

  cancelConfirmation = () => {
    this.setState({ askUserToDelete: false })
  }

  askUserToDelete = () => {
    this.setState({ askUserToDelete: true });
  };

  confirmDelete = () => {
    this.setState({ confirmDelete: true, askUserToDelete: false });
  };

  render() {
    if (this.props.expandedListingLoading) {
      return <Spinner />;
    }

    const imageArray = this.props.expandedListing.imageURL.filter(image =>
        image !== null);
    const numImages = imageArray.length;

    const singleImage = (
      <img
        src={imageArray[this.state.imageIndex].url}
        alt={
          imageArray[this.state.imageIndex].url ===
            "error"
            ? "Unable to load image"
            : "Loading image..."
        }
        className={classes.Image}
      />
    );

    const image =
      this.props.expandedListing.imageURL.length === 1 ? (
        singleImage
      ) : (
          <div className={classes.Images}>
            <button
              onClick={this.prevImageHandler}
              disabled={this.state.imageIndex === 0}
              className={classes.ImageButton}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            {singleImage}
            <button
              onClick={this.nextImageHandler}
              disabled={
                this.state.imageIndex ===
                numImages - 1
              }
              className={classes.ImageButton}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        );

    let selections = (
      <Link to="/auth">
        <Button>Chat to make offer</Button>
      </Link>
    );

    if (
      this.props.isAuthenticated &&
      this.props.expandedListing.displayName === this.props.displayName
    ) {
      selections = (
        <React.Fragment>
          <Link to="/edit-post">
            <Button btnType="Important">Edit</Button>
          </Link>
          <Button btnType="Important" onClick={this.askUserToDelete}>Delete</Button>
        </React.Fragment>
      );
    } else if (this.props.isAuthenticated) {
      selections = (
        <Button
          onClick={() =>
            this.onChatHandler(this.props.expandedListing.displayName)
          }
        >
          Chat to make offer
        </Button>
      );
    }

    const listingInformation = (
      <React.Fragment>
        <div className={classes.listingDetails}>
          <h1>
            {this.props.expandedListing.postDetails.module}:《
            {this.props.expandedListing.postDetails.textbook}》
          </h1>
          <ul className={classes.Description}>
            <li>
              Price: ${this.props.expandedListing.postDetails.price} / month
            </li>
            <li>Status: {this.props.expandedListing.status}</li>
            <li>
              Delivery method:
              {this.props.expandedListing.postDetails.deliveryMethod}
            </li>
            <li>Location: {this.props.expandedListing.postDetails.location}</li>
            {this.props.expandedListing.postDetails.description ? (
              <React.Fragment>
                <li>
                  <br />
                  Description: <br />
                  {this.props.expandedListing.postDetails.description}
                </li>
              </React.Fragment>
            ) : null}
            <br />
            <li>Posted by: {this.props.expandedListing.displayName}</li>
            <li>Posted on: {this.props.expandedListing.date}</li>
          </ul>
          <div className={classes.Selection}>{selections}</div>
        </div>
        <Link to="/">
          <FontAwesomeIcon
            icon={faWindowClose}
            style={{
              color: "#ff5138",
              paddingRight: "5px",
            }}
          />
        </Link>
      </React.Fragment>
    );

    const askForConfirmation =
      <Modal show={this.state.askUserToDelete}>
        <div style={{}}>
        <p>Confirm delete listing?</p>
        <p>This action cannot be undone.</p>
        <Button onClick={this.cancelConfirmation}>Go back</Button>
        <Button onClick={this.confirmDelete}>Submit</Button>
        </div>
      </Modal>

    const confirmDeleteModal =
      <Modal show={this.state.confirmDelete}>
        Listing deleted.
        <Link to="/">
          <Button>
            Home
          </Button>
        </Link>
      </Modal>

    return (
      <React.Fragment>
        <div className={classes.ExpandedListing}>
          <div className={classes.ExpandedListingContent}>
            <div className={classes.ImageContent}>{image}</div>
            <div className={classes.TextContent}>{listingInformation}</div>
          </div>
          <Comments
            comments={this.props.expandedListing.comments}
            identifier={this.props.expandedListing.key}
          />
        </div>
        {this.state.askUserToDelete ? askForConfirmation : null}
        {this.state.confirmDelete ? confirmDeleteModal : null}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    expandedListing: state.listing.expandedListing,
    expandedListingLoading: state.listing.expandedListingLoading,
    isAuthenticated: state.auth.user !== null,
    displayName: state.auth.displayName,
    existingChatNames: state.chat.existingChatNames,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchSetInterestedListing: (listing) =>
      dispatch(actions.setInterestedListing(listing)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpandedListing);
