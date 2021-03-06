import {
  faStar,
  faFileUpload,
  faTimes,
  faBook,
  faTasks,
  faHandHoldingUsd,
  faCommentDots,
  faImage,
  faChevronDown,
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
import DropDown from "../../../components/UI/Dropdown/DropDown";
class Profile extends Component {
  state = {
    showPastListing: true,
    showOnRent: false,
    showRequest: false,
    showComments: false,

    reportError: "",

    showDropDown: false,

    imageAsFile: "",
    editProfileImage: false,

    comments: [],
    numReviews: 0,
    numStars: 0,

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

    database
      .ref()
      .child("feedbacks")
      .push({ reportDetails })
      .catch((error) => {
        let message;
        switch (error.getCode()) {
          case -24: //NETWORK_ERROR
          case -4: //DISCONNECTED
            message =
              "Oops, please check your network connection and try again!";
            break;
          case -10: //UNAVAILABLE
          case -2: //OPERATION_FAILED
            message =
              "Oops, the service is currently unavailable. Please try again later!";
            break;
          default:
            message = "Oops, something went wrong. Please try again later!";
        }
        this.setState({
          reportError: message,
          showSummary: false,
        });
      });

    this.reset();
  };

  toggleDropDown = (prevState) => {
    this.setState((prevState) => ({ showDropDown: !prevState.showDropDown }));
  };

  render() {
    // edit profile image
    let editProfileImage = (
      <Modal show={this.state.editProfileImage}>
        <div className={classes.reportSummary}>
          {this.props.updatingUserDetails ? (
            <div className={classes.PopUpColumnFlex}>
              <Spinner />
              <p style={{ color: "red", fontWeight: "bold" }}>
                Please do not close window...
              </p>
            </div>
          ) : this.props.updatedUserDetails ? (
            <div className={classes.PopUpColumnFlex}>
              <p style={{ color: "green", fontWeight: "bold" }}>Uploaded!</p>
              <Button onClick={this.cancelEditProfileImageHandler}>
                {
                  <FontAwesomeIcon
                    icon={faTimes}
                    style={{ paddingRight: "5px" }}
                  />
                }
                Go back
              </Button>
            </div>
          ) : (
            <div className={classes.PopUpColumnFlex}>
              <span
                style={{
                  paddingBottom: "10px",
                }}
              >
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
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ paddingRight: "5px" }}>
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
                </span>
                <Button onClick={this.cancelEditProfileImageHandler}>
                  {
                    <FontAwesomeIcon
                      icon={faTimes}
                      style={{ paddingRight: "5px" }}
                    />
                  }
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    );

    const numStar = (
      <div className={classes.starReviews}>
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
        <br />(
        {this.state.numReviews <= 1
          ? this.state.numReviews + " review"
          : this.state.numReviews + " reviews"}
        )
      </div>
    );

    // navigation bar and drop down
    const activeDropDownStyle = { backgroundColor: "#ffb3a7" };

    const activeButtonStyle =
      this.props.windowWidth <= 950
        ? {
            color: "#dd5641",
            outline: "none",
            width: "100%",
          }
        : {
            fontWeight: "bold",
            color: "#dd5641",
            outline: "none",
            borderBottom: "3px solid #dd5641",
          };

    let navigationDropDown = (
      <div className={classes.dropdownContent}>
        <DropDown
          icon={faBook}
          onClick={() => {
            this.onShowPastPostHandler();
            this.toggleDropDown();
          }}
          text={"Listings"}
          style={
            this.props.filterType === "displayName" && !this.state.showComments
              ? activeDropDownStyle
              : null
          }
        />
        <DropDown
          icon={faTasks}
          onClick={() => {
            this.onShowRequestHandler();
            this.toggleDropDown();
          }}
          text={"Requests"}
          style={
            this.props.filterType === "requests" && !this.state.showComments
              ? activeDropDownStyle
              : null
          }
        />
        <DropDown
          icon={faHandHoldingUsd}
          onClick={() => {
            this.onShowOnRentHandler();
            this.toggleDropDown();
          }}
          text={"On Rent"}
          style={
            this.props.filterType === "onRent" && !this.state.showComments
              ? activeDropDownStyle
              : null
          }
        />
        <DropDown
          icon={faCommentDots}
          onClick={() => {
            this.onShowReviewsHandler();
            this.toggleDropDown();
          }}
          text={"Reviews"}
          style={this.state.showComments ? activeDropDownStyle : null}
        />
      </div>
    );

    let navigationBar = (
      <div className={classes.Navigation}>
        <button
          onClick={() => {
            this.onShowPastPostHandler();
          }}
          style={
            this.props.filterType === "displayName" && !this.state.showComments
              ? activeButtonStyle
              : null
          }
        >
          {<FontAwesomeIcon icon={faBook} style={{ paddingRight: "5px" }} />}
          Listings
        </button>
        <button
          onClick={() => {
            this.onShowRequestHandler();
          }}
          style={
            this.props.filterType === "requests" && !this.state.showComments
              ? activeButtonStyle
              : null
          }
        >
          {<FontAwesomeIcon icon={faTasks} style={{ paddingRight: "5px" }} />}
          Requests
        </button>
        <button
          onClick={() => {
            this.onShowOnRentHandler();
          }}
          style={
            this.props.filterType === "onRent" && !this.state.showComments
              ? activeButtonStyle
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
          onClick={() => {
            this.onShowReviewsHandler();
          }}
          style={this.state.showComments ? activeButtonStyle : null}
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
    );

    let navigation;

    if (this.props.windowWidth <= 950) {
      const currentItemShowing = (
        <div className={classes.Navigation} onClick={this.toggleDropDown}>
          <div>
            {this.state.showPastListing ? (
              <button style={activeButtonStyle}>
                <FontAwesomeIcon
                  icon={faBook}
                  style={{
                    paddingRight: "5px",
                  }}
                />
                Listings
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{
                    paddingLeft: "5px",
                  }}
                />
              </button>
            ) : this.state.showRequest ? (
              <button style={activeButtonStyle}>
                <FontAwesomeIcon
                  icon={faTasks}
                  style={{
                    paddingRight: "5px",
                  }}
                />
                Requests
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{
                    paddingLeft: "1px",
                  }}
                />
              </button>
            ) : this.state.showOnRent ? (
              <button style={activeButtonStyle}>
                <FontAwesomeIcon
                  icon={faHandHoldingUsd}
                  style={{
                    paddingRight: "5px",
                  }}
                />
                On Rent
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{
                    paddingLeft: "5px",
                  }}
                />
              </button>
            ) : (
              <button style={activeButtonStyle}>
                <FontAwesomeIcon
                  icon={faCommentDots}
                  style={{
                    paddingRight: "5px",
                  }}
                />
                Reviews
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{
                    paddingLeft: "5px",
                  }}
                />
              </button>
            )}
          </div>
        </div>
      );

      navigation = (
        <div className={classes.DropDownContent}>
          {currentItemShowing}
          {this.state.showDropDown ? navigationDropDown : null}
        </div>
      );
    } else {
      navigation = navigationBar;
    }

    let profile = (
      <div className={classes.UserDetails}>
        <div className={classes.tooltip}>
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
          <span className={classes.tooltiptext}>Click to edit</span>
        </div>
        <div>
          <p className={classes.displayName}>@{this.props.displayName}</p>
          {numStar}
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
          <p style={{ cursor: "pointer" }} onClick={this.showReportModal}>
            <span style={{ color: "orange" }}>
              {
                <FontAwesomeIcon
                  icon={faLightbulb}
                  style={{ paddingRight: "5px" }}
                />
              }
              Submit feedback
            </span>
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
        <div className={classes.reportSummary}>{form}</div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
        </div>
      </Modal>
    );

    let reportSummary = (
      <Modal show={this.state.showSummary}>
        <div className={classes.reportSummary}>
          <h1>Confirm feedback details:</h1>
          <p>
            <b>feedback area: </b>
            {this.state.dataForm.feedback.value}
          </p>
          <p>
            <b>Description: </b>
            <br />
            {this.state.dataForm.description.value}
          </p>
          <p style={{ fontSize: "small" }}>
            <i>{this.state.dataForm.followUp.value}</i>
            <br />
            <i style={{ fontSize: "x-small" }}>
              {this.state.dataForm.followUp.value ===
              "I wish to be contacted for follow-up"
                ? "(You will be contacted via registered email address)"
                : null}
            </i>
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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

    let reportErrorPopUp = (
      <Modal show={this.state.showSummary}>
        <div className={classes.reportSummary}>
          <p style={{ color: "red", fontSize: "small" }}>
            {this.state.reportError}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button onClick={this.closeReportSummary}>
            {<FontAwesomeIcon icon={faEdit} style={{ paddingRight: "5px" }} />}
            Back
          </Button>
        </div>
      </Modal>
    );

    return (
      <div className={classes.profile}>
        {this.state.feedbackPopup ? feedbackPopup : null}
        {this.state.showSummary ? reportSummary : null}
        {this.state.reportError ? reportErrorPopUp : null}
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
                <h3 style={{ color: "grey" }}>Oops...No reviews</h3>
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
    windowWidth: state.window.width,
    filterType: state.search.filterType,
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
