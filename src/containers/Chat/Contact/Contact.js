import React from "react";
import classes from "./Contact.css";
import logo from "../../../assets/Logo/logo.png";

const contact = (props) => {
  return (
    <div className={classes.friend}>
      <img src={logo} alt="" />
      <p>
        <strong
          style={{
            fontWeight: "600",
            fontSize: "15px",
            color: "#597a96",
            float: "left",
          }}
        >
          Miro Badev
        </strong>
        <br />
        <span
          style={{
            fontWeight: "400",
            fontSize: "13px",
            color: "#aab8c2",
            float: "left",
          }}
        >
          This is a test messsage sent from micro
        </span>
      </p>
      <div className={classes.status}></div>
    </div>
  );
};

export default contact;
