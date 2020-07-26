import {
  faChevronLeft,
  faChevronRight,
  faWindowClose,
  faEdit,
  faTrash,
  faComments,
  faTimes,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "../../../components/UI/Button/Button";
import Modal from "../../../components/UI/Modal/Modal";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { database, storage } from "../../../firebase/firebase";
import * as actions from "../../../store/actions/index";
import Comments from "../../Listings/ExpandedListing/Comments/Comments";
import classes from "./ExpandedListing.css";

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
        })
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

  searchProfileHandler = (displayName) => {
    let formattedDisplayName = displayName.toLowerCase().split(" ").join("");
    if (
      this.props.displayName.toLowerCase().split(" ").join("") ===
      formattedDisplayName
    ) {
      this.props.setFilterTermForListing("displayName");
      this.props.history.push("/profile");
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

  onRedirectToEditListing = () => {
    let query = "/edit-post" + this.props.location.search;
    this.props.history.push(query);
  };

  closeExpandedListing = () => {
    if (this.props.history.location.search) {
      let query = this.props.history.location.search.split("=")[1];
      query = query.split("&&")[0];
      this.props.history.push(query);
    } else {
      this.props.history.push("/");
    }
  };
  render() {
    if (this.state.errorMessage) {
      return (
        <div className={classes.ExpandedListing}>
          <p style={{ color: "red", fontSize: "small" }}>
            {this.state.errorMessage}
          </p>
        </div>
      );
    }

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
      <div className={classes.endOfListing}>
        <div
          className={classes.listingName}
          onClick={() =>
            this.searchProfileHandler(this.props.expandedListing.displayName)
          }
        >
          <span className={classes.tooltiptext}>Click to go profile</span>

          <img
            src={this.props.expandedListing.photoURL}
            alt="Profile"
            className={classes.listingProfileImage}
          />
          <p
            style={{
              paddingLeft: "10px",
              paddingRight: "20px",
              color: "grey",
            }}
          >
            @{this.props.expandedListing.displayName}
          </p>
        </div>
        <Button
          btnType="Important"
          onClick={() => this.props.history.push("/auth")}
        >
          {
            <FontAwesomeIcon
              icon={faComments}
              style={{ paddingRight: "5px" }}
            />
          }
          Make offer
        </Button>
      </div>
    );

    if (
      this.props.isAuthenticated &&
      this.props.expandedListing.displayName === this.props.displayName
    ) {
      selections = (
        <div className={classes.endOfListing}>
          <div
            className={classes.listingName}
            onClick={() =>
              this.searchProfileHandler(this.props.expandedListing.displayName)
            }
          >
            <img
              src={this.props.expandedListing.photoURL}
              alt="Profile"
              className={classes.listingProfileImage}
            />
            <p
              style={{
                paddingLeft: "10px",
                paddingRight: "20px",
                color: "grey",
              }}
            >
              @{this.props.expandedListing.displayName}
            </p>
          </div>
          <span style={{ paddingRight: "20px" }}>
            <Button btnType="Important" onClick={this.onRedirectToEditListing}>
              {
                <FontAwesomeIcon
                  icon={faEdit}
                  style={{ paddingRight: "5px" }}
                />
              }
              Edit
            </Button>
          </span>
          <Button
            onClick={this.askUserToDelete}
            disabled={this.props.expandedListing.status !== "available"}
          >
            {<FontAwesomeIcon icon={faTrash} style={{ paddingRight: "5px" }} />}
            Delete
          </Button>
        </div>
      );
    } else if (this.props.isAuthenticated) {
      selections = (
        <div className={classes.endOfListing}>
          <div
            className={classes.listingName}
            onClick={() =>
              this.searchProfileHandler(this.props.expandedListing.displayName)
            }
          >
            <img
              src={this.props.expandedListing.photoURL}
              alt="Profile"
              className={classes.listingProfileImage}
            />
            <p
              style={{
                paddingLeft: "10px",
                paddingRight: "20px",
                color: "grey",
              }}
            >
              @{this.props.expandedListing.displayName}
            </p>
          </div>
          <Button
            btnType="Important"
            onClick={() =>
              this.onChatHandler(this.props.expandedListing.displayName)
            }
          >
            {
              <FontAwesomeIcon
                icon={faComments}
                style={{ paddingRight: "5px" }}
              />
            }
            Make offer
          </Button>
        </div>
      );
    }

    const listingInformation = (
      <React.Fragment>
        <div className={classes.listingDetails}>
          <h3 style={{ textAlign: "left" }}>
            {this.props.expandedListing.postDetails.module}:《
            {this.props.expandedListing.postDetails.textbook}》
          </h3>
          <ul className={classes.Description}>
            <li>
              <b>Type: </b>
              {this.props.expandedListing.postDetails.listingType}
            </li>
            <li>
              <b>Status: </b>
              {this.props.expandedListing.status === "available" ? (
                <span className={classes.keyInformation}>
                  {this.props.expandedListing.status}
                </span>
              ) : (
                <span className={classes.keyInformation}>
                  {this.props.expandedListing.status}
                </span>
              )}
            </li>
            {this.props.expandedListing.postDetails.listingType === "rent" ? (
              <li>
                <b>Price: </b>
                <span className={classes.keyInformation}>
                  ${this.props.expandedListing.postDetails.price} /month
                </span>
              </li>
            ) : (
              <li>
                <b>Price: </b>
                <span className={classes.keyInformation}>
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
            <li>
              <b>Posted on: </b>
              {this.props.expandedListing.date}
            </li>
          </ul>

          <div className={classes.Selection}>{selections}</div>
        </div>
      </React.Fragment>
    );

    const goBack = (
      <div onClick={this.closeExpandedListing} style={{ cursor: "pointer" }}>
        <FontAwesomeIcon
          icon={faWindowClose}
          style={{
            color: "#ff5138",
            fontSize: "1.2rem",
            cursor: "pointer",
            float: "right",
            padding: "5px",
          }}
        />
      </div>
    );

    const askForConfirmation = (
      <Modal show={this.state.askUserToDelete}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>Confirm delete listing?</p>
          <i style={{ fontSize: "small", color: "red" }}>
            This action cannot be undone
          </i>
          <span style={{ paddingBottom: "10px" }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button onClick={this.confirmDelete} btnType="Important">
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ color: "green", fontWeight: "bold" }}>Listing deleted</p>
          <Button
            btnType="Important"
            onClick={() => this.props.history.push("/")}
          >
            {<FontAwesomeIcon icon={faHome} style={{ paddingRight: "5px" }} />}
            Home
          </Button>
        </div>
      </Modal>
    );

    return (
      <React.Fragment>
        <div className={classes.ExpandedListing}>
          <div className={classes.ExpandedListingContent}>
            <div className={classes.Content}>
              <div className={classes.ImageContent}>{image}</div>
              <div className={classes.TextContent}>{listingInformation}</div>
            </div>
            <div className={classes.Back}>{goBack}</div>
          </div>
          <div style={{ position: "relative" }}>
            <Comments
              comments={this.props.expandedListing.comments}
              replies={this.props.expandedListing.replies}
              identifier={this.props.expandedListing.key}
              userName={this.props.expandedListing.displayName}
              searchProfileHandler={this.searchProfileHandler}
              history={this.props.history}
            />
          </div>
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
    setFilterProfile: (displayName) =>
      dispatch(actions.setFilterProfile(displayName)),
    setFilterTermForListing: (filterType, object) =>
      dispatch(actions.setFilterListings(filterType, object)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpandedListing);
