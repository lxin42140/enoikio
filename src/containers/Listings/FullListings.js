import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Listing from "./Listing/Listing";
import Request from "../Requests/Request/Request";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./Listings.css";

class FullListings extends Component {
  state = {
    initialLoad: true,
    viewListing: true,
    viewRequest: false,
  };

  showRequestHandler = () => {
    this.setState({
      initialLoad: false,
      viewListing: false,
      viewRequest: true,
    });
  };

  showListingHandler = () => {
    this.setState({
      viewListing: true,
      viewRequest: false,
    });
  };

  render() {
    if (this.props.loading) {
      return <Spinner />;
    }

    const toggleSwitch = (
      <div className={classes.Navigation}>
        <button onClick={this.showListingHandler}>
          {this.state.initialLoad ? (
            <button
              style={{
                fontWeight: "bold",
                color: "#dd5641",
                borderBottom: "3px solid #dd5641",
                outline: "none",
                marginRight: "0",
              }}
            >
              Listings
            </button>
          ) : (
            "Listings"
          )}
        </button>
        <button onClick={this.showRequestHandler}>Requests</button>
      </div>
    );

    let listings;
    if (this.props.fullListings.length < 1) {
      listings = <h3>Oops..No available listings</h3>;
    } else {
      listings = this.props.fullListings.map((listing) => {
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
    }

    let requests;
    if (this.props.allRequests.length < 1) {
      requests = (
        <React.Fragment>
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
          <h3>No requests at the moment</h3>
        </React.Fragment>
      );
    } else {
      requests = (
        <React.Fragment>
          <div className={classes.Selections}>
            {this.props.isAuthenticated ? (
              <Link to="/new-request">
                <a className={classes}>Make a request</a>
              </Link>
            ) : (
              <Link to="/auth">
                <a>Make a request</a>
              </Link>
            )}
          </div>
          {this.props.allRequests.map((request) => {
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
          })}
        </React.Fragment>
      );
    }

    return (
      <div>
        <div>{toggleSwitch}</div>
        <div className={classes.Listings}>
          {this.state.viewListing ? listings : null}
        </div>
          {this.state.viewRequest ? requests : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    fullListings: state.listing.listings,
    allRequests: state.request.requests,
    loading: state.listing.loading,
    isAuthenticated: state.auth.user !== null,
  };
};

export default connect(mapStateToProps)(FullListings);
