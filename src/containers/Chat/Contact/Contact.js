import React from "react";
import classes from "./Contact.css";
import logo from "../../../assets/Logo/logo.png";

const contact = (props) => {
  return (
    <div className={classes.friend} onClick={props.onClick}>
      <img src={logo} alt="" />
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
      {/* <div className={classes.status}></div> */}
    </div>
  );
};

export default contact;
