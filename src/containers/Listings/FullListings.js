import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faTasks } from "@fortawesome/free-solid-svg-icons";
import Listing from "./Listing/Listing";
import Request from "../Requests/Request/Request";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./Listings.css";
class FullListings extends Component {
  state = {
    viewListing: true,
    viewRequest: false,
  };

  showRequestHandler = () => {
    this.setState({
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

  sortRequests = (requestArr) => {
    let swap;
    let n = requestArr.length - 1;
    do {
      swap = false;
      for (let i = 0; i < n; i++) {
        if (requestArr[i].date < requestArr[i + 1].date) {
          swap = true;
          const temp = requestArr[i];
          requestArr[i] = requestArr[i + 1];
          requestArr[i + 1] = temp;
        }
      }
      n--;
    } while (swap);

    swap = true;
    n = requestArr.length - 1;
    do {
      swap = false;
      for (let i = 0; i < n; i++) {
        if (
          requestArr[i].date === requestArr[i + 1].date &&
          requestArr[i].requestDetails.priority <
            requestArr[i + 1].requestDetails.priority
        ) {
          swap = true;
          const temp = requestArr[i];
          requestArr[i] = requestArr[i + 1];
          requestArr[i + 1] = temp;
        }
      }
      n--;
    } while (swap);

    return requestArr;
  };
  render() {
    if (this.props.loading) {
      return <Spinner />;
    }

    const toggleSwitch = (
      <div className={classes.Navigation}>
        <button
          onClick={this.showListingHandler}
          style={
            this.state.viewListing
              ? {
                  fontWeight: "bold",
                  color: "#dd5641",
                  borderBottom: "3px solid #dd5641",
                  outline: "none",
                }
              : null
          }
        >
          {<FontAwesomeIcon icon={faBook} style={{ paddingRight: "5px" }} />}
          Listings
        </button>
        <button
          onClick={this.showRequestHandler}
          style={
            this.state.viewRequest
              ? {
                  fontWeight: "bold",
                  color: "#dd5641",
                  borderBottom: "3px solid #dd5641",
                  outline: "none",
                }
              : null
          }
        >
          {<FontAwesomeIcon icon={faTasks} style={{ paddingRight: "5px" }} />}
          Requests
        </button>
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
          {this.sortRequests(this.props.allRequests).map((request) => {
            return (
              <Request
                history={this.props.history}
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
        {this.state.viewListing ? (
          <div className={classes.Listings}>{listings}</div>
        ) : (
          <div className={classes.Requests}>{requests}</div>
        )}
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
