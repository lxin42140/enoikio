import React, { Component } from 'react';
import classes from './ExpandedListing.css';
import { storage } from "../../../firebase/firebase";
import Button from '../../../components/UI/Button/Button';

import { connect } from 'react-redux';

class ExpandedListing extends Component {

    state = {
        image: "",
        error: false,
    };

    // let listing = (
    //     <React.Fragment>
    //         <div className={classes.Image}>
    //             <img
    //                 src={Image}
    //                 alt=""
    //             // className={classes.Image}
    //             />
    //         </div>
    //         <div>
    //             <div className={classes.Textbook}>
    //                 <p>CS2030:《CS2030 is Bad》</p>
    //             </div>
    //             <div>
    //                 <ul className={classes.Description}>
    //                     <li>Price: $20.30 / month</li>
    //                     <li>Delivery method: meet up</li>
    //                     <li>Location: NUS i3</li>
    //                     <li>
    //                         <br />
    //                     Description: <br /> CS2030 is a very bad module
    //                     This module is a follow up to CS1010. It explores two modern programming paradigms,
    //                     object-oriented programming and functional programming. Through a series of
    //                     integrated assignments, students will learn to develop medium-scale
    //                     software programs in the order of thousands of lines of code and tens of
    //                     classes using objectoriented design principles and advanced programming constructs
    //                     available in the two paradigms. Topics include objects and classes, composition,
    //                     association, inheritance, interface, polymorphism, abstract classes, dynamic binding,
    //                     lambda expression, effect-free programming, first class functions, closures,
    //                     continuations, monad, etc.
    //                 </li>
    //                     <br />
    //                     <li>Posted by: userABC</li>
    //                 </ul>
    //             </div>
    //             <div className={classes.Button}>
    //                 <Button>Chat</Button>
    //                 <Button>Rent Now</Button>
    //             </div>
    //         </div>
    //     </React.Fragment>
    // );

    componentDidMount() {
        if (this.state.image === "") {
            storage
                .ref("listingPictures/")
                .child(this.props.userid)
                .getDownloadURL()
                .then((url) => {
                    this.setState({
                        image: url,
                    });
                })
                .catch((error) => {
                    this.setState({ error: true });
                });
        }
    }

    render() {
        const userid = this.props.userid;
        let expandedListing = [...this.props.listings];

        expandedListing = expandedListing.filter(
            listing => listing[8] === userid
        )[0];

        let listing = (
            <React.Fragment>
                <div className={classes.Image}>
                    <img
                        src={this.state.image}
                        alt={this.state.error ? "Unable to load image" : "Loading image..."}
                    />
                </div>
                <div className={classes.Text}>
                    <div>
                        <h1>{expandedListing[5]}:《{expandedListing[7]}》</h1>
                    </div>

                    <div>
                        <ul className={classes.Description}>
                            <li>Price: ${expandedListing[6]} / month</li>
                            <li>Delivery method: {expandedListing[2]}</li>
                            <li>Location: {expandedListing[4]}</li>
                            <li>
                                <br />
                                Description: <br /> {expandedListing[3]}
                            </li>
                            <br />
                            <li>Posted by: {expandedListing[1]}</li>
                        </ul>
                    </div>
                    <div className={classes.Button}>
                        <Button>Chat</Button>
                        <Button>Rent Now</Button>
                    </div>
                </div>
            </React.Fragment>
        );

        return (
            <div className={classes.ExpandedListing}>
                {listing}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userid: state.listing.expanded,
        listings: state.listing.listings
    }
}

export default connect(mapStateToProps)(ExpandedListing);