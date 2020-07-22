import React, { Component } from "react";
import { connect } from "react-redux";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Listing from "../Listing/Listing";
import * as classes from "./Favorites.css";
class Favorites extends Component {
  state = {
    filteredListings: [],
  };

  componentDidUpdate() {
    let updatedFilterListing = this.props.listings.filter((listing) => {
      for (let user in listing.likedUsers) {
        if (listing.likedUsers[user] === this.props.displayName) {
          return true;
        }
      }
      return false;
    });
    if (updatedFilterListing.length !== this.state.filteredListings.length) {
      this.setState({
        filteredListings: updatedFilterListing,
      });
    }
  }
  componentDidMount() {
    const filteredListings = this.props.listings.filter((listing) => {
      for (let user in listing.likedUsers) {
        if (listing.likedUsers[user] === this.props.displayName) {
          return true;
        }
      }
      return false;
    });
    this.setState({
      filteredListings: filteredListings,
    });
  }

  render() {
    if (this.state.filteredListings.length < 1) {
      return (
        <h3>
          Oops...
          {
            <FontAwesomeIcon
              icon={faHeart}
              style={{ paddingRight: "5px", color: "red" }}
            />
          }
          a post and view it here
        </h3>
      );
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

    return (
      <div>
        <div className={classes.Listings}>{listings}</div>
        <h3 style={{ color: "grey" }}>Oops...No more favorites</h3>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listings: state.listing.listings,
    displayName: state.auth.displayName,
  };
};

export default connect(mapStateToProps)(Favorites);
