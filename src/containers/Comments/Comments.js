import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

import * as classes from "./Comments.css";
import Comment from "../../components/Comment/Comment";
import Button from "../../components/UI/Button/Button";
import { database } from "../../firebase/firebase";
import { faStar, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Comments extends Component {
  state = {
    message: "",
    numStars: 0,
  };

  componentDidMount() {}

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

  closeReviewHandler = (event) => {
    this.props.history.goBack();
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
    };

    const commentHistory = Object.assign([], this.props.comments);
    commentHistory.push(message);

    database
      .ref()
      .child("listings/" + this.props.identifier)
      .update({ comments: commentHistory });

    this.setState({
      message: "",
    });
  };

  render() {
    let commentInput = (
      <div>
        <p style={{ margin: "5px 0 5px 10px", textAlign: "center" }}>
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
    return (
      <div className={classes.Comments}>
        <FontAwesomeIcon
          icon={faWindowClose}
          style={{
            alignSelf: "flex-end",
            padding: "10px",
            color: "#ff5138",
          }}
          onClick={this.closeReviewHandler}
        />
        <p
          style={{
            fontSize: "20px",
            lineHeight: "28px",
            textAlign: "left",
            paddingLeft: "10px",
          }}
        >
          Reviews for UserA
        </p>
        <ul className={classes.CommentMessages}>
          <li>
            <Comment />
          </li>
          <li>
            <Comment />
          </li>
          <a href="/" className={classes.LoadReviews}>
            Read more reviews
          </a>
        </ul>
        {this.props.isAuthenticated ? (
          commentInput
        ) : (
          <a href="/auth" className={classes.AuthPrompt}>
            Sign in or sign up to leave a review
          </a>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(Comments);
