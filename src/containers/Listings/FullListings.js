import React, { Component } from "react";
import { connect } from "react-redux";

import Listing from "./Listing/Listing";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";
import firebaseAxios from "../../firebaseAxios";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import classes from "./Listings.css";

//TODO: handle no listing

/*
0: date and time
1: display name
2: "delivery method"
3: "description"
4: "location"
5: "module code"
6: "price"
7: "title"
8: "unique key"
9: "geyc7gjEeESmBZDnAX4yR4GKgxQ2"
*/

class FullListings extends Component {
  // state = {
  //   showFullListing: false,
  //   fullListingID: "",
  // };

  componentDidMount() {
    this.props.dispatchFetchAllListings();
  }

  // showFullListingHandler = (event, listId) => {
  //   this.setState({
  //     showFullListing: true,
  //     fullListingID: listId,
  //   });
  // };

  // hideFullListingHandler = (event) => {
  //   this.setState({
  //     showFullListing: false,
  //     fullListingID: "",
  //   });
  // };

  render() {
    let listings = this.props.fullListings.map((listing) => {
      return (
        <Listing
          key={listing[8]}
          // showFullListing={this.state.showFullListing}
          isAuthenticated={this.props.isAuthenticated}
          history={this.props.history}
          deliveryMethod={listing[2]}
          location={listing[4]}
          module={listing[5]}
          price={listing[6]}
          textbook={listing[7]}
          identifier={listing[8]}
          userId={listing[1]}
          // onShowFullListing={(event) =>
          //   this.showFullListingHandler(event, listing[8])
          // }
        />
      );
    });

    //TODO: when showing only one post, other summarized posts of the same module should show on the right

    // if (this.state.showFullListing) {
    //   listings = this.props.fullListings
    //     .filter((listing) => listing[8] === this.state.fullListingID)
    //     .map((listing) => {
    //       return (
    //         <Listing
    //           key={listing[8]}
    //           showFullListing={this.state.showFullListing}
    //           onHideFullListing={this.hideFullListingHandler}
    //           description={listing[3]}
    //           deliveryMethod={listing[2]}
    //           location={listing[4]}
    //           module={listing[5]}
    //           price={listing[6]}
    //           textbook={listing[7]}
    //           identifier={listing[8]}
    //           userId={listing[1]}
    //         />
    //       );
    //     });
    // }

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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchFetchAllListings: () => dispatch(actions.fetchAllListings()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(FullListings, firebaseAxios));
