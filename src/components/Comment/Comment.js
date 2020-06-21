import React from "react";
import moment from "moment";

import * as classes from "./Comment.css";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const comment = (props) => {
  let timeStamp = props.time;
  if (props.date !== moment().format("DD-MM-YYYY")) {
    timeStamp += " " + props.date;
  }
  return (
    <div className={classes.CommentMessage}>
      <div>
        <img
          src={props.profilePicture}
          alt="User profile"
          className={classes.ProfileImage}
        />
      </div>
      <div className={classes.CommentContent}>
        <div className={classes.CommentInfo}>
          <span className={classes.CommentName}>{props.sender}</span>
          <span className={classes.CommentTimestamp}>{timeStamp}</span>
        </div>
        <div
          style={{ textAlign: "left", paddingBottom: "5px", fontSize: "10px" }}
        >
          {props.isListingOwner ? null : (
            <div>
              {props.numStars.map((star) => (
                <FontAwesomeIcon icon={faStar} style={{ color: "#ff5138" }} />
              ))}
            </div>
          )}
        </div>
        <div className={classes.CommentText}>{props.content}</div>
      </div>
    </div>
  );
};

export default comment;
