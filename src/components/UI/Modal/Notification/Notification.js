import React from "react";
import Modal from "../Modal";
import Button from "../../Button/Button";
import { Link } from "react-router-dom";
import classes from "./Notification.css";

const notification = (props) => {
  let buttonType;
  let contentStyle = null;

  switch (props.type) {
    case "ListingSummary":
      buttonType = (
        <React.Fragment>
          <Button onClick={props.button1OnClick}>Go back</Button>
          <Button onClick={props.button2OnClick}>Submit</Button>
        </React.Fragment>
      );
      break;
    case "ListingSuccess":
      buttonType = (
        <React.Fragment>
          <Link to="/">
            <Button onClick={props.button1OnClick}>Home page</Button>
          </Link>
          <Button onClick={props.button2OnClick}>Submit new listing</Button>
        </React.Fragment>
      );
      contentStyle = classes.ListingSuccess;
      break;
    case "ListingFail":
      buttonType = (
        <Button btnType="Important" onClick={props.props.button1OnClick}>
          Go Back
        </Button>
      );
      break;
    default:
      buttonType = null;
  }

  return (
    <Modal show={props.showModal}>
      <div className={contentStyle}>{props.children}</div>
      <div className={classes.Button}>{buttonType}</div>
    </Modal>
  );
};

export default notification;
