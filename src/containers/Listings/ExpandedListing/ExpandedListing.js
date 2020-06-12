import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import classes from "./ExpandedListing.css";
import * as actions from "../../../store/actions/index";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Comments from "../../Comments/Comments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWindowClose,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

class ExpandedListing extends Component {
  state = {
    imageIndex: 0,
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

  onChatHandler = (event) => {
    this.props.dispatchGoToChat(this.props.expandedListing.displayName);
    this.props.dispatchSetInterestedListing(this.props.expandedListing);
    this.props.history.push({
      pathname: "/chats",
      search: "?" + this.props.expandedListing.displayName,
    });
  };

  render() {
    if (this.props.expandedListingLoading) {
      return <Spinner />;
    }

    const singleImage = (
      <img
        src={this.props.expandedListing.imageURL[this.state.imageIndex]}
        alt={
          this.props.expandedListing.imageURL[this.state.imageIndex] === "error"
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
              this.props.expandedListing.imageURL.length - 1
            }
            className={classes.ImageButton}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      );

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
            <li>
              Delivery method:
              {this.props.expandedListing.postDetails.deliveryMethod}
            </li>
            <li>Location: {this.props.expandedListing.postDetails.location}</li>
            <li>
              <br />
              Description: <br />
              {this.props.expandedListing.postDetails.description}
            </li>
            <br />
            <li>Posted by: {this.props.expandedListing.displayName}</li>
          </ul>
          <div className={classes.Button}>
            {this.props.isAuthenticated ? (
              this.props.expandedListing.displayName ===
              this.props.displayName ? null : (
                <Button onClick={this.onChatHandler}>Chat</Button>
              )
            ) : (
              <Link to="/auth">
                <Button>Chat</Button>
              </Link>
            )}
          </div>
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

    return (
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    expandedListing: state.listing.expandedListing,
    expandedListingLoading: state.listing.expandedListingLoading,
    isAuthenticated: state.auth.token !== null,
    displayName: state.auth.displayName,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchGoToChat: (displayName) => dispatch(actions.goToChat(displayName)),
    dispatchSetInterestedListing: (listing) =>
      dispatch(actions.setInterestedListing(listing)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpandedListing);
