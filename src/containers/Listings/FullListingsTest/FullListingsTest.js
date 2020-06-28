import React, { Component } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "../Listings.css";
import { Listing, Request } from "./TestDrivers";

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
        return <Listing />;
      });
    }

    let requests;
    if (this.props.allRequests.length < 1) {
      requests = (
        <React.Fragment>
          <div className={classes.Selections}>
            {this.props.isAuthenticated ? (
              <Link className="redirectToNew-request" to="/new-request">
                <a>Make a request</a>
              </Link>
            ) : (
              <Link className="redirectToAuth" to="/auth">
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
              <Link className="redirectToNew-request" to="/new-request">
                <a>Make a request</a>
              </Link>
            ) : (
              <Link className="redirectToAuth" to="/auth">
                <a>Make a request</a>
              </Link>
            )}
          </div>
          {this.props.allRequests.map((request) => {
            return <Request />;
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
        <div className={classes.Listings}>
          {this.state.viewRequest ? requests : null}
        </div>
      </div>
    );
  }
}

export default FullListings;
