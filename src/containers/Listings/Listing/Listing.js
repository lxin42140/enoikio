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
  };

  //TODO: add onclick handler that supports likes,
  //1. when clicked, trigger heart icon to change color from lighter to darker, and number of heart counts increase by 1
  //2. change should be uploaded to data base in the background
  //3. heart icon remains as liked when the same user is logged in

  componentDidMount() {
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

  expandListingHandler = (identifier) => {
    this.props.history.push({
      pathname: "/expanded-listing",
      search: "?" + identifier,
    });
  };

  render() {
    let listing = (
      <React.Fragment>
        <div className={classes.Textbook}>
          <p>
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

    return (
      <div className={classes.Listing}>
        {listing}
        <br />
        <div className={classes.Selection}>
          <Button
            btnType="Important"
            onClick={() => {
              this.props.dispatchExpandedListing(this.props.identifier);
              this.expandListingHandler(this.props.identifier);
            }}
          >
            Rent now
          </Button>
          <FontAwesomeIcon icon={faHeart} style={{ color: "red" }} />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchExpandedListing: (identifier) =>
      dispatch(actions.displayExpandedListing(identifier)),
  };
};

export default connect(null, mapDispatchToProps)(Listing);
