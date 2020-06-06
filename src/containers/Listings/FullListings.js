import React, { Component } from "react";
import { connect } from "react-redux";

import Listing from "./Listing/Listing";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";
import firebaseAxios from "../../firebaseAxios";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import classes from "./Listings.css";

class FullListings extends Component {
  componentDidMount() {
    if (this.props.chatInitialLoad) {
      this.props.dispatchFetchChats();
    }
  }

  render() {
    let listings = this.props.fullListings.map((listing) => {
      return (
        <Listing
          history={this.props.history}
          key={listing.unique}
          identifier={listing.unique}
          userId={listing.displayName}
          status={listing.status}
          deliveryMethod={listing.postDetails.deliveryMethod}
          location={listing.postDetails.location}
          module={listing.postDetails.module}
          price={listing.postDetails.price}
          textbook={listing.postDetails.textbook}
          numImages={listing.numberOfImages}
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
    chatInitialLoad: state.chat.initialLoad,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchFetchChats: () => dispatch(actions.fetchChats()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(FullListings, firebaseAxios));
