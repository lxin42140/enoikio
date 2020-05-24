import React, { Component } from 'react';
//import img1 from '../../assets/img1.jpg';
import classes from './Listing.css';
// import { connect } from 'react-redux';
// import axios from 'axios';
import { Link, Route } from 'react-router-dom';
import DetailedListing from './DetailedListing/DetailedListing';
import Modal from '../../../../components/UI/Modal/Modal';
import Button from '../../../../components/UI/Button/Button';

class Listing extends Component {

    // data = {
    //     username:
    //     module:
    //     textbook:
    //     image: 
    //     delivery method:
    //     location:
    //     rentPrice:
    //     image: 
    //     ratings:
    //     otherInformation:

    //     date posted:??
    // }

    state = {
        link: null,
        clicked: false
    }

    toggleFull = () => {
        this.setState({ clicked: !this.state.clicked });
    }


    //need to edit the css class for classes.Listing 
    render() {

        const listing = (
            <div className={classes.Listing} onClick={this.toggleFull}>
                <img src={this.props.info.image} alt="" className={classes.Image} />
                <p className={classes.Textbook}><strong>{this.props.info.textbook}</strong></p>
                <p className={classes.Description}>{this.props.info.module}</p>
                <p className={classes.Description}>{this.props.info.rentPrice}</p>
                <p className={classes.Description}>Posted by: {this.props.info.name}</p>
            </div>
        );

        const fullListing = (
            <React.Fragment>
                <div className={classes.FullListing}>
                    <img src={this.props.info.image} alt="" /></div>
                <div className={classes.FullListing}>
                    <h1><strong>{this.props.info.textbook}</strong></h1>
                    <h4>Module Code: {this.props.info.module}</h4>
                    <h4>Rent price (per month): {this.props.info.rentPrice}</h4>
                    <h4>Collection: {this.props.info.collectionMethod}</h4>
                    <br /><br />
                    <p className={classes.UserInfo}>Posted by: {this.props.info.name}</p>
                    <p className={classes.UserInfo}>User ratings: 3 stars</p>
                    <br />
                    <Button className={classes.Button}>Rent</Button>
                </div>

            </React.Fragment>
        );

        return (
            <React.Fragment>
                {listing}
                <Modal show={this.state.clicked} modalClosed={this.toggleFull}>{fullListing}</Modal>
            </React.Fragment>
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