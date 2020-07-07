import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Listing from "./Listing/Listing";
import Request from "../Requests/Request/Request";
import * as classes from "./Listings.css";

class FilteredListings extends Component {
  state = {
    filteredRequests: [],
    requestFilterType: "",

    filteredListings: [],
    filterType: "",
    searchObject: "",
  };

  componentDidUpdate() {
    // console.log(this.props.filterType);
    // console.log('state ' + this.state.filterType)
    if (this.props.filterRequest && 
      this.state.requestFilterType !== this.props.filterType) {
      this.filterRequests();
    } else if (
      this.props.filterType !== this.state.filterType ||
      this.state.searchObject !== this.props.searchObject
    ) {
      this.filter();
    }
  }

  componentDidMount() {
    if (this.props.filterRequest && (
      this.props.filterType !== this.state.filterType ||
      this.state.searchObject !== this.props.searchObject
    )) {
      this.filterRequests();
    } else if (
      this.props.filterType !== this.state.filterType ||
      this.state.searchObject !== this.props.searchObject
    ) {
      this.filter();
    }
  }

  filterRequests = () => {
    const filteredRequests = this.props.allRequests.filter(request => 
      request.displayName === this.props.displayName
    )
    this.setState({
      filteredRequests: filteredRequests,
      requestFilterType: this.props.filterType,
      searchObject: this.props.searchObject,
    })
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
      searchObject: this.props.searchObject,
    });
  };

  render() {
    if (this.props.filterRequest) {
      if (this.state.filteredRequests.length < 1) {
        return <h3>Submit your request and view it here...</h3>;
      } else {
        const myRequests = this.state.filteredRequests.map(request => {
          return (
            <Request
              key={request.key}
              request={request}
              node={request.key}
              module={request.requestDetails.module}
              textbook={request.requestDetails.textbook}
              requestType={request.requestDetails.requestType}
              userId={request.displayName}
              date={request.date}
              priority={request.requestDetails.priority}
            />
          );
        })
        return <div className={classes.Listings}>{myRequests}</div>;
      }
    }

    if (this.state.filteredListings.length < 1) {
      switch (this.state.filterType) {
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
    allRequests: state.request.requests,
    filterType: state.listing.filterType,
    searchObject: state.listing.searchObject,
    displayName: state.auth.displayName,
    isAuthenticated: state.auth.user !== null,
  };
};

export default connect(mapStateToProps)(FilteredListings);
