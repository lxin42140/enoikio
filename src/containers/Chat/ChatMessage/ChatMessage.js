import React from "react";

import classes from "./ChatMessage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";

const ChatMessage = (props) => {
  let chatInfo = classes.ChatInfo;
  let chatText = classes.ChatText;
  let chatInfoSpans = (
    <React.Fragment>
      <span className={classes.ChatName}>{props.displayName}</span>
      <span className={classes.ChatTimestamp}>{props.timeStamp}</span>
    </React.Fragment>
  );
  let iconStyle = {
    borderRadius: "50%",
    float: "left",
    width: "40px",
    height: "40px",
    paddingRight: "10px",
  };

  if (props.displayName === props.currentUser) {
    chatInfo = classes.ChatInfoSender;
    chatText = classes.ChatTextSender;
    chatInfoSpans = (
      <React.Fragment>
        <span className={classes.ChatTimestamp}>{props.timeStamp}</span>
        <span className={classes.ChatNameSender}>{props.displayName}</span>
      </React.Fragment>
    );
    iconStyle = {
      borderRadius: "50%",
      float: "right",
      width: "40px",
      height: "40px",
      paddingLeft: "10px",
    };
  }

  return (
    <div className={classes.ChatMessage}>
      <div className={[chatInfo, "clearfix"].join(" ")}>{chatInfoSpans}</div>
      <FontAwesomeIcon icon={faUserGraduate} style={iconStyle} />
      <div className={chatText}>{props.message}</div>
    </div>
  );
};

export default ChatMessage;
