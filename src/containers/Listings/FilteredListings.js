import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Listing from "./Listing/Listing";
import * as classes from "./Listings.css";
class FilteredListings extends Component {
  state = {
    filteredListings: [],
    filterType: "",
    searchObject: "",
  };

  componentDidUpdate() {
    if (
      this.props.filterType !== this.state.filterType ||
      this.state.searchObject !== this.props.searchObject
    ) {
      this.filter();
    }
  }

  componentDidMount() {
    if (
      this.props.filterType !== this.state.filterType ||
      this.state.searchObject !== this.props.searchObject
    ) {
      this.filter();
    }
  }

  filter = () => {
    let filteredListings = [];
    switch (this.props.filterType) {
      case "favorites":
        filteredListings = this.props.listings.filter((listing) => {
          for (let user in listing.likedUsers) {
            if (listing.likedUsers[user] === this.props.displayName) {
              return true;
            }
          }
          return false;
        });
        break;
      case "displayName":
        filteredListings = this.props.listings.filter(
          (listing) => listing.displayName === this.props.displayName
        );
        break;
      case "onRent":
        filteredListings = this.props.listings.filter(
          (listing) =>
            listing.displayName === this.props.displayName &&
            listing.lessee !== "none" &&
            listing.status !== "sold" &&
            listing.status !== "available"
        );
        break;
      case "searchProfile":
        filteredListings = this.props.listings.filter(
          (listing) => listing.formattedDisplayName === this.props.searchObject
        );
        break;
      case "textbook":
        filteredListings = this.props.listings.filter(
          (listing) =>
            listing.postDetails.textbook.toLowerCase().split(" ").join("") ===
            this.props.searchObject
        );
        break;
      case "moduleCode":
        filteredListings = this.props.listings.filter(
          (listing) =>
            listing.postDetails.module.toLowerCase().split(" ").join("") ===
            this.props.searchObject
        );
        break;
      case "location":
        filteredListings = this.props.listings.filter((listing) => {
          if (listing.postDetails.location) {
            return (
              listing.postDetails.location.toLowerCase().split(" ").join("") ===
              this.props.searchObject
            );
          }
          return false;
        });
        break;
      default:
        break;
    }
    this.setState({
      filteredListings: filteredListings,
      filterType: this.props.filterType,
      searchObject: this.props.searchObject,
    });
  };

  render() {
    if (this.state.filteredListings.length < 1) {
      switch (this.state.filterType) {
        case "location":
          return <h3>Oops, nothing to see here!</h3>;
        case "displayName":
          return <h3>Submit your listing and view it here...</h3>;
        case "onRent":
          return <h3>No rentals yet...</h3>;
        case "favorites":
          return <h3>Like a post and view it here...</h3>;
        case "moduleCode":
        case "textbook":
          return (
            <React.Fragment>
              <h3>Oops, no available listings</h3>
              <div className={classes.Selections}>
                {this.props.isAuthenticated ? (
                  <Link to="/new-request">
                    <a>Make a request</a>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <a>Make a request</a>
                  </Link>
                )}
              </div>
            </React.Fragment>
          );
        default:
          break;
      }
    }

    let listings;

    if (this.state.filteredListings.length > 0) {
      listings = this.state.filteredListings.map((listing) => {
        if (listing.postDetails.deliveryMethod === "mail") {
          return (
            <Listing
              filterType={this.state.filterType}
              history={this.props.history}
              key={listing.unique}
              date={listing.date}
              identifier={listing.unique}
              userId={listing.displayName}
              status={listing.status}
              lessee={listing.lessee}
              deliveryMethod={listing.postDetails.deliveryMethod}
              listingType={listing.postDetails.listingType}
              module={listing.postDetails.module}
              price={listing.postDetails.price}
              textbook={listing.postDetails.textbook}
              numImages={listing.numberOfImages}
              node={listing.key}
              likedUsers={listing.likedUsers}
            />
          );
        }
        return (
          <Listing
            filterType={this.state.filterType}
            history={this.props.history}
            key={listing.unique}
            date={listing.date}
            identifier={listing.unique}
            userId={listing.displayName}
            status={listing.status}
            lessee={listing.lessee}
            deliveryMethod={listing.postDetails.deliveryMethod}
            listingType={listing.postDetails.listingType}
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
    }

    return <div className={classes.Listings}>{listings}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    listings: state.listing.listings,
    filterType: state.search.filterType,
    searchObject: state.search.searchObject,
    displayName: state.auth.displayName,
    isAuthenticated: state.auth.user !== null,
  };
};

export default connect(mapStateToProps)(FilteredListings);
