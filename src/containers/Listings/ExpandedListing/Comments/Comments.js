import {
  faStar,
  faTimes,
  faShare,
  faPen,
  faClipboardCheck,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import profileImage from "../../../../assets/Images/chats/profile";
import Comment from "../../../../components/Comment/Comment";
import Button from "../../../../components/UI/Button/Button";
import { database } from "../../../../firebase/firebase";
import * as classes from "./Comments.css";
import Modal from "../../../../components/UI/Modal/Modal";
class Comments extends Component {
  state = {
    isListingOwner: false,
    message: "",
    numStars: 0,
    comments: [],

    replies: [],
    toggleReply: false,
    replyMessage: "",
    replyKey: "",
  };
  componentDidMount() {
    if (
      this.state.comments.length < 1 &&
      this.props.comments !== undefined &&
      this.state.comments.replies < 1 &&
      this.props.replies !== undefined
    ) {
      this.setState({
        comments: this.props.comments,
        replies: this.props.replies,
        isListingOwner: this.props.displayName === this.props.userName,
      });
    } else if (
      this.state.comments.length < 1 &&
      this.props.comments !== undefined
    ) {
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

          const replies = Object.assign([], snapShot.val().replies);
          replies.reverse();

          this.setState({
            comments: comments,
            replies: replies,
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
      .orderByChild("displayName")
      .equalTo(displayName)
      .once("value", (snapShot) => {
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
      });
  };

  togglePopUp = (replyKey) => {
    // close pop up
    if (this.state.toggleReply) {
      this.setState({
        toggleReply: false,
        replyMessage: "",
        replyKey: "",
      });
    } else {
      // show pop up
      this.setState({
        toggleReply: true,
        replyKey: replyKey,
      });
    }
  };

  replyOnChange = (event) => {
    this.setState({
      replyMessage: event.target.value,
    });
  };

  submitReplyHandler = () => {
    let message;
    let profilePicture = profileImage;

    if (this.props.photoURL !== "") {
      profilePicture = this.props.photoURL;
    }

    message = {
      content: this.state.replyMessage,
      sender: this.props.displayName,
      profilePicture: profilePicture,
      isListingOwner: this.state.isListingOwner,
      date: moment().format("DD-MM-YYYY"),
      time: moment().format("HH:mm:ss"),
      key: this.state.replyKey,
    };

    const replyHistory = Object.assign([], this.state.replies);
    replyHistory.reverse();
    replyHistory.push(message);

    database
      .ref()
      .child("listings")
      .child(this.props.identifier)
      .update({ replies: replyHistory })
      .then((res) => {
        this.setState({
          toggleReply: false,
          replyMessage: "",
          replyKey: "",
        });
      });
  };

  render() {
    let commentInput = (
      <div>
        {this.state.isListingOwner ? (
          <p className={classes.commentHeader}>
            {<FontAwesomeIcon icon={faPen} style={{ paddingRight: "5px" }} />}
            Write your comment
          </p>
        ) : (
          <React.Fragment>
            <p className={classes.commentHeader}>
              {
                <FontAwesomeIcon
                  icon={faClipboardCheck}
                  style={{ paddingRight: "5px" }}
                />
              }
              Write your review
            </p>
            <div className={classes.reviewStars}>
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
          <span className={classes.postButton}>
            <Button
              onClick={this.submitCommentHandler}
              disabled={
                (this.state.isListingOwner && this.state.message === "") ||
                (!this.state.isListingOwner &&
                  (this.state.numStars === 0 || this.state.message === ""))
              }
            >
              {
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{ paddingRight: "5px" }}
                />
              }
              Post
            </Button>
          </span>
        </div>
      </div>
    );

    let reviews = this.state.comments.map((comment) => {
      let threads = [];
      for (let index in this.state.replies) {
        if (this.state.replies[index].key === comment.key) {
          threads.push(this.state.replies[index]);
        }
      }
      threads = threads.map((reply) => (
        <Comment
          isReply
          isListingOwner={reply.isListingOwner}
          sender={reply.sender}
          date={reply.date}
          time={reply.time}
          numStars={reply.numStars}
          content={reply.content}
          profilePicture={reply.profilePicture}
          onClick={() => this.props.searchProfileHandler(reply.sender)}
        />
      ));

      return (
        <li key={comment.key}>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Comment
                isListingOwner={comment.isListingOwner}
                sender={comment.sender}
                date={comment.date}
                time={comment.time}
                numStars={comment.numStars}
                content={comment.content}
                profilePicture={comment.profilePicture}
                onClick={() => this.props.searchProfileHandler(comment.sender)}
              />
              <div style={{ paddingRight: "15px" }}>
                {this.props.isAuthenticated ? (
                  <span>
                    <Button onClick={() => this.togglePopUp(comment.key)}>
                      {
                        <FontAwesomeIcon
                          icon={faShare}
                          style={{ paddingRight: "5px" }}
                        />
                      }
                      {this.props.windowWidth <= 685 ? null : "Reply"}
                    </Button>
                  </span>
                ) : (
                  // <Link to="/auth">
                  <Button onClick={() => this.props.history.push("/auth")}>
                    {
                      <FontAwesomeIcon
                        icon={faShare}
                        style={{ paddingRight: "5px" }}
                      />
                    }
                    {this.props.windowWidth <= 685 ? null : "Sign in"}
                  </Button>
                  // </Link>
                )}
              </div>
            </div>
            {threads}
          </div>
        </li>
      );
    });

    let replyPopup = (
      <Modal show={this.state.toggleReply}>
        <div className={classes.NewComment}>
          <textarea
            className={classes.textarea}
            type="text"
            value={this.state.replyMessage}
            placeholder="Type reply here..."
            onChange={this.replyOnChange}
          />
          <div className={classes.replyComment}>
            <Button
              btnType="Important"
              disabled={this.state.replyMessage === ""}
              onClick={this.submitReplyHandler}
            >
              {
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{ paddingRight: "5px" }}
                />
              }
              Post
            </Button>
            <span style={{ paddingRight: "3px" }} />
            <Button onClick={() => this.togglePopUp("")}>
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
      </Modal>
    );

    return (
      <div className={classes.Comments}>
        {this.state.toggleReply ? replyPopup : null}
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
    windowWidth: state.window.width,
  };
};
export default connect(mapStateToProps)(Comments);
