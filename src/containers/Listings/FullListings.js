import React, { Component } from "react";
import { connect } from "react-redux";

import Listing from "./Listing/Listing";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./Listings.css";

class FullListings extends Component {
  componentDidUpdate() {
    if (this.props.isAuthenticated && this.props.chatInitialLoad) {
      this.props.dispatchFetchChats();
    }
  }

  render() {
    if (this.props.loading) {
      return <Spinner />;
    }

    if (this.props.fullListings.length < 1) {
      return <h3>Oops..No available listings</h3>;
    }

    if (this.props.error) {
      return <h3 style={{ color: "red" }}>{this.props.error}</h3>;
    }

    let listings = this.props.fullListings.map((listing) => {
      return (
        <Listing
          history={this.props.history}
          key={listing.unique}
          date={listing.date}
          identifier={listing.unique}
          userId={listing.displayName}
          status={listing.status}
          deliveryMethod={listing.postDetails.deliveryMethod}
          location={listing.postDetails.location}
          module={listing.postDetails.module}
          price={listing.postDetails.price}
          textbook={listing.postDetails.textbook}
          numImages={listing.numberOfImages}
          node={listing.key}
          likedUsers={listing.likedUsers}
        />
      );
    });

    return <div className={classes.Listings}>{listings}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.listing.error,
    fullListings: state.listing.listings,
    loading: state.listing.loading,
    chatInitialLoad: state.chat.initialLoad,
    isAuthenticated: state.auth.user !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchFetchChats: () => dispatch(actions.fetchChats()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FullListings);
