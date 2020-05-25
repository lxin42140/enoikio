import React, { Component } from "react";

import classes from "./Listing.css";
import Button from "../../../components/UI/Button/Button";
import { storage } from "../../../firebase/firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";

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

        {this.props.showFullListing ?
          <FontAwesomeIcon
            icon={faWindowClose}
            style={{
              justifyContent: 'flex-start',
              verticalAlign: 'top'
            }}
            onClick={this.props.clicked} /> : null}

        <ul className={classes.Description}>
          <li>
            <strong>{this.props.textbook}</strong>
          </li>
          <li>{this.props.module}</li>
          <li>${this.props.price}</li>
        </ul>

        {this.props.showFullListing ? (
            <ul className={classes.Description}>
              <li>{this.props.deliveryMethod}</li>
              <li>{this.props.location}</li>
              <br />
              <li>Description: <br /> {this.props.description}</li>
            </ul>
        ) : null}

        <p className={classes.Description}>Posted by: {this.props.userId}</p>
      </React.Fragment>
    );

    return (
      <div className={classes.Listing}>
        {listing}
        <br />
        <span className={classes.RentButton}>
          <Button btnType="Important">Rent now</Button>
        </span>
      </div>
    );
  }
}

export default Listing;
