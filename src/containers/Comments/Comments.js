import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";

import * as classes from "./Comments.css";
import Comment from "../../components/Comment/Comment";
import Button from "../../components/UI/Button/Button";
import { database } from "../../firebase/firebase";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Comments extends Component {
  state = {
    message: "",
    numStars: 0,
    comments: [],
  };

  componentDidMount() {
    if (this.state.comments.length < 1 && this.props.comments !== undefined) {
      this.setState({
        comments: this.props.comments,
      });
    }

    database
      .ref()
      .child("listings")
      .child(this.props.identifier)
      .on("value", (snapShot) => {
        const comments = Object.assign([], snapShot.val().comments);
        comments.reverse();
        this.setState({
          comments: comments,
        });
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
    const numStars = [];
    for (let i = 0; i < this.state.numStars; i++) {
      numStars.push(i);
    }
    const message = {
      content: this.state.message,
      numStars: numStars,
      sender: this.props.displayName,
      date: moment().format("DD-MM-YYYY"),
      time: moment().format("HH:mm:ss"),
      key:
        this.props.displayName +
        moment().format("HH:mm:ss") +
        moment().format("DD-MM-YYYY"),
    };

    const commentHistory = Object.assign([], this.state.comments);
    commentHistory.push(message);

    database
      .ref()
      .child("listings")
      .child(this.props.identifier)
      .update({ comments: commentHistory });

    this.setState({
      message: "",
      numStars: 0,
    });
  };

  render() {
    let commentInput = (
      <div>
        <p style={{ margin: "10px 0 5px 10px", textAlign: "center" }}>
          Write your review
        </p>
        <div style={{ textAlign: "left", paddingLeft: "10px" }}>
          <FontAwesomeIcon
            icon={faStar}
            style={
              this.state.numStars > 0 ? { color: "#ff5138" } : { color: "gray" }
            }
            onClick={() => this.starChangeHandler(1)}
          />
          <FontAwesomeIcon
            icon={faStar}
            style={
              this.state.numStars > 1 ? { color: "#ff5138" } : { color: "gray" }
            }
            onClick={() => this.starChangeHandler(2)}
          />
          <FontAwesomeIcon
            icon={faStar}
            style={
              this.state.numStars > 2 ? { color: "#ff5138" } : { color: "gray" }
            }
            onClick={() => this.starChangeHandler(3)}
          />
          <FontAwesomeIcon
            icon={faStar}
            style={
              this.state.numStars > 3 ? { color: "#ff5138" } : { color: "gray" }
            }
            onClick={() => this.starChangeHandler(4)}
          />
          <FontAwesomeIcon
            icon={faStar}
            style={
              this.state.numStars > 4 ? { color: "#ff5138" } : { color: "gray" }
            }
            onClick={() => this.starChangeHandler(5)}
          />
        </div>
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
              disabled={this.state.message === "" || this.state.numStars === 0}
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
          sender={comment.sender}
          date={comment.date}
          time={comment.time}
          numStars={comment.numStars}
          content={comment.content}
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
        <ul className={classes.CommentMessages}>
          {reviews}
          {/* <a href="/" className={classes.LoadReviews}>
            Read more reviews
          </a> */}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    displayName: state.auth.displayName,
  };
};

export default connect(mapStateToProps)(Comments);
