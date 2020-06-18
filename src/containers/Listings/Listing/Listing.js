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

  async componentDidMount() {
    let currLikedUsers = this.props.listings.filter(
      (listing) => listing.key === this.props.node
    )[0].likedUsers;

    if (!currLikedUsers) {
      currLikedUsers = [];
    }

    let imageIndex = 0;
    while (imageIndex < 3) {
      const image = await storage
        .ref("listingPictures")
        .child(this.props.identifier)
        .child("" + imageIndex)
        .listAll()

      if (image.items.length === 0) {
        imageIndex += 1;
        continue
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
              <b>Type: </b>
              {this.props.listingType}
            </li>
            <li>
              {this.props.status === "available" ||
              this.props.status === "sold" ? (
                <p style={{ margin: "0px" }}>
                  <b>Status: </b>
                  {this.props.status}
                </p>
              ) : (
                <p style={{ margin: "0px" }}>
                  <b>Status: </b>
                  <br /> {this.props.status}
                </p>
              )}
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

    const heartStyle = [classes.Icon];
    this.state.liked
      ? heartStyle.push(classes.Enabled)
      : heartStyle.push(classes.Disabled);

    return (
      <div className={classes.Listing}>
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
            className={heartStyle.join(" ")}
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
            {(this.state.likedUsers.length - 1) +
              (this.state.likedUsers.length < 3 ? " like" : " likes")}
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
