import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

import classes from "./Listing.css";
import * as actions from "../../../store/actions/index";
import { storage, database } from "../../../firebase/firebase";

class Listing extends Component {
  state = {
    image: "",
    imageIndex: 0,
    error: false,
    liked: false,
    likedUsers: [],
  };

  componentDidMount() {
    this.retrieveImage();

    let currLikedUsers = this.props.listings.filter(
      (listing) => listing.key === this.props.node
    )[0].likedUsers;

    if (!currLikedUsers) {
      currLikedUsers = [];
    }

    if (this.props.isAuthenticated && this.props.likedUsers) {
      const likedUser = this.props.likedUsers.filter(
        (name) => name === this.props.displayName
      )[0];
      this.setState({
        liked: likedUser && likedUser === this.props.displayName,
        likedUsers: currLikedUsers,
      });
    } else {
      this.setState({
        likedUsers: currLikedUsers,
      });
    }
  }

  async retrieveImage() {
    let imageIndex = 0;
    while (imageIndex < 3) {
      const image = await storage
        .ref("listingPictures")
        .child(this.props.identifier)
        .child("" + imageIndex)
        .listAll();

      if (image.items.length === 0) {
        imageIndex += 1;
        continue;
      } else {
        storage
          .ref("listingPictures")
          .child(this.props.identifier)
          .child("" + imageIndex)
          .child("" + imageIndex)
          .getDownloadURL()
          .then((url) => {
            this.setState({
              image: url,
            });
          })
          .catch((error) => {
            this.setState({ error: true });
          });
        break;
      }
    }
  }

  componentDidUpdate(prevState) {
    if (prevState.liked !== this.state.liked) {
      const likedUsers = Object.assign([], this.state.likedUsers);
      database.ref().child("listings").child(this.props.node).update({
        likedUsers: likedUsers,
      });
    }
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
      if (this.props.userId === this.props.displayName) {
        return;
      }

      let currLikedUsers = [...this.state.likedUsers];

      if (this.state.liked) {
        const indexOfUser = currLikedUsers.indexOf(this.props.displayName);
        currLikedUsers.splice(indexOfUser, 1);

        this.setState({
          liked: false,
          likedUsers: currLikedUsers,
        });
      } else {
        currLikedUsers.push(this.props.displayName);
        this.setState({
          liked: true,
          likedUsers: currLikedUsers,
        });
      }
    }
  };

  render() {
    let listing;

    if (this.props.filterType && this.props.filterType === "onRent") {
      listing = (
        <React.Fragment>
          <div className={classes.Textbook}>
            <p style={{ textAlign: "center" }}>
              {this.props.module}:《{this.props.textbook}》
            </p>
          </div>
          <div style={{ textAlign: "center", height: "150px" }}>
            <img
              src={this.state.image}
              alt={
                this.state.error ? "Unable to load image" : "Loading image..."
              }
              style={{
                flex: "none",
                objectFit: "cover",
                width: "150px",
                height: "150px",
                borderRadius: "4px",
              }}
            />
          </div>
          <div>
            <ul className={classes.Description}>
              <li>
                <b>Rental duration:</b>
                {this.props.status.split("from")[1]}
              </li>
              <li>
                <b>Lessee: </b> {this.props.lessee}
              </li>
            </ul>
          </div>
        </React.Fragment>
      );
    } else if (
      this.props.filterType &&
      this.props.filterType === "displayName"
    ) {
      listing = (
        <React.Fragment>
          <div className={classes.Textbook}>
            <p style={{ textAlign: "center" }}>
              {this.props.module}:《{this.props.textbook}》
            </p>
          </div>
          <div style={{ textAlign: "center", height: "200px" }}>
            <img
              src={this.state.image}
              alt={
                this.state.error ? "Unable to load image" : "Loading image..."
              }
              style={{
                flex: "none",
                objectFit: "cover",
                width: "200px",
                height: "200px",
              }}
            />
          </div>
          <div>
            <ul className={classes.Description}>
              <li>
                <b>Type: </b>
                {this.props.listingType}
              </li>
              <li>
                <p style={{ margin: "0px" }}>
                  <b>Status: </b>
                  {this.props.status}
                </p>
              </li>
              {this.props.listingType === "rent" ? (
                <li>
                  <b>Price: </b>${this.props.price} /month
                </li>
              ) : (
                <li>
                  <b>Price: </b>${this.props.price}
                </li>
              )}
              <li>
                <b>Delivery method: </b>
                {this.props.deliveryMethod}
              </li>
              {this.props.deliveryMethod === "mail" ? null : (
                <li>
                  <b>Location: </b>
                  {this.props.location}
                </li>
              )}
              <li>
                <b>Posted on: </b>
                {this.props.date}
              </li>
            </ul>
          </div>
        </React.Fragment>
      );
    } else {
      listing = (
        <React.Fragment>
          <div className={classes.Textbook}>
            <p style={{ textAlign: "center" }}>
              {this.props.module}:《{this.props.textbook}》
            </p>
          </div>
          <div style={{ textAlign: "center", height: "200px" }}>
            <img
              src={this.state.image}
              alt={
                this.state.error ? "Unable to load image" : "Loading image..."
              }
              className={classes.Image}
            />
          </div>
          <div>
            <ul className={classes.Description}>
              <li>
                <b>Type: </b>
                {this.props.listingType}
              </li>
              <li>
                <p style={{ margin: "0px" }}>
                  <b>Status: </b>
                  {this.props.status}
                </p>
              </li>
              {this.props.listingType === "rent" ? (
                <li>
                  <b>Price: </b>${this.props.price} /month
                </li>
              ) : (
                <li>
                  <b>Price: </b>${this.props.price}
                </li>
              )}
              <li>
                <b>Delivery method: </b>
                {this.props.deliveryMethod}
              </li>
              {this.props.deliveryMethod === "mail" ? null : (
                <li>
                  <b>Location: </b>
                  {this.props.location}
                </li>
              )}
              <br />
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
        </React.Fragment>
      );
    }

    //styling for heart icon
    const HeartStyle = [classes.Icon];
    this.state.liked
      ? HeartStyle.push(classes.Enabled)
      : HeartStyle.push(classes.Disabled);

    //styling for listing
    let ListingStyle = classes.Normal;
    if (this.props.filterType) {
      switch (this.props.filterType) {
        case "displayName":
          ListingStyle = classes.Shortened;
          break;
        case "onRent":
          ListingStyle = classes.OnRent;
          break;
        default:
          break;
      }
    }

    return (
      <div className={ListingStyle}>
        <div
          onClick={this.expandListingHandler}
          style={{ cursor: "pointer", marginBottom: "-30px" }}
        >
          {listing}
          <br />
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "auto" }}
        >
          <FontAwesomeIcon
            icon={faHeart}
            className={HeartStyle.join(" ")}
            onClick={this.toggleLikePostHandler}
          />
          <p
            style={{
              paddingLeft: "5px",
              color: "#ccc",
              fontSize: "small",
              margin: "0",
            }}
          >
            {this.state.likedUsers.length - 1}
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.user !== null,
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
