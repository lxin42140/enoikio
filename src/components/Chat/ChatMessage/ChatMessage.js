import React from "react";
import moment from "moment";

import classes from "./ChatMessage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";

const ChatMessage = (props) => {
  let chatInfo = classes.ChatInfo;
  let chatText = classes.ChatText;
  let chatInfoSpans = (
    <React.Fragment>
      <span className={classes.ChatName}>{props.displayName}</span>
      <span className={classes.ChatTimestamp}>
        {props.date === moment().format("DD/MM/YYYY")
          ? props.time
          : props.date + " " + props.time}
      </span>
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
        <span className={classes.ChatTimestamp}>
          {props.date === moment().format("DD/MM/YYYY")
            ? props.time
            : props.date + " " + props.time}
        </span>
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
      <div className={chatText}>
        {props.type !== "NORMAL" ? (
          <p style={{ color: "black" }}>
            <b>{props.message}</b>
          </p>
        ) : (
          props.message
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
