import React, { Component } from "react";

import classes from "./Listing.css";
import Button from "../../../components/UI/Button/Button";
import { storage } from "../../../firebase/firebase";

class Listing extends Component {
  state = {
    image: "",
    error: false,
  };

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

  render() {
    let listing = (
      <React.Fragment>
        <img
          src={this.state.image}
          alt={this.state.error ? "Unable to load image" : "Loading image..."}
          className={classes.Image}
        />
        <p className={classes.Textbook}>
          <strong>{this.props.textbook}</strong>
        </p>
        <p className={classes.Description}>{this.props.module}</p>
        <p className={classes.Description}>{this.props.price}</p>
        {this.props.showFullListing ? (
          <React.Fragment>
            <p className={classes.Description}>{this.props.deliveryMethod}</p>
            <p className={classes.Description}>{this.props.location}</p>
            <p className={classes.Description}>{this.props.description}</p>
          </React.Fragment>
        ) : null}
        <p className={classes.Description}>Posted by: {this.props.userId}</p>
      </React.Fragment>
    );

    return (
      <div className={classes.Listing}>
        {listing}
        <span className={classes.RentButton}>
          <Button btnType="Important">Rent now</Button>
        </span>
      </div>
    );
  }
}

export default Listing;
