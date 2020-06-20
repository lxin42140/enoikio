import React, { Component } from "react";
import { connect } from "react-redux";

import * as classes from "./Profile.css";
import * as actions from "../../../store/actions/index";
import profileImage from "../../../assets/Images/chats/profile";
import FilterListings from "../../Listings/FilteredListings";
import { database } from "../../../firebase/firebase";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Profile extends Component {
  state = {
    initialLoad: true,
    showListing: true,
    showOffers: false,
    numReviews: 0,
    numStars: 0,
  };

  componentDidMount() {
    this.props.setFilterTerm("displayName");
    database
      .ref()
      .child("users")
      .once("value", (snapShot) => {
        if (snapShot.exists()) {
          snapShot.forEach((data) => {
            if (data.val().displayName === this.props.displayName) {
              const reviews = Object.assign([], data.val().reviews);
              const numReviews = reviews.length;
              let numStars = reviews.reduce((total, num) => (total += num), 0);
              numStars = Math.floor(numStars / numReviews);
              this.setState({
                numReviews: numReviews,
                numStars: numStars,
              });
            }
          });
        }
      });
  }

  onShowPastPostHandler = () => {
    this.props.setFilterTerm("displayName");
    this.setState({
      showListing: true,
      showOffers: false,
      initialLoad: false,
    });
  };

  onShowOffersHandler = () => {
    this.setState({
      showListing: false,
      showOffers: true,
      initialLoad: false,
    });
  };

  render() {
    const numStar = (
      <div
        style={{
          textAlign: "left",
          fontSize: "20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <FontAwesomeIcon
          icon={faStar}
          style={
            this.state.numStars > 0 ? { color: "#ff5138" } : { color: "gray" }
          }
        />
        <FontAwesomeIcon
          icon={faStar}
          style={
            this.state.numStars > 1 ? { color: "#ff5138" } : { color: "gray" }
          }
        />
        <FontAwesomeIcon
          icon={faStar}
          style={
            this.state.numStars > 2 ? { color: "#ff5138" } : { color: "gray" }
          }
        />
        <FontAwesomeIcon
          icon={faStar}
          style={
            this.state.numStars > 3 ? { color: "#ff5138" } : { color: "gray" }
          }
        />
        <FontAwesomeIcon
          icon={faStar}
          style={
            this.state.numStars > 4 ? { color: "#ff5138" } : { color: "gray" }
          }
        />
        <p>({this.state.numReviews + " reviews"})</p>
      </div>
    );

    let profile = (
      <ul className={classes.ProfileList}>
        <li>
          <img
            className={classes.ProfileImage}
            src={profileImage}
            alt="profile"
          />
        </li>
        <li
          style={{
            fontSize: "30px",
            lineHeight: "38px",
            fontWeight: "400",
            color: "black",
            marginTop: "-20px",
          }}
        >
          @{this.props.displayName}
        </li>
        <li
          style={{
            marginTop: "-30px",
          }}
        >
          {numStar}
        </li>
        <li>
          <b>Email: </b>
          {this.props.email}
        </li>
        <li>
          <b>Date joined: </b>
          {this.props.dateJoined}
        </li>
        <li>
          <b>Last sign in: </b>
          {this.props.lastSignIn}
        </li>
      </ul>
    );

    return (
      <React.Fragment>
        <div className={classes.Background} />
        <div className={classes.Navigation}>
          <button onClick={this.onShowPastPostHandler}>
            {this.state.initialLoad ? (
              <button
                style={{
                  fontWeight: "bold",
                  color: "#dd5641",
                  borderBottom: "3px solid #dd5641",
                  outline: "none",
                }}
              >
                Listings
              </button>
            ) : (
              "Listings"
            )}
          </button>
          <button onClick={this.onShowOffersHandler}>Offers</button>
        </div>
        <div className={classes.Profile}>
          <div className={classes.ProfileDetails}>{profile}</div>

          <div className={classes.OtherInfo}>
            <FilterListings history={this.props.history} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    /**------Auth--------- */
    displayName: state.auth.displayName,
    photoURL: state.auth.photoURL,
    email: state.auth.email,
    uid: state.auth.uid,
    dateJoined: state.auth.dateJoined,
    lastSignIn: state.auth.lastSignIn,
    /**------Past posts--------- */
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setFilterTerm: (filterType) =>
      dispatch(actions.setFilterListings(filterType, "")),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
