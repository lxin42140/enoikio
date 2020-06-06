import React from "react";

import * as classes from "./Comment.css";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const comment = (props) => {
  return (
    <div className={classes.CommentMessage}>
      <div>
        <img
          src="https://media.karousell.com/media/photos/profiles/2020/03/07/heiiieiieiie_1583567636.jpg"
          alt="User profile"
          width="35"
          className={classes.ProfileImage}
        />
      </div>
      <div className={classes.CommentContent}>
        <div className={classes.CommentInfo}>
          <span className={classes.CommentName}>User A</span>
          <span className={classes.CommentTimestamp}>14:40</span>
        </div>
        <div
          style={{ textAlign: "left", paddingBottom: "5px", fontSize: "10px" }}
        >
          <FontAwesomeIcon icon={faStar} style={{ color: "#ff5138" }} />
        </div>

        <div className={classes.CommentText}>Test comment</div>
      </div>
    </div>
  );
};

export default comment;
