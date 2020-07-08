import React, { Component } from "react";
import { connect } from "react-redux";
import ProfileComponent from "../../../components/GeneralProfile/GeneralProfile";
import { database } from "../../../firebase/firebase";
import Spinner from "../../../components/UI/Spinner/Spinner";
import * as classes from "./Profile.css";
class GeneralProfilePage extends Component {
  state = {
    loading: true,
    error: false,

    showPastListing: true,
    showRequests: false,
    showComments: false,

    formattedDisplayName: "",

    comments: [],
    numReviews: 0,
    numStars: 0,

    photoURL: "",
    displayName: "",
    dateJoined: "",
    lastSignIn: "",
  };

  componentDidUpdate() {
    if (this.state.formattedDisplayName !== this.props.searchObject) {
      this.fetchUserProfile();
    }
  }
  componentDidMount() {
    this.fetchUserProfile();
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
              showRequest: false,
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
    this.setState({
      showPastListing: true,
      showRequests: false,
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
    this.props.history.goBack();
  };
  render() {
    if (this.state.error) {
      return (
        <React.Fragment>
          <h3>Oops...The user you are looking for doesn't seem to exist</h3>
          <div className={classes.Selections}>
            <a onClick={() => this.props.history.goBack()}>Go back</a>
          </div>
        </React.Fragment>
      );
    }

    if (this.state.loading) {
      return <Spinner />;
    }

    return (
      <ProfileComponent
        showPastListing={this.state.showPastListing}
        showRequests={this.state.showRequests}
        showComments={this.state.showComments}
        history={this.props.history}
        onShowPastPostHandler={this.onShowPastPostHandler}
        onShowReviewsHandler={this.onShowReviewsHandler}
        onCancelSearchHandler={this.onCancelSearchHandler}
        // from firebase
        numStars={this.state.numStars}
        numReviews={this.state.numReviews}
        comments={this.state.comments}
        photoURL={this.state.photoURL}
        displayName={this.state.displayName}
        email={this.state.email}
        dateJoined={this.state.dateJoined}
        lastSignIn={this.state.lastSignIn}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    searchObject: state.search.searchObject,
  };
};
export default connect(mapStateToProps)(GeneralProfilePage);
