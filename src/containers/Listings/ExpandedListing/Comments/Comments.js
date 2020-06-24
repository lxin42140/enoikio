import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as classes from "./Comments.css";
import Comment from "../../../../components/Comment/Comment";
import Button from "../../../../components/UI/Button/Button";
import { database } from "../../../../firebase/firebase";
import profileImage from "../../../../assets/Images/chats/profile";

class Comments extends Component {
  state = {
    isListingOwner: false,
    message: "",
    numStars: 0,
    comments: [],
  };

  componentDidMount() {
    if (this.state.comments.length < 1 && this.props.comments !== undefined) {
      this.setState({
        comments: this.props.comments,
        isListingOwner: this.props.displayName === this.props.userName,
      });
    }

    database
      .ref()
      .child("listings")
      .child(this.props.identifier)
      .on("value", (snapShot) => {
        if (snapShot.val()) {
          const comments = Object.assign([], snapShot.val().comments);
          comments.reverse();
          this.setState({
            comments: comments,
            isListingOwner: this.props.displayName === this.props.userName,
          });
        }
      });
  }

  inputChangeHandler = (event) => {
    this.setState({
      message: event.target.value,
    });
  };

  starChangeHandler = (num) => {
    this.setState({
      numStars: num,
    });
  };

  submitCommentHandler = (event) => {
    let message;
    let profilePicture = profileImage;

    if (this.props.photoURL !== "") {
      profilePicture = this.props.photoURL;
    }

    if (this.state.isListingOwner) {
      message = {
        content: this.state.message,
        isListingOwner: this.state.isListingOwner,
        sender: this.props.displayName,
        profilePicture: profilePicture,
        date: moment().format("DD-MM-YYYY"),
        time: moment().format("HH:mm:ss"),
        key: this.props.displayName + Date.now(),
      };
    } else {
      const numStars = [];
      for (let i = 0; i < this.state.numStars; i++) {
        numStars.push(i);
      }
      message = {
        content: this.state.message,
        isListingOwner: this.state.isListingOwner,
        numStars: numStars,
        sender: this.props.displayName,
        profilePicture: profilePicture,
        date: moment().format("DD-MM-YYYY"),
        time: moment().format("HH:mm:ss"),
        key: this.props.displayName + Date.now(),
      };
      this.updateReviews(numStars.length, this.props.userName, message);
    }

    const commentHistory = Object.assign([], this.state.comments);
    commentHistory.reverse();
    commentHistory.push(message);

    database
      .ref()
      .child("listings")
      .child(this.props.identifier)
      .update({ comments: commentHistory })
      .then((res) => {
        this.setState({
          message: "",
          numStars: 0,
        });
      });
  };

  updateReviews = (numStars, displayName, message) => {
    database
      .ref()
      .child("users")
      .once("value", (snapShot) => {
        if (snapShot.exists()) {
          snapShot.forEach((data) => {
            if (data.val().displayName === displayName) {
              const reviews = Object.assign([], data.val().reviews);
              reviews.push(numStars);
              const comments = Object.assign([], data.val().comments);
              comments.push(message);
              database.ref().child("users").child(data.key).update({
                reviews: reviews,
                comments: comments,
              });
            }
          });
        } else {
          database
            .ref()
            .child("users")
            .push({
              displayName: displayName,
              reviews: [numStars],
              comments: [message],
            });
        }
      });
  };

  render() {
    let commentInput = (
      <div>
        {this.state.isListingOwner ? (
          <p style={{ margin: "10px 0 5px 10px", textAlign: "center" }}>
            Write your comment
          </p>
        ) : (
          <React.Fragment>
            <p style={{ margin: "10px 0 5px 10px", textAlign: "center" }}>
              Write your review
            </p>
            <div style={{ textAlign: "left", paddingLeft: "10px" }}>
              <FontAwesomeIcon
                icon={faStar}
                style={
                  this.state.numStars > 0
                    ? { color: "#ff5138" }
                    : { color: "gray" }
                }
                onClick={() => this.starChangeHandler(1)}
              />
              <FontAwesomeIcon
                icon={faStar}
                style={
                  this.state.numStars > 1
                    ? { color: "#ff5138" }
                    : { color: "gray" }
                }
                onClick={() => this.starChangeHandler(2)}
              />
              <FontAwesomeIcon
                icon={faStar}
                style={
                  this.state.numStars > 2
                    ? { color: "#ff5138" }
                    : { color: "gray" }
                }
                onClick={() => this.starChangeHandler(3)}
              />
              <FontAwesomeIcon
                icon={faStar}
                style={
                  this.state.numStars > 3
                    ? { color: "#ff5138" }
                    : { color: "gray" }
                }
                onClick={() => this.starChangeHandler(4)}
              />
              <FontAwesomeIcon
                icon={faStar}
                style={
                  this.state.numStars > 4
                    ? { color: "#ff5138" }
                    : { color: "gray" }
                }
                onClick={() => this.starChangeHandler(5)}
              />
            </div>
          </React.Fragment>
        )}

        <div className={classes.NewComment}>
          <textarea
            className={classes.textarea}
            type="text"
            value={this.state.message}
            placeholder="Type here..."
            onChange={this.inputChangeHandler}
          />
          <span style={{ paddingLeft: "15px" }}>
            <Button
              btnType="Important"
              onClick={this.submitCommentHandler}
              disabled={
                (this.state.isListingOwner && this.state.message === "") ||
                (!this.state.isListingOwner &&
                  (this.state.numStars === 0 || this.state.message === ""))
              }
            >
              Post
            </Button>
          </span>
        </div>
      </div>
    );

    let reviews = this.state.comments.map((comment) => (
      <li key={comment.key}>
        <Comment
          isListingOwner={comment.isListingOwner}
          sender={comment.sender}
          date={comment.date}
          time={comment.time}
          numStars={comment.numStars}
          content={comment.content}
          profilePicture={comment.profilePicture}
        />
      </li>
    ));

    return (
      <div className={classes.Comments}>
        {this.props.isAuthenticated ? (
          commentInput
        ) : (
          <Link to="/auth" className={classes.AuthPrompt}>
            <a>Sign in or sign up to leave a review</a>
          </Link>
        )}
        <p
          style={{
            margin: "0",
            paddingTop: "5px",
            fontSize: "20px",
            lineHeight: "28px",
            textAlign: "left",
            paddingLeft: "10px",
            borderTop: "1px solid #f0f1f1",
          }}
        >
          {this.state.comments.length < 1 ? "No Reviews" : "Reviews"}
        </p>
        <ul className={classes.CommentMessages}>{reviews}</ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.user !== null,
    displayName: state.auth.displayName,
    photoURL: state.auth.photoURL,
  };
};

export default connect(mapStateToProps)(Comments);
