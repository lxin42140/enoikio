import { faHeart, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";

import Button from "../../../components/UI/Button/Button";
import { database, storage } from "../../../firebase/firebase";
import * as actions from "../../../store/actions/index";
import classes from "./Listing.css";

/*
KIV:
2. ADJUST MODAL FOR DELETE LISTING / EDIT LISTING FOR SMALLER SCREEN
*/

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

    let currLikedUsers = this.props.likedUsers;

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

  componentDidUpdate(prevState) {
    if (prevState.liked !== this.state.liked) {
      const likedUsers = Object.assign([], this.state.likedUsers);
      database.ref().child("listings").child(this.props.node).update({
        likedUsers: likedUsers,
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

  expandListingHandler = () => {
    this.props.dispatchExpandedListing(this.props.identifier);
    let query;
    if (this.props.history.location.search) {
      query = this.props.history.location.search;
    } else {
      query = "?from=" + this.props.history.location.pathname;
    }
    this.props.history.push("/expanded-listing" + query);
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

  onChangeRentalHandler = (event, offerType) => {
    const chatKey = this.props.chatContacts.filter(
      (contact) => contact.userName === this.props.lessee
    )[0].UID;

    const listing = {
      unique: this.props.identifier,
      key: this.props.node,
      displayName: this.props.userId,
      offerType: offerType,
      listingType: this.props.listingType,
      textbook: this.props.textbook,
      price: this.props.price,
      sender: this.props.displayName,
    };

    storage
      .ref("/listingPictures/" + this.props.identifier)
      .child("0")
      .child("0")
      .getDownloadURL()
      .then((url) => {
        listing.url = url;
        let message = {
          content:
            offerType === "COMPLETED_OFFER"
              ? "Rental for《" + this.props.textbook + "》completed"
              : "Offer for《" + this.props.textbook + "》rejected",
          type: offerType,
          interestedListing: listing,
          sender: listing.sender,
          price: listing.price,
          startRental: "",
          endRental: "",
          date: moment().format("DD/MM/YYYY"),
          time: moment().format("HH:mm:ss"),
        };

        database
          .ref()
          .child("chats/" + chatKey)
          .once("value", (snapShot) => {
            snapShot.forEach((data) => {
              if (data.key === "chatHistory") {
                const chatHistory = Object.assign([], data.val());
                chatHistory.push(message);
                database
                  .ref()
                  .child("chats/" + chatKey)
                  .update({
                    chatHistory: chatHistory,
                  })
                  .then((res) => {
                    this.props.history.push({
                      pathname: "/chats",
                      search: "?" + this.props.userId,
                    });
                  });
              }
            });
          });
      });

    database
      .ref()
      .child("listings/" + this.props.node)
      .update({
        lessee: "none",
        status: "available",
      });
  };

  render() {
    const smallScreen = this.props.windowWidth < 616;

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

    const heartIcon = (
      <div style={{ display: "flex", alignItems: "center", marginTop: "auto" }}>
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
    );

    let listing;

    if (this.props.filterType && this.props.filterType === "onRent") {
      listing = (
        <React.Fragment>
          <div
            onClick={this.expandListingHandler}
            style={{ cursor: "pointer", marginBottom: "-30px" }}
          >
            <div
              className={
                this.props.textbook.split(" ").length > 4
                  ? classes.TextBookLongTitle
                  : classes.Textbook
              }
            >
              <p>
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
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "auto",
              justifyContent: "center",
            }}
          >
            <Button
              btnType="Important"
              onClick={(event) =>
                this.onChangeRentalHandler(event, "COMPLETED_OFFER")
              }
            >
              {
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ paddingRight: "5px" }}
                />
              }
              Completed
            </Button>
            <Button
              onClick={(event) =>
                this.onChangeRentalHandler(event, "REJECTED_OFFER")
              }
            >
              {
                <FontAwesomeIcon
                  icon={faTimes}
                  style={{ paddingRight: "5px" }}
                />
              }
              Reject
            </Button>
          </div>
        </React.Fragment>
      );
    } else if (
      this.props.filterType &&
      this.props.filterType === "displayName"
    ) {
      listing = (
        <React.Fragment>
          <div
            onClick={this.expandListingHandler}
            style={{ cursor: "pointer", marginBottom: "-30px" }}
          >
            <div
              className={
                this.props.textbook.split(" ").length > 4
                  ? classes.TextBookLongTitle
                  : classes.Textbook
              }
            >
              <p>
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
          </div>
          {heartIcon}
        </React.Fragment>
      );
    } else {
      listing = (
        <React.Fragment>
          <div
            onClick={this.expandListingHandler}
            style={{ cursor: "pointer" }}
          >
            <div
              className={
                this.props.textbook.split(" ").length > 4
                  ? classes.TextBookLongTitle
                  : classes.Textbook
              }
            >
              <p>
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
                {!smallScreen ? (
                  <React.Fragment>
                    {this.props.deliveryMethod === "mail" ? null : (
                      <li>
                        <b>Location: </b>
                        {this.props.location}
                      </li>
                    )}
                    <li style={{ paddingTop: "5px" }}>
                      <b>Posted by: </b>
                      {this.props.userId}
                    </li>
                    <li>
                      <b>Posted on: </b>
                      {this.props.date}
                    </li>
                  </React.Fragment>
                ) : null}
              </ul>
            </div>
          </div>
          {heartIcon}
        </React.Fragment>
      );
    }

    return <div className={ListingStyle}>{listing}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.user !== null,
    displayName: state.auth.displayName,
    listings: state.listing.listings,
    chatContacts: state.chat.chatContacts,
    windowWidth: state.window.width,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchExpandedListing: (identifier) =>
      dispatch(actions.fetchExpandedListing(identifier)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Listing);
