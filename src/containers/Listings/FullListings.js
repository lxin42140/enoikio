import React, { Component } from "react";
import { connect } from "react-redux";

import Listing from "./Listing/Listing";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";
import firebaseAxios from "../../firebaseAxios";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import classes from "./Listings.css";

//TODO: handle no listing

//UPDATE: INCLUDED NUMBER OF IMAGES
/*
0: date
1: display name
2: number of images
3: "delivery method"
4: "description"
5: "location"
6: "module code"
7: "price"
8: "title"
9: "time"
10: "unique key"
11: "geyc7gjEeESmBZDnAX4yR4GKgxQ2"
*/

class FullListings extends Component {

  componentDidMount() {
    this.props.dispatchFetchAllListings();
    if (this.props.chatInitialLoad) {
      this.props.dispatchFetchChats();
    }
  }

  render() {
    let listings = this.props.fullListings.map((listing) => {
      return (
        <Listing
          key={listing[10]}
          isAuthenticated={this.props.isAuthenticated}
          history={this.props.history}
          date={listing[0]}
          userId={listing[1]}
          numImages={listing[2]}
          deliveryMethod={listing[3]}
          description={listing[4]}
          location={listing[5]}
          module={listing[6]}
          price={listing[7]}
          textbook={listing[8]}
          time={listing[9]}
          identifier={listing[10]}
          code={listing[11]}
        />
      );
    });

    if (this.props.loading) {
      listings = <Spinner />;
    }

    return <div className={classes.Listings}>{listings}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    fullListings: state.listing.listings,
    loading: state.listing.loading,
    isAuthenticated: state.auth.token !== null,
    chatInitialLoad: state.chat.initialLoad,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchFetchAllListings: () => dispatch(actions.fetchAllListings()),
    dispatchFetchChats: () => dispatch(actions.fetchChats()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(FullListings, firebaseAxios));
