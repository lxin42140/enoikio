import React from "react";
import classes from "./Contact.css";

const contact = (props) => {
  let style = null;
  if (props.recipient && props.recipient === props.userName) {
    style = { background: "#f1f4f6", borderLeft: "3px solid #fd8673" };
  }
  return (
    <div className={classes.friend} onClick={props.onClick} style={style}>
      <img src={props.profilePic} alt="profile" />
      <p>
        <strong
          style={{
            fontWeight: "600",
            fontSize: "15px",
            color: "#597a96",
          }}
        >
          {props.userName}
        </strong>
        <br />
        <span
          style={{
            fontWeight: "400",
            fontSize: "13px",
            color: "#aab8c2",
          }}
        >
          {props.lastMessage}
        </span>
      </p>
    </div>
  );
};

export default contact;
