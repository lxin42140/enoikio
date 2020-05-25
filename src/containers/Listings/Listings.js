import React, { Component } from "react";
import { connect } from "react-redux";


import Listing from "./Listing/Listing";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";
import firebaseAxios from "../../firebaseAxios";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

class Listings extends Component {
  state = {
    showFullListing: false,
    fullListingID: "",
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
        <React.Fragment>
        <div
          key={listing[6]}
          onClick={(event) => this.showFullListingHandler(event, listing[6])}
        >
          <Listing
            showFullListing={this.state.showFullListing}
            module={listing[3]}
            price={listing[4]}
            textbook={listing[5]}
            userId={listing[6]}
          />
        </div>
        </React.Fragment>
      );
    });

    if (this.state.showFullListing) {
      listings = this.props.listingData
        .filter((listing) => listing[6] === this.state.fullListingID)
        .map((listing) => {
          return (
            <div key={listing[6]}>
              <Listing
                showFullListing={this.state.showFullListing}
                clicked={this.hideFullListingHandler}
                description={listing[0]}
                deliveryMethod={listing[1]}
                location={listing[2]}
                module={listing[3]}
                price={listing[4]}
                textbook={listing[5]}
                userId={listing[6]}
              />
            </div>
          );
        });
    }

    if (this.props.loading) {
      listings = <Spinner />;
    }

    return <div>{listings}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    listingData: state.listing.listings,
    loading: state.listing.loading,
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
