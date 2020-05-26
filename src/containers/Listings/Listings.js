import React, { Component } from "react";
import { connect } from "react-redux";

import Listing from "./Listing/Listing";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";
import firebaseAxios from "../../firebaseAxios";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import classes from "./Listings.css";

class Listings extends Component {
  state = {
    showFullListing: false,
    fullListingID: "",
    reload: false,
  };

  componentDidMount() {
    this.props.onFetchListingInit();
  }

/*
0: date and time
1: description
2: delivery method
3: location
4: module code
5: price
6: book title
7: unique key
8: userID
*/

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
    let listings = this.props.listingData.map((listing) => {
      return (
        <Listing
          key={listing[7]}
          showFullListing={this.state.showFullListing}
          isAuthenticated={this.props.isAuthenticated}
          history={this.props.history}
          deliveryMethod={listing[2]}
          location={listing[3]}
          module={listing[4]}
          price={listing[5]}
          textbook={listing[6]}
          identifier={listing[7]}
          userId={listing[8]}
          onShowFullListing={(event) =>
            this.showFullListingHandler(event, listing[7])
          }
        />
      );
    });

    //TODO: when showing only one post, other summarized posts of the same module should show on the right

    if (this.state.showFullListing) {
      listings = this.props.listingData
        .filter((listing) => listing[7] === this.state.fullListingID)
        .map((listing) => {
          return (
            <Listing
              key={listing[7]}
              showFullListing={this.state.showFullListing}
              onHideFullListing={this.hideFullListingHandler}
              description={listing[1]}
              deliveryMethod={listing[2]}
              location={listing[3]}
              module={listing[4]}
              price={listing[5]}
              textbook={listing[6]}
              identifier={listing[7]}
              userId={listing[8]}
            />
          );
        });
    }

    if (this.props.loading) {
      listings = <Spinner />;
    }

    return <div 
      className={classes.Listings}
      style={this.state.showFullListing ? 
        {justifyContent : 'left'} : 
        {justifyContent: 'center'}}>
          {listings}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    listingData: state.listing.listings,
    loading: state.listing.loading,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchListingInit: () => dispatch(actions.fetchListing()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Listings, firebaseAxios));
