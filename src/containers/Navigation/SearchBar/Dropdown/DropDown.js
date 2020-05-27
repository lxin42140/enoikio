import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./DropDown.css";

const dropDown = (props) => {
  return (
    <span className={classes.dropDownElement}>
      <FontAwesomeIcon
        icon={props.icon}
        style={{ padding: "0 3px", fontSize: "1rem", color: "#ff9f90" }}
      />
      <a onClick={props.onClick}>{props.text}</a>
    </span>
  );
};

export default dropDown;
