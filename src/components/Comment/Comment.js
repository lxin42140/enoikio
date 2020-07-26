import React from "react";
import moment from "moment";

import * as classes from "./Comment.css";
import { faStar, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const comment = (props) => {
  let timeStamp = props.time;
  if (props.date !== moment().format("DD-MM-YYYY")) {
    timeStamp = timeStamp + " (" + props.date + ")";
  }

  let comment;

  if (props.isReply) {
    comment = (
      <div className={classes.ReplyMessage}>
        {
          <FontAwesomeIcon
            icon={faShare}
            style={{ paddingRight: "5px", color: "grey" }}
          />
        }
        <div className={classes.tooltip}>
          <div style={{ cursor: "pointer" }}>
            <img
              src={props.profilePicture}
              alt="User profile"
              className={classes.ReplyProfileImage}
              onClick={props.onClick}
            />
          </div>
          <span className={classes.tooltiptext}>Click to go profile</span>
        </div>

        <div className={classes.CommentContent}>
          <div className={classes.CommentInfo}>
            <span className={classes.CommentName}>
              {props.sender + (props.isListingOwner ? " (owner)" : "")}
            </span>
            <span className={classes.CommentTimestamp}>{timeStamp}</span>
          </div>
          <div
            style={{
              textAlign: "left",
              paddingBottom: "5px",
              fontSize: "10px",
            }}
          ></div>
          <div className={classes.CommentText}>{props.content}</div>
        </div>
      </div>
    );
  } else {
    comment = (
      <div className={classes.CommentMessage}>
        <div className={classes.tooltip}>
          <div style={{ cursor: "pointer" }}>
            <img
              src={props.profilePicture}
              alt="User profile"
              className={classes.ProfileImage}
              onClick={props.onClick}
            />
          </div>
          <span className={classes.tooltiptext}>Click to go profile</span>
        </div>
        <div className={classes.CommentContent}>
          <div className={classes.CommentInfo}>
            <span className={classes.CommentName}>
              {props.sender + (props.isListingOwner ? " (owner)" : "")}
            </span>
            <span className={classes.CommentTimestamp}>{timeStamp}</span>
          </div>
          <div
            style={{
              textAlign: "left",
              paddingBottom: "5px",
              fontSize: "10px",
            }}
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
  }

  return comment;
};

export default comment;
