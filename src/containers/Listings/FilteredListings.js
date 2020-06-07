import React, { Component } from "react";
import { connect } from "react-redux";

import Listing from "./Listing/Listing";
import classes from "./Listings.css";

class FilteredListings extends Component {
  state = {
    filteredListings: [],
  };

  componentDidMount() {
    switch (this.props.filterTerm) {
      case "favorites":
      case "displayName":
      case "textbook":
      case "moduleCode":
      case "location":
      default:
        break;
    }
  }

  render() {
    let listings = this.state.filteredListings.map((listing) => {
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

    //TODO: when showing only one post, other summarized posts of the same module should show on the right

    return <div className={classes.Listings}>{listings}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    filterTerm: state.listing.filterTerm,
    listings: state.listing.listings,
    searchObject: state.listing.searchObject,
  };
};

export default connect(mapStateToProps)(FilteredListings);
