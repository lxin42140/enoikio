import React, { Component } from "react";

import classes from "./Listing.css";
import Button from "../../../components/UI/Button/Button";
import { storage } from "../../../firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWindowClose,
  faHeart,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";

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
        .child(this.props.identifier)
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

  onRedirectToAuth = (event) => {
    this.props.history.push("/auth");
  };

  //TODO: support display of more than one image
  render() {
    let listing = (
      <React.Fragment>
        <div className={classes.Textbook}>
          <p>
            {this.props.module}:《{this.props.textbook}》
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <img
            src={this.state.image}
            alt={this.state.error ? "Unable to load image" : "Loading image..."}
            className={classes.Image}
          />
        </div>
        <div>
          <ul className={classes.Description}>
            <li>Price: ${this.props.price} / month</li>
            <li>Delivery method: {this.props.deliveryMethod}</li>
            <li>Location: {this.props.location}</li>
            {this.props.showFullListing ? (
              <li>
                <br/>
                Description: <br /> {this.props.description}
              </li>
            ) : null}
            <br />
            <li>Posted by: {this.props.userId}</li>
          </ul>
        </div>
      </React.Fragment>
    );

    const style = this.props.showFullListing
      ? classes.FullListing
      : classes.Listing;

    return (
      <div className={style}>
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
        ) : (
          <FontAwesomeIcon
            icon={faExternalLinkAlt}
            style={{
              float: "right",
              paddingLeft: "10px",
              color: "#ff5138",
            }}
            onClick={this.props.onShowFullListing}
          />
        )}
        {listing}
        <br />

        <div className={classes.Selection}>
          {this.props.isAuthenticated ? (
            <Button btnType="Important">Rent now</Button>
          ) : (
            <Button btnType="Important" onClick={this.onRedirectToAuth}>
              Rent now
            </Button>
          )}
          <FontAwesomeIcon icon={faHeart} style={{ color: "red" }} />
        </div>
      </div>
    );
  }
}

export default Listing;
