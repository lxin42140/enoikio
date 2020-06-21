import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import classes from "./ExpandedListing.css";
import * as actions from "../../../store/actions/index";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Comments from "../../Comments/Comments";
import Modal from "../../../components/UI/Modal/Modal";
import { database, storage } from "../../../firebase/firebase";
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
    this.setState({ askUserToDelete: false });
  };

  askUserToDelete = () => {
    this.setState({ askUserToDelete: true });
  };

  confirmDelete = () => {
    database
      .ref()
      .child("listings")
      .child(this.props.expandedListing.key)
      .remove();
    deleteAllImages(this.props.expandedListing.unique);

    async function deleteAllImages(unique) {
      let key = 0;
      while (key < 3) {
        const ref = storage
          .ref("listingPictures")
          .child(unique)
          .child("" + key);

        const image = await ref.listAll();
        if (image.items.length !== 0) {
          ref.child("" + key).delete();
        }
        key += 1;
      }
    }
    this.setState({ confirmDelete: true, askUserToDelete: false });
  };

  render() {
    if (this.props.expandedListingLoading || !this.props.expandedListing) {
      return <Spinner />;
    }

    const imageArray = this.props.expandedListing.imageURL.filter(
      (image) => image !== null
    );
    const numImages = imageArray.length;

    const singleImage = (
      <img
        src={imageArray[this.state.imageIndex].url}
        alt={
          imageArray[this.state.imageIndex].url === "error"
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
            disabled={this.state.imageIndex === numImages - 1}
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
          <Button btnType="Important" onClick={this.askUserToDelete}>
            Delete
          </Button>
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
              <b>Type: </b>
              {this.props.expandedListing.postDetails.listingType}
            </li>
            <li>
              <b>Status: </b>
              {this.props.expandedListing.status === "available" ? (
                <span
                  style={{
                    color: "rgb(40, 197, 40)",
                    fontSize: "18px",
                    fontWeight: "bolder",
                  }}
                >
                  {this.props.expandedListing.status}
                </span>
              ) : (
                <span
                  style={{
                    color: "red",
                    fontSize: "18px",
                    fontWeight: "bolder",
                  }}
                >
                  {this.props.expandedListing.status}
                </span>
              )}
            </li>
            {this.props.expandedListing.postDetails.listingType === "rent" ? (
              <li>
                <b>Price: </b>
                <span
                  style={{
                    color: "#fd8673",
                    fontSize: "20px",
                    fontWeight: "bolder",
                  }}
                >
                  ${this.props.expandedListing.postDetails.price} /month
                </span>
              </li>
            ) : (
              <li>
                <b>Price: </b>
                <span
                  style={{
                    color: "#fd8673",
                    fontSize: "20px",
                    fontWeight: "bolder",
                  }}
                >
                  ${this.props.expandedListing.postDetails.price}
                </span>
              </li>
            )}
            <li>
              <b>Delivery method: </b>
              {this.props.expandedListing.postDetails.deliveryMethod}
            </li>
            {this.props.expandedListing.postDetails.deliveryMethod ===
            "mail" ? null : (
              <li>
                <b>Location: </b>
                {this.props.expandedListing.postDetails.location}
              </li>
            )}
            {this.props.expandedListing.postDetails.description ? (
              <React.Fragment>
                <li>
                  <br />
                  <b>Description: </b>
                  <br />
                  <p style={{ fontSize: "14px" }}>
                    {this.props.expandedListing.postDetails.description}
                  </p>
                </li>
              </React.Fragment>
            ) : null}
            <br />
            <li>
              <b>Posted by: </b>
              {this.props.expandedListing.displayName}
            </li>
            <li>
              <b>Posted on: </b>
              {this.props.expandedListing.date}
            </li>
          </ul>
          <div className={classes.Selection}>{selections}</div>
        </div>
        <div
          onClick={() => this.props.history.goBack()}
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon
            icon={faWindowClose}
            style={{
              color: "#ff5138",
              paddingRight: "5px",
            }}
          />
        </div>
      </React.Fragment>
    );

    const askForConfirmation = (
      <Modal show={this.state.askUserToDelete}>
        <div style={{}}>
          <p>Confirm delete listing?</p>
          <p>This action cannot be undone.</p>
          <Button onClick={this.cancelConfirmation}>Go back</Button>
          <Button onClick={this.confirmDelete}>Delete</Button>
        </div>
      </Modal>
    );

    const confirmDeleteModal = (
      <Modal show={this.state.confirmDelete}>
        <div style={{ display: "block" }}>
          <p>Listing deleted.</p>
          <Link to="/">
            <Button>Home</Button>
          </Link>
        </div>
      </Modal>
    );

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
            userName={this.props.expandedListing.displayName}
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
