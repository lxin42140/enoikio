import React from "react";
import classes from "./Listing.css";
import Button from "../../../components/UI/Button/Button";

const listing = (props) => {
  let listing = (
    <React.Fragment>
      <img src={props.image} alt="" className={classes.Image} />
      <p className={classes.Textbook}>
        <strong>{props.textbook}</strong>
      </p>
      <p className={classes.Description}>{props.module}</p>
      <p className={classes.Description}>{props.price}</p>
      {props.showFullListing ? (
        <React.Fragment>
          <p className={classes.Description}>{props.deliveryMethod}</p>
          <p className={classes.Description}>{props.location}</p>
          <p className={classes.Description}>{props.description}</p>
        </React.Fragment>
      ) : null}
      <p className={classes.Description}>Posted by: {props.userId}</p>
    </React.Fragment>
  );

  return (
    <div className={classes.Listing}>
      {listing}
      <span className={classes.RentButton}>
        <Button btnType="Important">Rent now</Button>
      </span>
    </div>
  );
};

export default listing;
