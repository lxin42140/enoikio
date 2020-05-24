import React, { Component } from "react";
//import img1 from '../../assets/img1.jpg';
import classes from "./Listing.css";
import Button from "../../../../components/UI/Button/Button";
// import { connect } from 'react-redux';
// import axios from 'axios';

class Listing extends Component {
  // data = {
  //     username:
  //     module:
  //     textbook:
  //     image:
  //     location:
  //     rentPrice:
  //     postTime:
  //     image:
  //     ratings:
  // }

  //need to edit the css class for classes.Listing
  render() {
    return (
      <div className={classes.Listing}>
        <img src={this.props.info.image} alt="" className={classes.Image} />
        <p className={classes.Textbook}>
          <strong>{this.props.info.textbook}</strong>
        </p>
        <p className={classes.Description}>{this.props.info.module}</p>
        <p className={classes.Description}>{this.props.info.rentPrice}</p>
        <p className={classes.Description}>Posted by: {this.props.info.name}</p>
        <span className={classes.RentButton}>
          <Button btnType="Important">Rent now</Button>
        </span>
      </div>
    );
  }
}

//need to add name to redux store
// const mapStateToProps = state => {
//     return {
//         name: state.name,
//     }
// };

export default Listing;
