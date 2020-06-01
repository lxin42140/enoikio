import React from "react";

import classes from "./ChatMessage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";

const ChatMessage = (props) => {
  return (
    <div className={classes.ChatMessage}>
      <div className={[classes.ChatInfo, "clearfix"].join(" ")}>
        <span className={classes.ChatName}>{props.displayName}</span>
        <span className={classes.ChatTimestamp}>{props.timeStamp}</span>
      </div>
      <FontAwesomeIcon
        icon={faUserGraduate}
        style={{
          borderRadius: "50%",
          float: "left",
          width: "40px",
          height: "40px",
        }}
      />
      <div className={classes.ChatText}>{props.message}</div>
    </div>
  );
};

export default ChatMessage;
