import React from "react";
import moment from "moment";

import classes from "./ChatMessage.css";
import profileImage from "../../../assets/Images/chats/profile";

const ChatMessage = (props) => {
  let chatInfo;
  let chatText;
  let profilePic;
  let chatInfoSpans;
  let iconStyle;

  if (props.displayName === props.currentUser) {
    chatInfo = classes.ChatInfoSender;
    chatText = classes.ChatTextSender;
    profilePic = props.photoURL === "" ? profileImage : props.photoURL;
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
      float: "right",
      width: "40px",
      height: "40px",
      paddingLeft: "10px",
    };
  } else {
    chatInfo = classes.ChatInfo;
    chatText = classes.ChatText;
    profilePic = props.recipientProfilePic;
    chatInfoSpans = (
      <React.Fragment>
        <span className={classes.ChatName}>{props.displayName}</span>
        <span className={classes.ChatTimestamp}>
          {props.date === moment().format("DD/MM/YYYY")
            ? props.time
            : props.date + " " + props.time}
        </span>
      </React.Fragment>
    );
    iconStyle = {
      float: "left",
      width: "40px",
      height: "40px",
      paddingRight: "10px",
    };
  }

  return (
    <div className={classes.ChatMessage}>
      <div className={[chatInfo, "clearfix"].join(" ")}>{chatInfoSpans}</div>
      <img src={profilePic} alt="profile" style={iconStyle} />
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
