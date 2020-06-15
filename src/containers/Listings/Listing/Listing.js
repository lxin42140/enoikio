import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

import classes from "./Listing.css";
import Button from "../../../components/UI/Button/Button";
import * as actions from "../../../store/actions/index";
import { storage, database } from "../../../firebase/firebase";
import { Link } from "react-router-dom";

class Listing extends Component {
  state = {
    image: "",
    error: false,
    liked: false,
    numberOfLikes: 0,
  };

  componentDidMount() {
    storage
      .ref("/listingPictures/" + this.props.identifier)
      .child("0/0")
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
              numberOfLikes: this.props.likedUsers.length,
            });
          } else {
            this.setState({
              liked: false,
              image: url,
              numberOfLikes: this.props.likedUsers.length,
            });
          }
        } else {
          this.setState({
            image: url,
            numberOfLikes: this.props.likedUsers.length,
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
            this.setState((prevState) => ({
              liked: false,
              numberOfLikes: prevState.numberOfLikes - 1,
            }));
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
            this.setState((prevState) => ({
              liked: true,
              numberOfLikes: prevState.numberOfLikes + 1,
            }));
          });
      }
    }
  };

  editListingHandler = () => {
    this.props.dispatchExpandedListing(this.props.identifier);
  }

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
                <p style={{ margin: "0px" }}>
                  <b>Status: </b>
                  {this.props.status}
                </p>
              ) : (
                  <p style={{ margin: "0px" }}>
                    Status: <br /> {this.props.status}
                  </p>
                )}
            </li>
            <li>
              <b>Price: </b>${this.props.price} / month
            </li>
            <li>
              <b>Delivery method: </b>
              {this.props.deliveryMethod}
            </li>
            <li>
              <b>Location: </b>
              {this.props.location}
            </li>
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
        {listing}
        <br />
        <div className={classes.Selection}>
          {this.props.userId === this.props.displayName ? (
            <Link to="/edit-post">
              <Button btnType="Important" onClick={this.editListingHandler}>
                Edit
              </Button>
            </Link>
          ) : (
            <Button btnType="Important" onClick={this.expandListingHandler}>
              Rent now
            </Button>
          )}
          <div style={{ display: "flex", alignItems: "center" }}>
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
              }}
            >
              {this.state.numberOfLikes + (this.state.numberOfLikes < 2 ? " like" : " likes")}
            </p>
          </div>
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
