import React, { Component } from "react";

import classes from "./Listing.css";
import Button from "../../../components/UI/Button/Button";
import * as actions from "../../../store/actions/index";
import { storage } from "../../../firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

class Listing extends Component {
  state = {
    image: "",
    error: false,
    liked: false,
  };

  componentDidMount() {

    if (this.props.isAuthenticated) {
      //check whether the user is in the list that likes the post
      //if yes, setstate to true
      const likedUser = this.props.likedUsers.filter(name => 
        name === this.props.displayName)
      if (likedUser.length !== 0 && likedUser[0] === this.props.displayName) {
        this.setState({liked: true})
      } else {
        this.setState({liked: false})
      }
    }

    storage
      .ref("/listingPictures/" + this.props.identifier)
      .child("0")
      .getDownloadURL()
      .then((url) => {
        this.setState({
          image: url,
        });
      })
      .catch((error) => {
        this.setState({ error: true });
      });
  }

  // onRedirectToAuth = (event) => {
  //   this.props.history.push("/auth");
  // };

  expandListingHandler = () => {
    this.props.dispatchExpandedListing(this.props.identifier);

    this.props.history.push({
      pathname: "/expanded-listing",
      search: "?" + this.props.identifier,
    });
  };

  //TODO: add onclick handler that supports likes,
  //1. when clicked, trigger heart icon to change color from lighter to darker, and number of heart counts increase by 1
  //2. change should be uploaded to data base in the background
  //3. heart icon remains as liked when the same user is logged in

  toggleLikePostHandler = () => {

    if (this.state.liked) {
      //remove the name from the list
      this.props.dispatchFavouriteListing(this.props.displayName, this.props.node, "UNLIKE");
    } else {
      //if authenticated, add the name into the list
      if (this.props.isAuthenticated) {
        this.props.dispatchFavouriteListing(this.props.displayName, this.props.node, "LIKE");
      } else { //else, bring him to auth page
        this.props.history.push("/auth");
      }
    }

    this.setState(prevState => {
      return {liked: !prevState.liked}
    });
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
            <li>Status: {this.props.status}</li>
            <li>Price: ${this.props.price} / month</li>
            <li>Delivery method: {this.props.deliveryMethod}</li>
            <li>Location: {this.props.location}</li>
            <br />
            <li>Posted by: {this.props.userId}</li>
          </ul>
        </div>
      </React.Fragment>
    );

    const heartStyle = [classes.Icon];
     this.state.liked ? 
      heartStyle.push(classes.Enabled) :
      heartStyle.push(classes.Disabled);

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
            className={heartStyle.join(' ')}
            onClick={this.toggleLikePostHandler} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    displayName: state.auth.displayName
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchExpandedListing: (identifier) =>
      dispatch(actions.fetchExpandedListing(identifier)),
    dispatchFavouriteListing: (name, node, type) => 
      dispatch(actions.toggleFavouriteListing(name, node, type)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Listing);
