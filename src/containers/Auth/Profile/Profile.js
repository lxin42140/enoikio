import {
  faStar,
  faFileUpload,
  faTimes,
  faBook,
  faTasks,
  faHandHoldingUsd,
  faCommentDots,
  faImage,
  faEdit,
  faLightbulb,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

import profileImage from "../../../assets/Images/chats/profile";
import Comment from "../../../components/Comment/Comment";
import Button from "../../../components/UI/Button/Button";
import Modal from "../../../components/UI/Modal/Modal";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { database, storage } from "../../../firebase/firebase";
import * as actions from "../../../store/actions/index";
import FilterResults from "../../util/FilterResults";
import * as classes from "./Profile.css";
import Input from "../../../components/UI/Input/Input";
class Profile extends Component {
  state = {
    showPastListing: true,
    showOnRent: false,
    showRequest: false,
    showComments: false,

    imageAsFile: "",
    editProfileImage: false,

    comments: [],
    numReviews: 0,
    numStars: 0,

    //

    feedbackPopup: false,
    showSummary: false,
    dataForm: {
      feedback: {
        elementType: "select",
        elementConfig: {
          options: [
            {
              value: "Discovered bugs",
              displayValue: "Discovered bugs",
            },
            {
              value: "Improvements",
              displayValue: "Improvements",
            },
            {
              value: "Others",
              displayValue: "Others",
            },
          ],
        },
        value: "Discovered bugs",
        validation: false,
        valid: true,
        touched: false,
      },
      description: {
        elementType: "textarea",
        elementConfig: {
          type: "text",
          placeholder:
            "We value all feedback. Please describe your feedback in detail.",
        },
        validation: {
          required: true,
        },
        value: "",
        valid: false,
        touched: false,
      },
      followUp: {
        elementType: "select",
        elementConfig: {
          options: [
            {
              value: "I wish to be contacted for follow-up",
              displayValue: "I wish to be contacted for follow-up",
            },
            {
              value: "I do not wish to be contacted for follow-up",
              displayValue: "I do not wish to be contacted for follow-up",
            },
          ],
        },
        value: "I do not wish to be contacted for follow-up",
        validation: false,
        valid: true,
        touched: false,
      },
    },
    formIsValid: false,
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

    let query =
      "/searchProfile?from=" +
      this.props.history.location.pathname +
      "&&profile=" +
      formattedDisplayName;

    this.props.history.push(query);
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (rules) {
      if (rules.required) {
        isValid = value.trim() !== "" && isValid;
      }
    }
    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedDataForm = {
      ...this.state.dataForm,
    };
    const updatedFormElement = {
      ...updatedDataForm[inputIdentifier],
    };
    updatedFormElement.value = event.target.value;

    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );

    updatedFormElement.touched = true;
    updatedDataForm[inputIdentifier] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifiers in updatedDataForm) {
      if (!updatedDataForm[inputIdentifiers].valid) {
        formIsValid = false;
        break;
      }
    }
    this.setState({ dataForm: updatedDataForm, formIsValid: formIsValid });
  };
  showReportModal = () => {
    this.setState({
      feedbackPopup: true,
    });
  };

  closeReportModal = () => {
    this.setState({
      feedbackPopup: false,
    });
  };

  showReportSummary = () => {
    this.setState({
      feedbackPopup: false,
      showSummary: true,
    });
  };

  closeReportSummary = () => {
    this.setState({
      feedbackPopup: true,
      showSummary: false,
    });
  };

  reset = () => {
    this.setState({
      feedbackPopup: false,
      showSummary: false,
      dataForm: {
        feedback: {
          elementType: "select",
          elementConfig: {
            options: [
              {
                value: "Discovered bugs",
                displayValue: "Discovered bugs",
              },
              {
                value: "Improvements",
                displayValue: "Improvements",
              },
              {
                value: "Others",
                displayValue: "Others",
              },
            ],
          },
          value: "Discovered bugs",
          validation: false,
          valid: true,
          touched: false,
        },
        description: {
          elementType: "textarea",
          elementConfig: {
            type: "text",
            placeholder:
              "We value all feedback. Please describe your feedback in details",
          },
          validation: {
            required: true,
          },
          value: "",
          valid: false,
          touched: false,
        },
        followUp: {
          elementType: "select",
          elementConfig: {
            options: [
              {
                value: "I wish to be contacted for follow-up",
                displayValue: "I wish to be contacted for follow-up",
              },
              {
                value: "I do not wish to be contacted for follow-up",
                displayValue: "I do not wish to be contacted for follow-up",
              },
            ],
          },
          value: "I do not wish to be contacted for follow-up",
          validation: false,
          valid: true,
          touched: false,
        },
      },
      formIsValid: false,
    });
  };

  submitReportHandler = () => {
    const date = moment().format("DD/MM/YYYY");
    const time = moment().format("HH:mm:ss");
    const unique = this.props.displayName + Date.now();
    const formData = {};

    for (let key in this.state.dataForm) {
      formData[key] = this.state.dataForm[key].value;
    }

    const reportDetails = {
      unique: unique,
      date: date,
      time: time,
      reportDetails: formData,
      reportedBy: this.props.displayName,
    };

    database.ref().child("feedbacks").push({ reportDetails });

    this.reset();
  };
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
        <p>
          (
          {this.state.numReviews <= 1
            ? this.state.numReviews + " review"
            : this.state.numReviews + " reviews"}
          )
        </p>
      </div>
    );

    let profile = (
      <ul className={classes.ProfileList}>
        <li onClick={this.editProfileImageHandler}>
          <img
            className={classes.ProfileImage}
            src={
              this.props.photoURL === "" ? profileImage : this.props.photoURL
            }
            alt="profile"
            style={{ cursor: "pointer" }}
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
        <li style={{ cursor: "pointer" }} onClick={this.showReportModal}>
          <span style={{ color: "orange" }}>
            {
              <FontAwesomeIcon
                icon={faLightbulb}
                style={{ paddingRight: "5px" }}
              />
            }
            Submit feedback
          </span>
        </li>
      </ul>
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

    const formElementsArray = [];

    for (let key in this.state.dataForm) {
      formElementsArray.push({
        id: key,
        config: this.state.dataForm[key],
      });
    }

    let form = null;
    if (this.state.feedbackPopup) {
      form = formElementsArray.map((formElement) => (
        <Input
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          valid={formElement.config.valid}
          shouldValidate={formElement.config.validation}
          touched={formElement.config.touched}
          change={(event) => this.inputChangedHandler(event, formElement.id)}
        />
      ));
    }

    let feedbackPopup = (
      <Modal show={this.state.feedbackPopup}>
        {form}
        <Button
          btnType="Important"
          disabled={!this.state.formIsValid}
          onClick={this.showReportSummary}
        >
          {<FontAwesomeIcon icon={faCheck} style={{ paddingRight: "5px" }} />}
          Review
        </Button>
        <Button onClick={this.closeReportModal}>
          {<FontAwesomeIcon icon={faTimes} style={{ paddingRight: "5px" }} />}
          Cancel
        </Button>
      </Modal>
    );

    let reportSummary = (
      <Modal show={this.state.showSummary}>
        <h1>Confirm feedback details:</h1>
        <p>
          <b>feedback area: </b>
          {this.state.dataForm.feedback.value}
        </p>
        <p style={{ textAlign: "start" }}>
          <b>Description: </b>
          <br />
          {this.state.dataForm.description.value}
        </p>
        <p style={{ fontSize: "small" }}>
          <i>{this.state.dataForm.followUp.value}</i>
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button btnType="Important" onClick={this.submitReportHandler}>
            {
              <FontAwesomeIcon
                icon={faLightbulb}
                style={{ paddingRight: "5px" }}
              />
            }
            Submit
          </Button>
          <Button onClick={this.closeReportSummary}>
            {<FontAwesomeIcon icon={faEdit} style={{ paddingRight: "5px" }} />}
            Edit
          </Button>
        </div>
      </Modal>
    );

    return (
      <div>
        {feedbackPopup}
        {reportSummary}
        <div className={classes.smallScreen}>
          <div className={classes.Background} />
          <div className={classes.Navigation}>
            <button
              onClick={this.onShowPastPostHandler}
              style={
                this.state.showPastListing
                  ? {
                      fontWeight: "bold",
                      color: "#dd5641",
                      borderBottom: "3px solid #dd5641",
                      outline: "none",
                    }
                  : null
              }
            >
              {
                <FontAwesomeIcon
                  icon={faBook}
                  style={{ paddingRight: "5px" }}
                />
              }
              Listings
            </button>
            <button
              onClick={this.onShowRequestHandler}
              style={
                this.state.showRequest
                  ? {
                      fontWeight: "bold",
                      color: "#dd5641",
                      borderBottom: "3px solid #dd5641",
                      outline: "none",
                    }
                  : null
              }
            >
              {
                <FontAwesomeIcon
                  icon={faTasks}
                  style={{ paddingRight: "5px" }}
                />
              }
              Requests
            </button>
            <button
              onClick={this.onShowOnRentHandler}
              style={
                this.state.showOnRent
                  ? {
                      fontWeight: "bold",
                      color: "#dd5641",
                      borderBottom: "3px solid #dd5641",
                      outline: "none",
                    }
                  : null
              }
            >
              {
                <FontAwesomeIcon
                  icon={faHandHoldingUsd}
                  style={{ paddingRight: "5px" }}
                />
              }
              On rent
            </button>
            <button
              onClick={this.onShowReviewsHandler}
              style={
                this.state.showComments
                  ? {
                      fontWeight: "bold",
                      color: "#dd5641",
                      borderBottom: "3px solid #dd5641",
                      outline: "none",
                    }
                  : null
              }
            >
              {
                <FontAwesomeIcon
                  icon={faCommentDots}
                  style={{ paddingRight: "5px" }}
                />
              }
              Reviews
            </button>
          </div>
          <div className={classes.Profile}>
            <div className={classes.ProfileDetails}>{profile}</div>
            {editProfileImage}
            <div className={classes.OtherInfo}>
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
      </div>
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
