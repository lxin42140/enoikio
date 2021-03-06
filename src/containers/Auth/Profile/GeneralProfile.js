import React, { Component } from "react";
import { connect } from "react-redux";
import {
  faExclamationTriangle,
  faTimes,
  faCheck,
  faEdit,
  faStar,
  faBook,
  faTasks,
  faCommentDots,
  faChevronDown,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { database } from "../../../firebase/firebase";
import Spinner from "../../../components/UI/Spinner/Spinner";
import * as actions from "../../../store/actions/index";
import Modal from "../../../components/UI/Modal/Modal";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import classes from "./Profile.css";
import FilterResults from "../../util/FilterResults";
import Comment from "../../../components/Comment/Comment";
import { Link } from "react-router-dom";
import DropDown from "../../../components/UI/Dropdown/DropDown";

class GeneralProfilePage extends Component {
  state = {
    loading: true,
    error: false,
    reportError: "",

    showPastListing: true,
    showRequests: false,
    showComments: false,

    showDropDown: false,

    formattedDisplayName: "",

    comments: [],
    numReviews: 0,
    numStars: 0,

    photoURL: "",
    displayName: "",
    dateJoined: "",
    lastSignIn: "",

    //

    reportUserPopup: false,
    showSummary: false,
    dataForm: {
      issue: {
        elementType: "select",
        elementConfig: {
          options: [
            {
              value: "Duplicated posts",
              displayValue: "Duplicated posts",
            },
            {
              value: "Counterfeits",
              displayValue: "Counterfeits",
            },
            {
              value: "Listings contain irrelevant keywords",
              displayValue: "Listings contain irrelevant keywords",
            },
            {
              value: "User did not fulfill agreement",
              displayValue: "User did not fulfill agreement",
            },
            {
              value: "Violent and criminal behaviour",
              displayValue: "Violent and criminal behaviour",
            },
            {
              value: "Others",
              displayValue: "Others",
            },
          ],
        },
        value: "Duplicated posts",
        validation: false,
        valid: true,
        touched: false,
      },
      description: {
        elementType: "textarea",
        elementConfig: {
          type: "text",
          placeholder: "Please describe the issue in a concise manner",
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

  componentDidMount() {
    this.fetchUserProfile();
  }

  componentDidUpdate() {
    if (this.props.history.location.search) {
      let searchQueryName = this.props.history.location.search
        .split("&&")[1]
        .split("=")[1];
      if (
        this.state.formattedDisplayName !== this.props.searchObject &&
        this.props.filterType === "searchProfile"
      ) {
        this.fetchUserProfile();
      } else if (searchQueryName !== this.state.formattedDisplayName) {
        this.searchProfileHandler(searchQueryName);
      }
    } else if (this.state.showPastListing && this.state.showRequests) {
      this.setState({ showRequests: false });
    }
  }

  fetchUserProfile = () => {
    database
      .ref()
      .child("users")
      .orderByChild("formattedDisplayName")
      .equalTo(this.props.searchObject)
      .once("value", (snapShot) => {
        if (snapShot.exists()) {
          snapShot.forEach((data) => {
            const reviews = Object.assign([], data.val().reviews);
            const numReviews = reviews.length;
            let numStars = reviews.reduce((total, num) => (total += num), 0);
            numStars = Math.floor(numStars / numReviews);

            const comments = Object.assign([], data.val().comments).filter(
              (comment) => !comment.isListingOwner
            );
            comments.reverse();
            this.setState({
              loading: false,
              error: false,

              showPastListing: true,
              showRequests: false,
              showComments: false,

              formattedDisplayName: this.props.searchObject,

              numReviews: numReviews,
              numStars: numStars,
              comments: comments,
              photoURL: data.val().photoURL,
              displayName: data.val().displayName,
              dateJoined: data.val().dateJoined,
              lastSignIn: data.val().lastSignIn,
            });
          });
        } else {
          this.setState({
            error: true,
            formattedDisplayName: this.props.searchObject,
          });
        }
      });
  };
  onShowPastPostHandler = () => {
    this.props.setFilterProfile(this.state.formattedDisplayName);
    this.setState({
      showPastListing: true,
      showRequests: false,
      showComments: false,
    });
  };

  onShowRequestHandler = () => {
    this.props.setFilterTermForListing(
      "requests",
      this.state.formattedDisplayName
    );
    this.setState({
      showPastListing: false,
      showRequests: true,
      showComments: false,
    });
  };
  onShowReviewsHandler = () => {
    this.setState({
      showPastListing: false,
      showRequests: false,
      showComments: true,
    });
  };

  onCancelSearchHandler = () => {
    if (this.props.history.location.search) {
      const pathName = this.props.history.location.search
        .split("&&")[0]
        .split("=")[1];

      this.props.history.push(pathName);
      this.props.setFilterTermForListing("displayName", "");
    } else {
      this.props.history.goBack();
    }
  };

  searchProfileHandler = (displayName) => {
    let formattedDisplayName = displayName.toLowerCase().split(" ").join("");
    if (
      this.props.displayName.toLowerCase().split(" ").join("") ===
      formattedDisplayName
    ) {
      this.props.setFilterTermForListing("displayName");
      this.props.history.push("/profile");
    } else {
      this.props.setFilterProfile(formattedDisplayName);

      let pathName = this.props.history.location.pathname;

      if (this.props.history.location.search) {
        pathName = this.props.history.location.search
          .split("&&")[0]
          .split("=")[1];
      }

      let query =
        "/searchProfile?from=" + pathName + "&&profile=" + formattedDisplayName;

      this.props.history.push(query);
    }
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
      reportUserPopup: true,
    });
  };

  closeReportModal = () => {
    this.setState({
      reportUserPopup: false,
    });
  };

  showReportSummary = () => {
    this.setState({
      reportUserPopup: false,
      showSummary: true,
    });
  };

  closeReportSummary = () => {
    this.setState({
      reportUserPopup: true,
      showSummary: false,
    });
  };

  reset = () => {
    this.setState({
      reportUserPopup: false,
      showSummary: false,
      dataForm: {
        issue: {
          elementType: "select",
          elementConfig: {
            options: [
              {
                value: "Duplicated posts",
                displayValue: "Duplicated posts",
              },
              {
                value: "Counterfeits",
                displayValue: "Counterfeits",
              },
              {
                value: "Listings contain irrelevant keywords",
                displayValue: "Listings contain irrelevant keywords",
              },
              {
                value: "User did not fulfill agreement",
                displayValue: "User did not fulfill agreement",
              },
              {
                value: "Violent and criminal behaviour",
                displayValue: "Violent and criminal behaviour",
              },
              {
                value: "Others",
                displayValue: "Others",
              },
            ],
          },
          value: "Duplicated posts",
          validation: false,
          valid: true,
          touched: false,
        },
        description: {
          elementType: "textarea",
          elementConfig: {
            type: "text",
            placeholder: "Please describe the issue in a concise manner",
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
      violatingUser: this.props.history.location.search
        .split("&&")[1]
        .split("=")[1],
    };

    database
      .ref()
      .child("reports")
      .push({ reportDetails })
      .catch(error => {
        let message;
        switch (error.getCode()) {
          case (-24): //NETWORK_ERROR
          case (-4): //DISCONNECTED
            message = "Oops, please check your network connection and try again!";
            break;
          case (-10): //UNAVAILABLE
          case (-2): //OPERATION_FAILED
            message = "Oops, the service is currently unavailable. Please try again later!";
            break;
          default:
            message = "Oops, something went wrong. Please try again later!";
        }
        this.setState({ 
          reportError: message, 
          showSummary: false, 
        })
      });

    this.reset();
  };

  toggleDropDown = (prevState) => {
    this.setState((prevState) => ({ showDropDown: !prevState.showDropDown }));
  };

  render() {
    if (this.state.error) {
      return (
        <h3 style={{ color: "grey" }}>
          Oops...The user you are looking for doesn't seem to exist
        </h3>
      );
    }

    if (this.state.loading) {
      return <Spinner />;
    }

    const formElementsArray = [];

    for (let key in this.state.dataForm) {
      formElementsArray.push({
        id: key,
        config: this.state.dataForm[key],
      });
    }

    let form = formElementsArray.map((formElement) => (
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

    let reportUser = (
      <Modal show={this.state.reportUserPopup}>
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
          <h1>Confirm report details:</h1>
          <p>
            <b>Issue: </b>
            {this.state.dataForm.issue.value}
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
                icon={faExclamationTriangle}
                style={{ paddingRight: "5px" }}
              />
            }
            Report
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
          <p style={{ color: "red", fontSize: "small" }}>{this.state.reportError}</p>
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
          style={this.state.showPastListing ? activeDropDownStyle : null}
        />
        <DropDown
          icon={faTasks}
          onClick={() => {
            this.onShowRequestHandler();
            this.toggleDropDown();
          }}
          text={"Requests"}
          style={this.state.showRequests ? activeDropDownStyle : null}
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

    // let tabs = (
    //   <div className={classes.dropdownContent}>
    //     {dropDown}
    // {
    /* <button
          onClick={() => {
            this.onShowPastPostHandler();
            if (this.props.windowWidth <= 950) {
              this.toggleDropDown();
            }
          }}
          style={this.state.showPastListing ? activeButtonStyle : null}
        >
          {<FontAwesomeIcon icon={faBook} style={{ paddingRight: "5px" }} />}
          Listings
        </button>
        <button
          onClick={() => {
            this.onShowRequestHandler();
            if (this.props.windowWidth <= 950) {
              this.toggleDropDown();
            }
          }}
          style={this.state.showRequests ? activeButtonStyle : null}
        >
          {<FontAwesomeIcon icon={faTasks} style={{ paddingRight: "5px" }} />}
          Requests
        </button>
        <button
          onClick={() => {
            this.onShowReviewsHandler();
            if (this.props.windowWidth <= 950) {
              this.toggleDropDown();
            }
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
        </button> */
    // }
    //   </div>
    // );

    let navigationBar = (
      <div className={classes.Navigation}>
        <button
          onClick={() => {
            this.onShowPastPostHandler();
          }}
          style={this.state.showPastListing ? activeButtonStyle : null}
        >
          {<FontAwesomeIcon icon={faBook} style={{ paddingRight: "5px" }} />}
          Listings
        </button>
        <button
          onClick={() => {
            this.onShowRequestHandler();
          }}
          style={this.state.showRequests ? activeButtonStyle : null}
        >
          {<FontAwesomeIcon icon={faTasks} style={{ paddingRight: "5px" }} />}
          Requests
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

    // if (this.props.windowWidth > 950) {
    //   navigation = tabs;
    // } else {
    //   const currentItemShowing = (
    //     <div className={classes.Navigation} onClick={this.toggleDropDown}>
    //       {this.state.showPastListing ? (
    //         <button style={activeButtonStyle}>
    //           <FontAwesomeIcon
    //             icon={faBook}
    //             style={{
    //               paddingRight: "5px",
    //             }}
    //           />
    //           Listings
    //           <FontAwesomeIcon
    //             icon={faChevronDown}
    //             style={{
    //               paddingLeft: "5px",
    //             }}
    //           />
    //         </button>
    //       ) : this.state.showRequests ? (
    //         <button style={activeButtonStyle}>
    //           <FontAwesomeIcon
    //             icon={faTasks}
    //             style={{
    //               paddingRight: "5px",
    //             }}
    //           />
    //           Requests
    //           <FontAwesomeIcon
    //             icon={faChevronDown}
    //             style={{
    //               paddingLeft: "1px",
    //             }}
    //           />
    //         </button>
    //       ) : (
    //         <button style={activeButtonStyle}>
    //           <FontAwesomeIcon
    //             icon={faCommentDots}
    //             style={{
    //               paddingRight: "5px",
    //             }}
    //           />
    //           Reviews
    //           <FontAwesomeIcon
    //             icon={faChevronDown}
    //             style={{
    //               paddingLeft: "5px",
    //             }}
    //           />
    //         </button>
    //       )}
    //     </div>
    //   );

    //   const dropDown = this.state.showDropDown ? tabs : null;

    //   navigation = (
    //     <div className={classes.DropDownContent}>
    //       {currentItemShowing}
    //       <div className={classes.filter}>{dropDown}</div>
    //     </div>
    //   );
    // }

    let profile = (
      <div className={classes.UserDetails}>
        <div>
          <img
            className={classes.ProfileImage}
            src={this.state.photoURL}
            alt="profile"
          />
        </div>
        <div>
          <p className={classes.displayName}>@{this.state.displayName}</p>
          {numStar}
          <p>
            <b>Date joined: </b>
            {this.state.dateJoined}
          </p>
          <p>
            <b>Last sign in: </b>
            {this.state.lastSignIn}
          </p>
          {this.props.isAuthenticated ? (
            <p style={{ cursor: "pointer" }} onClick={this.showReportModal}>
              {
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  style={{ paddingRight: "5px", color: "red" }}
                />
              }
              <b style={{ color: "red" }}>Report user</b>
            </p>
          ) : (
            <p style={{ cursor: "pointer" }}>
              <Link to="/auth" style={{ textDecoration: "none" }}>
                {
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    style={{ paddingRight: "5px", color: "red" }}
                  />
                }
                <b style={{ color: "red" }}>Report user</b>
              </Link>
            </p>
          )}
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
      <div className={classes.profile}>
        {this.state.reportUserPopup ? reportUser : null}
        {this.state.showSummary ? reportSummary : null}
        {this.state.reportError ? reportErrorPopUp : null}
        <div className={classes.nonPersonalBackground}>
          <FontAwesomeIcon
            icon={faWindowClose}
            onClick={this.onCancelSearchHandler}
            style={{
              color: "white",
              fontSize: "1.2rem",
              cursor: "pointer",
              float: "right",
              padding: "5px",
            }}
          />
        </div>
        <div className={classes.Profile}>
          {profile}
          <div className={classes.Information}>
            {navigation}
            <div className={classes.Details}>
              {this.state.showPastListing || this.state.showRequests ? (
                <FilterResults history={this.props.history} />
              ) : this.state.comments.length < 1 ? (
                <h3 style={{ color: "grey" }}>Oops..No reviews</h3>
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
    filterType: state.search.filterType,
    searchObject: state.search.searchObject,
    displayName: state.auth.displayName,
    isAuthenticated: state.auth.user !== null,
    windowWidth: state.window.width,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFilterTermForListing: (filterType, searchObject) =>
      dispatch(actions.setFilterListings(filterType, searchObject)),
    setFilterProfile: (displayName) =>
      dispatch(actions.setFilterProfile(displayName.toLowerCase())),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(GeneralProfilePage);
