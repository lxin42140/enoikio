import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import classes from "./ExpandedListing.css";
import * as actions from "../../../store/actions/index";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
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

    const text = (
      <React.Fragment>
        <div className={classes.Text}>
          <div>
            <h1>
              {this.props.expandedListing.postDetails.module}:《
              {this.props.expandedListing.postDetails.textbook}》
            </h1>
          </div>

          <div>
            <ul className={classes.Description}>
              <li>
                Price: ${this.props.expandedListing.postDetails.price} / month
              </li>
              <li>
                Delivery method:{" "}
                {this.props.expandedListing.postDetails.deliveryMethod}
              </li>
              <li>
                Location: {this.props.expandedListing.postDetails.location}
              </li>
              <li>
                <br />
                Description: <br />{" "}
                {this.props.expandedListing.postDetails.description}
              </li>
              <br />
              <li>
                Posted by: {this.props.expandedListing.postDetails.displayName}
              </li>
            </ul>
          </div>
          <div className={classes.Button}>
            {this.props.isAuthenticated ? (
              <Link to="/chats">
                <Button
                  onClick={() =>
                    this.props.dispatchGoToChat(
                      this.props.expandedListing.displayName
                    )
                  }
                >
                  Chat
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button>Chat</Button>
              </Link>
            )}
          </div>
        </div>
        <div>
          <Link to="/">
            <FontAwesomeIcon
              icon={faWindowClose}
              style={{
                float: "right",
                paddingLeft: "10px",
                color: "#ff5138",
              }}
            />
          </Link>
        </div>
      </React.Fragment>
    );

    return (
      <div className={classes.ExpandedListing}>
        <div className={classes.Left}>{image}</div>
        <div className={classes.Right}>{text}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    expandedListing: state.listing.expandedListing,
    expandedListingLoading: state.listing.expandedListingLoading,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchGoToChat: (displayName) => dispatch(actions.goToChat(displayName)),
    dispatchFetchAllListings: () => dispatch(actions.fetchAllListings()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpandedListing);
