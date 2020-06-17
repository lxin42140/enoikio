import React, { Component } from "react";
import { connect } from "react-redux";

import Listing from "./Listing/Listing";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./Listings.css";

class FullListings extends Component {
  render() {
    if (this.props.loading) {
      return <Spinner />;
    }

    if (this.props.fullListings.length < 1) {
      return <h3>Oops..No available listings</h3>;
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
    fullListings: state.listing.listings,
    loading: state.listing.loading,
    isAuthenticated: state.auth.user !== null,
  };
};

export default connect(mapStateToProps)(FullListings);
