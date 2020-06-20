import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Listing from "./Listing/Listing";
import classes from "./Listings.css";

class FilteredListings extends Component {
  state = {
    filteredListings: [],
    filterType: "",
  };

  componentDidUpdate() {
    if (this.props.filterType !== this.state.filterType) {
      this.filter();
    }
  }

  componentDidMount() {
    if (this.props.filterType !== this.state.filterType) {
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
      case "textbook":
        filteredListings = this.props.listings.filter(
          (listing) => listing.postDetails.textbook === this.props.searchObject
        );
        break;
      case "moduleCode":
        filteredListings = this.props.listings.filter(
          (listing) => listing.postDetails.module === this.props.searchObject
        );
        break;
      case "location":
        filteredListings = this.props.listings.filter(
          (listing) => listing.postDetails.location === this.props.searchObject
        );
        break;
      default:
        break;
    }
    this.setState({
      filteredListings: filteredListings,
      filterType: this.props.filterType,
    });
  };

  render() {
    if (this.state.filteredListings.length < 1) {
      const message = <h3>Oops..No available listings</h3>;
      let makeRequest = null;
      if (this.props.filterType === "textbook" || this.props.filterType === "moduleCode") {
        if (this.props.isAuthenticated) {
          makeRequest = (
            <Link to="/new-request">
              <p>Make a request</p>
            </Link>
          );
        } else {
          makeRequest = (
            <Link to="/auth">
              <p>Make a request</p>
            </Link>
          );
        }
      }
      return (
        <div>
          {message}
          {makeRequest}
        </div>
      );
    }

    let listings = this.state.filteredListings.map((listing) => {
      if (listing.postDetails.deliveryMethod === "mail") {
        return (
          <Listing
            history={this.props.history}
            key={listing.unique}
            date={listing.date}
            identifier={listing.unique}
            userId={listing.displayName}
            status={listing.status}
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
          history={this.props.history}
          key={listing.unique}
          date={listing.date}
          identifier={listing.unique}
          userId={listing.displayName}
          status={listing.status}
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

    return <div className={classes.Listings}>{listings}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    listings: state.listing.listings,
    filterType: state.listing.filterType,
    searchObject: state.listing.searchObject,
    displayName: state.auth.displayName,
    isAuthenticated: state.auth.user !== null,
  };
};

export default connect(mapStateToProps)(FilteredListings);
