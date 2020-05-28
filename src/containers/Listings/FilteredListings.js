import React, { Component } from "react";
import { connect } from "react-redux";

import Listing from "./Listing/Listing";
import Spinner from "../../components/UI/Spinner/Spinner";
import firebaseAxios from "../../firebaseAxios";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import classes from "./Listings.css";

class FilteredListings extends Component {
  state = {
    showFullListing: false,
    fullListingID: "",
  };

  showFullListingHandler = (event, listId) => {
    this.setState({
      showFullListing: true,
      fullListingID: listId,
    });
  };

  hideFullListingHandler = (event) => {
    this.setState({
      showFullListing: false,
      fullListingID: "",
    });
  };

  render() {
    let listings = this.props.filteredListings.map((listing) => {
      return (
        <Listing
          key={listing[8]}
          showFullListing={this.state.showFullListing}
          isAuthenticated={this.props.isAuthenticated}
          history={this.props.history}
          deliveryMethod={listing[3]}
          location={listing[4]}
          module={listing[5]}
          price={listing[6]}
          textbook={listing[7]}
          identifier={listing[8]}
          userId={listing[1]}
          onShowFullListing={(event) =>
            this.showFullListingHandler(event, listing[8])
          }
        />
      );
    });

    //TODO: when showing only one post, other summarized posts of the same module should show on the right

    if (this.state.showFullListing) {
      listings = this.props.filteredListings
        .filter((listing) => listing[8] === this.state.fullListingID)
        .map((listing) => {
          return (
            <Listing
              key={listing[8]}
              showFullListing={this.state.showFullListing}
              onHideFullListing={this.hideFullListingHandler}
              description={listing[2]}
              deliveryMethod={listing[3]}
              location={listing[4]}
              module={listing[5]}
              price={listing[6]}
              textbook={listing[7]}
              identifier={listing[8]}
              userId={listing[1]}
            />
          );
        });
    }

    if (this.props.loading) {
      listings = <Spinner />;
    }

    return <div className={classes.Listings}>{listings}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.filteredListing.loading,
    filteredListings: state.filteredListing.filteredListing,
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(
  withErrorHandler(FilteredListings, firebaseAxios)
);
