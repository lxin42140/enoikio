import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Comment from "../Comment/Comment";
import FilterListings from "../../containers/Listings/FilteredListings";
import * as classes from "./GeneralProfile.css";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";

const profile = (props) => {
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
        style={props.numStars > 0 ? { color: "#ff5138" } : { color: "gray" }}
      />
      <FontAwesomeIcon
        icon={faStar}
        style={props.numStars > 1 ? { color: "#ff5138" } : { color: "gray" }}
      />
      <FontAwesomeIcon
        icon={faStar}
        style={props.numStars > 2 ? { color: "#ff5138" } : { color: "gray" }}
      />
      <FontAwesomeIcon
        icon={faStar}
        style={props.numStars > 3 ? { color: "#ff5138" } : { color: "gray" }}
      />
      <FontAwesomeIcon
        icon={faStar}
        style={props.numStars > 4 ? { color: "#ff5138" } : { color: "gray" }}
      />
      <p>
        (
        {props.numReviews <= 1
          ? props.numReviews + " review"
          : props.numReviews + " reviews"}
        )
      </p>
    </div>
  );

  let profile = (
    <ul className={classes.ProfileList}>
      <li>
        <img
          className={classes.ProfileImage}
          src={props.photoURL}
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
        @{props.displayName}
      </li>
      <li
        style={{
          marginTop: "-30px",
        }}
      >
        {numStar}
      </li>
      <li>
        <b>Date joined: </b>
        {props.dateJoined}
      </li>
      <li>
        <b>Last sign in: </b>
        {props.lastSignIn}
      </li>
    </ul>
  );

  let reviews = null;
  if (props.showComments) {
    reviews = props.comments.map((comment) => (
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
        />
      </li>
    ));
  }

  return (
    <React.Fragment>
      <div className={classes.Background}>
        <FontAwesomeIcon
          icon={faWindowClose}
          style={{
            color: "white",
            fontSize: "1.2rem",
            cursor: "pointer",
            float: "right",
            padding: "5px",
          }}
          onClick={props.onCancelSearchHandler}
        />
      </div>
      <div className={classes.Navigation}>
        <button
          onClick={props.onShowPastPostHandler}
          style={
            props.showPastListing
              ? {
                  fontWeight: "bold",
                  color: "#dd5641",
                  borderBottom: "3px solid #dd5641",
                  outline: "none",
                }
              : null
          }
        >
          Listings
        </button>
        <button
          onClick={props.onShowReviewsHandler}
          style={
            props.showComments
              ? {
                  fontWeight: "bold",
                  color: "#dd5641",
                  borderBottom: "3px solid #dd5641",
                  outline: "none",
                }
              : null
          }
        >
          Reviews
        </button>
      </div>
      <div className={classes.Profile}>
        <div className={classes.ProfileDetails}>{profile}</div>
        <div className={classes.OtherInfo}>
          {props.showPastListing ? (
            <FilterListings history={props.history} />
          ) : props.comments.length < 1 ? (
            <h3>Oops..No reviews</h3>
          ) : (
            <ul className={classes.Reviews}>{reviews}</ul>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default profile;
