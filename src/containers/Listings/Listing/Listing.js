import React, { Component } from "react";

import classes from "./Listing.css";
import Button from "../../../components/UI/Button/Button";
import { storage } from "../../../firebase/firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose, faHeart } from "@fortawesome/free-solid-svg-icons";

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
    if (this.state.image === "") {
      storage
        .ref("listingPictures/")
        .child(this.props.textbook)
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
  }

  //TODO: support display of more than one image
  render() {
    let listing = (
      <ul className={classes.Description}>
        <p className={classes.Textbook}>
          {this.props.module}:《{this.props.textbook}》
        </p>
        <img
          src={this.state.image}
          alt={this.state.error ? "Unable to load image" : "Loading image..."}
          className={classes.Image}
        />
        <li>Price: ${this.props.price} / month</li>
        <li>Delivery method: {this.props.deliveryMethod}</li>
        <li>Location: {this.props.location}</li>
        {this.props.showFullListing ? (
          <React.Fragment>
            <li>
              Description: <br /> {this.props.description}
            </li>
          </React.Fragment>
        ) : null}
        <br />
        <li>Posted by: {this.props.userId}</li>
      </ul>
    );

    return (
      <div className={classes.Listing} onClick={this.props.onShowFullListing}>
        {this.props.showFullListing ? (
          <FontAwesomeIcon
            icon={faWindowClose}
            style={{
              float: "right",
              paddingLeft: "10px",
              color: "#ff5138",
            }}
            onClick={this.props.onHideFullListing}
          />
        ) : null}
        {listing}
        <br />
        <div className={classes.Selection}>
          <Button btnType="Important">Rent now</Button>
          <FontAwesomeIcon icon={faHeart} style={{ color: "red" }} />
        </div>
      </div>
    );
  }
}

export default Listing;
