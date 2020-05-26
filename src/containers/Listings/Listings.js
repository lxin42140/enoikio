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
0: description
1: delivery method
2: location
3: module code
4: price per month
5: textbook
6: userId
TODO: image id
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
          key={listing[6]}
          showFullListing={this.state.showFullListing}
          isAuthenticated={this.props.isAuthenticated}
          history={this.props.history}
          deliveryMethod={listing[1]}
          location={listing[2]}
          module={listing[3]}
          price={listing[4]}
          textbook={listing[5]}
          userId={listing[6]}
          onShowFullListing={(event) =>
            this.showFullListingHandler(event, listing[5])
          }
        />
      );
    });

    //TODO: when showing only one post, other summarized posts of the same module should show on the right

    if (this.state.showFullListing) {
      listings = this.props.listingData
        .filter((listing) => listing[5] === this.state.fullListingID)
        .map((listing) => {
          return (
            <Listing
              key={listing[6]}
              showFullListing={this.state.showFullListing}
              onHideFullListing={this.hideFullListingHandler}
              description={listing[0]}
              deliveryMethod={listing[1]}
              location={listing[2]}
              module={listing[3]}
              price={listing[4]}
              textbook={listing[5]}
              userId={listing[6]}
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
