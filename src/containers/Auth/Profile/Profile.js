import {
  faStar,
  faFileUpload,
  faTimes,
  faBook,
  faTasks,
  faHandHoldingUsd,
  faCommentDots,
  faImage,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { connect } from "react-redux";
import profileImage from "../../../assets/Images/chats/profile";
import Comment from "../../../components/Comment/Comment";
import Button from "../../../components/UI/Button/Button";
import Modal from "../../../components/UI/Modal/Modal";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { database, storage } from "../../../firebase/firebase";
import * as actions from "../../../store/actions/index";
import FilterResults from "../../util/FilterResults";
import * as classes from "./Profile.css";

class Profile extends Component {
  state = {
    showPastListing: true,
    showOnRent: false,
    showRequest: false,
    showComments: false,

    showDropDown: false,

    imageAsFile: "",
    editProfileImage: false,

    comments: [],
    numReviews: 0,
    numStars: 0,
  };

  componentWillUnmount() {
    if (!this.props.updatingUserDetails || !this.props.updatedUserDetails) {
      this.props.resetUserUpdate();
    }
  }

  componentDidMount() {
    database
      .ref()
      .child("users")
      .on("value", (snapShot) => {
        if (snapShot.exists()) {
          snapShot.forEach((data) => {
            if (data.val().displayName === this.props.displayName) {
              const reviews = Object.assign([], data.val().reviews);
              const numReviews = reviews.length;
              let numStars = reviews.reduce((total, num) => (total += num), 0);
              numStars = Math.floor(numStars / numReviews);

              const comments = Object.assign([], data.val().comments).filter(
                (comment) => !comment.isListingOwner
              );
              comments.reverse();
              this.setState({
                numReviews: numReviews,
                numStars: numStars,
                comments: comments,
              });
            }
          });
        }
      });
  }

  onShowPastPostHandler = () => {
    this.props.setFilterTermForListing("displayName", "");
    this.setState({
      showPastListing: true,
      showOnRent: false,
      showRequest: false,
      showComments: false,
    });
  };

  onShowRequestHandler = () => {
    this.props.setFilterTermForListing(
      "requests",
      this.props.displayName.toLowerCase().split(" ").join("")
    );
    this.setState({
      showPastListing: false,
      showOnRent: false,
      showRequest: true,
      showComments: false,
    });
  };

  onShowOnRentHandler = () => {
    this.props.setFilterTermForListing("onRent", "");
    this.setState({
      showPastListing: false,
      showOnRent: true,
      showRequest: false,
      showComments: false,
    });
  };

  onShowReviewsHandler = () => {
    this.setState({
      showPastListing: false,
      showOnRent: false,
      showRequest: false,
      showComments: true,
    });
  };

  editProfileImageHandler = () => {
    if (!this.props.updatingUserDetails || !this.props.updatedUserDetails) {
      this.props.resetUserUpdate();
    }
    this.setState({
      editProfileImage: true,
    });
  };

  cancelEditProfileImageHandler = () => {
    this.setState({
      editProfileImage: false,
    });
  };

  submitNewProfileImage = () => {
    this.props.updateUserDetailsInit();
    storage
      .ref()
      .child("userProfilePictures")
      .child(this.props.displayName)
      .put(this.state.imageAsFile)
      .then((res) => {
        storage
          .ref()
          .child("userProfilePictures")
          .child(this.props.displayName)
          .getDownloadURL()
          .then((url) => this.props.updatePhotoUrl(this.props.user, url));
      });
  };

  handleImageAsFile = (event) => {
    this.setState({
      imageAsFile: event.target.files[0],
    });
  };

  searchProfileHandler = (displayName) => {
    let formattedDisplayName = displayName.toLowerCase().split(" ").join("");
    this.props.setFilterProfile(formattedDisplayName);
    this.props.history.push("/searchProfile?profile=" + formattedDisplayName);
  };

  toggleDropDown = (prevState) => {
    this.setState(prevState => ({showDropDown: !prevState.showDropDown }))
  }

  render() {
    let editProfileImage = (
      <Modal show={this.state.editProfileImage}>
        {this.props.updatingUserDetails ? (
          <React.Fragment>
            <Spinner />
            <p style={{ color: "red", fontWeight: "bold" }}>
              Please do not close window...
            </p>
          </React.Fragment>
        ) : this.props.updatedUserDetails ? (
          <React.Fragment>
            <p style={{ color: "green", fontWeight: "bold" }}>Done!</p>
            <Button onClick={this.cancelEditProfileImageHandler}>
              {
                <FontAwesomeIcon
                  icon={faTimes}
                  style={{ paddingRight: "5px" }}
                />
              }
              Go back
            </Button>
          </React.Fragment>
        ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ paddingBottom: "10px" }}>
                  {
                    <FontAwesomeIcon
                      icon={faImage}
                      style={{ paddingRight: "5px", color: "#f3a1a1" }}
                    />
                  }
                  <input
                    type="file"
                    accept=".png,.jpeg, .jpg"
                    style={{ width: "fit-content" }}
                    onChange={this.handleImageAsFile}
                  />
                </div>
                <div>
                  <Button onClick={this.cancelEditProfileImageHandler}>
                    {
                      <FontAwesomeIcon
                        icon={faTimes}
                        style={{ paddingRight: "5px" }}
                      />
                    }
                Cancel
              </Button>
                  <Button
                    btnType="Important"
                    onClick={this.submitNewProfileImage}
                    disabled={this.state.imageAsFile === ""}
                  >
                    {
                      <FontAwesomeIcon
                        icon={faFileUpload}
                        style={{ paddingRight: "5px" }}
                      />
                    }
                Upload
              </Button>
                </div>
              </div>
            )}
      </Modal>
    );

    const numStar = (
      <div
        style={{
          textAlign: "left",
          fontSize: "20px",
          alignItems: "center",
        }}
      >
        <p>
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
        /> (
          {this.state.numReviews <= 1
            ? this.state.numReviews + " review"
            : this.state.numReviews + " reviews"}
          )
        </p>
      </div>
    );

    const activeButtonStyle = {
      fontWeight: "bold",
      color: "#dd5641",
      borderBottom: "3px solid #dd5641",
      outline: "none",
    };

    let tabs = (
      <div className={classes.DropDown}>
        <button
          onClick={() => {
            this.onShowPastPostHandler();
            this.props.windowWidth <= 950 ? 
            this.toggleDropDown() : 
            null}}
          style={this.state.showPastListing ? 
            activeButtonStyle : 
            null} >
          {<FontAwesomeIcon icon={faBook} style={{ paddingRight: "5px" }} />}
            Listings
        </button>
        <button
          onClick={() => {
            this.onShowRequestHandler();
            this.props.windowWidth <= 950 ? 
            this.toggleDropDown() : 
            null}}
          style={ this.state.showRequest ? 
            activeButtonStyle : 
            null} >
          {<FontAwesomeIcon icon={faTasks} style={{ paddingRight: "5px" }} />}
            Requests
          </button>
        <button
          onClick={() => {
            this.onShowOnRentHandler();
            this.props.windowWidth <= 950 ? 
            this.toggleDropDown() : 
            null}}
            style={ this.state.showOnRent ? 
              activeButtonStyle : 
              null} >
          {<FontAwesomeIcon icon={faHandHoldingUsd} style={{ paddingRight: "5px" }} />}
            On rent
        </button>
        <button
          onClick={() => {
            this.onShowReviewsHandler();
            this.props.windowWidth <= 950 ? 
            this.toggleDropDown() : 
            null}}
            style={ this.state.showComments ? 
              activeButtonStyle : 
              null} >
          {<FontAwesomeIcon icon={faCommentDots} style={{ paddingRight: "5px" }} />}
            Reviews
        </button>
      </div>
    );

    let navigation;

    if (this.props.windowWidth > 950) {
      navigation = tabs;
    } else {
      const currentItemShowing = (
        <div
          className={classes.Navigation}
          onClick={this.toggleDropDown}>
          {this.state.showPastListing ?
            <button style={activeButtonStyle}>
              <FontAwesomeIcon
                icon={faBook}
                style={{
                  paddingRight: "5px",
                }} />
            Listings
          </button> : this.state.showRequest ?
              <button style={activeButtonStyle}>
                <FontAwesomeIcon
                  icon={faTasks}
                  style={{
                    paddingRight: "5px",
                  }} />
            Requests
          </button> : this.state.showOnRent ?
                <button style={activeButtonStyle}>
                  <FontAwesomeIcon
                    icon={faHandHoldingUsd}
                    style={{
                      paddingRight: "5px",
                    }} />
            On Rent
          </button> :
                <button style={activeButtonStyle}>
                  <FontAwesomeIcon
                    icon={faHandHoldingUsd}
                    style={{
                      paddingRight: "5px",
                    }} />
             Reviews
           </button>}
           <div>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={classes.arrowDown}
            />
          </div>
        </div>
      );

      const dropDown = this.state.showDropDown ?
        tabs : 
        null;

      navigation = (
        <div className={classes.DropDownContent}>
          {currentItemShowing}
          <div className={classes.filter}>{dropDown}</div>
        </div>
      );
    }

    let profile = (
      <div className={classes.UserDetails}>
        <div onClick={this.editProfileImageHandler}>
          <img
            className={classes.ProfileImage}
            src={
              this.props.photoURL === "" ? profileImage : this.props.photoURL
            }
            alt="profile"
            style={{ cursor: "pointer" }}
          />
        </div>
        <div>
        <p
          style={{
            fontSize: "30px",
            lineHeight: "38px",
            fontWeight: "400",
            color: "black",
          }}
        >
          @{this.props.displayName} {numStar}
        </p>
        <p>
          <b>Email: </b>
          {this.props.email}
        </p>
        <p>
          <b>Date joined: </b>
          {this.props.dateJoined}
        </p>
        <p>
          <b>Last sign in: </b>
          {this.props.lastSignIn}
        </p>
        </div>
      </div>
    );

    let reviews = null;
    if (this.state.showComments) {
      reviews = this.state.comments.map((comment) => (
        <li key={comment.key}>
          <Comment
            isListingOwner={comment.isListingOwner}
            profilePicture={comment.profilePicture}
            sender={comment.sender}
            date={comment.date}
            time={comment.time}
            numStars={comment.numStars}
            content={comment.content}
            key={comment.key}
            onClick={() => this.searchProfileHandler(comment.sender)}
          />
        </li>
      ));
    }

    return (
      <React.Fragment>
        <div className={classes.Background} />
        <div className={classes.Profile}>
          {profile}
          {editProfileImage}
          <div className={classes.Information}>
            {navigation}
            <div className={classes.Details}>
              {this.state.showPastListing ||
                this.state.showOnRent ||
                this.state.showRequest ? (
                  <FilterResults history={this.props.history} />
                ) : this.state.comments.length < 1 ? (
                  <h3>Oops..No reviews</h3>
                ) : (
                    <ul className={classes.Reviews}>{reviews}</ul>
                  )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    displayName: state.auth.displayName,
    photoURL: state.auth.photoURL,
    email: state.auth.email,
    uid: state.auth.uid,
    dateJoined: state.auth.dateJoined,
    lastSignIn: state.auth.lastSignIn,
    updatingUserDetails: state.auth.updatingUserDetails,
    updatedUserDetails: state.auth.updatedUserDetails,
    windowWidth: state.window.width,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFilterTermForListing: (filterType, searchObject) =>
      dispatch(actions.setFilterListings(filterType, searchObject)),
    setFilterProfile: (displayName) =>
      dispatch(actions.setFilterProfile(displayName.toLowerCase())),
    updateUserDetailsInit: () => dispatch(actions.updateUserDetailsInit()),
    updatePhotoUrl: (user, photoURL) =>
      dispatch(actions.updateUserDetails(user, photoURL)),
    resetUserUpdate: () => dispatch(actions.resetUserUpdate()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);