import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

import classes from "./Listing.css";
import Button from "../../../components/UI/Button/Button";
import * as actions from "../../../store/actions/index";
import { storage, database } from "../../../firebase/firebase";

class Listing extends Component {
  state = {
    image: "",
    error: false,
    liked: false,
  };

  componentDidMount() {
    storage
      .ref("/listingPictures/" + this.props.identifier)
      .child("0")
      .getDownloadURL()
      .then((url) => {
        if (this.props.isAuthenticated) {
          const likedUser = this.props.likedUsers.filter(
            (name) => name === this.props.displayName
          );
          if (
            likedUser.length !== 0 &&
            likedUser[0] === this.props.displayName
          ) {
            this.setState({
              liked: true,
              image: url,
            });
          } else {
            this.setState({
              liked: false,
              image: url,
            });
          }
        } else {
          this.setState({
            image: url,
          });
        }
      })
      .catch((error) => {
        this.setState({ error: true });
      });
  }

  expandListingHandler = () => {
    this.props.dispatchExpandedListing(this.props.identifier);

    this.props.history.push({
      pathname: "/expanded-listing",
      search: "?" + this.props.identifier,
    });
  };

  toggleLikePostHandler = () => {
    if (!this.props.isAuthenticated) {
      this.props.history.push("/auth");
    } else {
      const currLikedUsers = this.props.listings.filter(
        (listing) => listing.key === this.props.node
      )[0].likedUsers;

      if (this.state.liked) {
        const indexOfUser = currLikedUsers.indexOf(this.props.displayName);
        currLikedUsers.splice(indexOfUser, 1);
        database
          .ref()
          .child(`/listings/${this.props.node}`)
          .update({
            likedUsers: currLikedUsers,
          })
          .then((res) => {
            this.setState({
              liked: false,
            });
          });
      } else {
        currLikedUsers.push(this.props.displayName);
        database
          .ref()
          .child(`/listings/${this.props.node}`)
          .update({
            likedUsers: currLikedUsers,
          })
          .then((res) => {
            this.setState({
              liked: true,
            });
          });
      }
    }
  };

  render() {
    let listing = (
      <React.Fragment>
        <div className={classes.Textbook}>
          <p style={{ textAlign: "center" }}>
            {this.props.module}:《{this.props.textbook}》
          </p>
        </div>
        <div style={{ textAlign: "center", height: "200px" }}>
          <img
            src={this.state.image}
            alt={this.state.error ? "Unable to load image" : "Loading image..."}
            className={classes.Image}
          />
        </div>
        <div>
          <ul className={classes.Description}>
            <li>
              {this.props.status === "available" ? (
                <p style={{ margin: "0px" }}>Status: {this.props.status}</p>
              ) : (
                <p style={{ margin: "0px" }}>
                  Status: <br /> {this.props.status}
                </p>
              )}
            </li>
            <li>Price: ${this.props.price} / month</li>
            <li>Delivery method: {this.props.deliveryMethod}</li>
            <li>Location: {this.props.location}</li>
            <br />
            <li>Posted by: {this.props.userId}</li>
            <li>Posted on: {this.props.date}</li>
          </ul>
        </div>
      </React.Fragment>
    );

    const heartStyle = [classes.Icon];
    this.state.liked
      ? heartStyle.push(classes.Enabled)
      : heartStyle.push(classes.Disabled);

    return (
      <div className={classes.Listing}>
        {listing}
        <br />
        <div className={classes.Selection}>
          <Button btnType="Important" onClick={this.expandListingHandler}>
            Rent now
          </Button>
          <FontAwesomeIcon
            icon={faHeart}
            className={heartStyle.join(" ")}
            onClick={this.toggleLikePostHandler}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    displayName: state.auth.displayName,
    listings: state.listing.listings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchExpandedListing: (identifier) =>
      dispatch(actions.fetchExpandedListing(identifier)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Listing);
