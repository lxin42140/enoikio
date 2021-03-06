import React, { Component } from "react";
import { connect } from "react-redux";
// import { Link } from "react-router-dom";

import Listing from "../Listings/Listing/Listing";
import Request from "../Requests/Request/Request";
import * as classes from "./FilterResults.css";
import * as actions from "../../store/actions/index";
class FilterResults extends Component {
  state = {
    filteredRequests: [],
    filteredListings: [],
    filterType: "",
    searchObject: "",
    searching: false,
  };

  componentDidUpdate() {
    if (
      this.props.filterType !== this.state.filterType ||
      this.state.searchObject !== this.props.searchObject
    ) {
      this.filter();
    } else if (
      !this.props.history.location.search &&
      this.state.searching &&
      this.props.history.location.pathname === "/profile"
    ) {
      this.props.setFilterTermForListing("displayName", "");
      this.setState({
        searching: false,
      });
    } else if (
      this.state.filterType === "requests" &&
      this.props.allRequests.filter(
        (request) =>
          request.displayName.toLowerCase().split(" ").join("") ===
          this.props.searchObject
      ).length !== this.state.filteredRequests.length
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
    let filteredRequests = [];
    let searching = false;
    switch (this.props.filterType) {
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
      case "requests":
        filteredRequests = this.props.allRequests.filter(
          (request) =>
            request.displayName.toLowerCase().split(" ").join("") ===
            this.props.searchObject
        );
        break;
      case "textbook":
      case "moduleCode":
      case "location":
        filteredListings = this.props.listings.filter((listing) =>
          this.filterListing(listing)
        );
        filteredListings = this.sortListing(filteredListings);
        searching = true;
        break;
      default:
        break;
    }
    this.setState({
      filteredRequests: filteredRequests,
      filteredListings: filteredListings,
      filterType: this.props.filterType,
      searchObject: this.props.searchObject,
      searching: searching,
    });
  };

  // filter out listings that are completely different
  // filter by module code, book title, and location
  filterListing = (listing) => {
    let str = "";
    switch (this.props.filterType) {
      case "moduleCode":
        str = listing.postDetails.module.toLowerCase().split(" ").join("");
        break;
      case "location":
        if (!listing.postDetails.location) {
          return false;
        }
        str = listing.postDetails.location.toLowerCase().split(" ").join("");
        break;
      case "textbook":
        str = listing.postDetails.textbook.toLowerCase().split(" ").join("");
        break;
      default:
        break;
    }
    let diffCount = 0;
    for (let i = 0; i < str.length && i < this.props.searchObject.length; i++) {
      if (str.charAt(i) !== this.props.searchObject.charAt(i)) {
        diffCount++;
      }
    }
    if (
      diffCount === str.length ||
      diffCount === this.props.searchObject.length
    ) {
      if (str.indexOf(this.props.searchObject) > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  // rank base on similarity with search term
  rank = (listing) => {
    let str = "";
    switch (this.props.filterType) {
      case "moduleCode":
        str = listing.postDetails.module.toLowerCase().split(" ").join("");
        break;
      case "location":
        if (!listing.postDetails.location) {
          return false;
        }
        str = listing.postDetails.location.toLowerCase().split(" ").join("");
        break;
      case "textbook":
        str = listing.postDetails.textbook.toLowerCase().split(" ").join("");
        break;
      default:
        break;
    }
    let similarCount = 0;
    for (let i = 0; i < str.length && i < this.props.searchObject.length; i++) {
      if (str.charAt(i) === this.props.searchObject.charAt(i)) {
        similarCount++;
      } else {
        similarCount--;
      }
    }
    return similarCount;
  };

  // bubble sort
  sortListing = (listingArr) => {
    let swap;
    let n = listingArr.length - 1;
    do {
      swap = false;
      for (let i = 0; i < n; i++) {
        if (this.rank(listingArr[i]) < this.rank(listingArr[i + 1])) {
          swap = true;
          const temp = listingArr[i];
          listingArr[i] = listingArr[i + 1];
          listingArr[i + 1] = temp;
        }
      }
      n--;
    } while (swap);
    return listingArr;
  };

  onRedirectToNewRequest = () => {
    let path = this.props.history.location.search.split("&&")[0];
    path = "/new-request" + path;
    this.props.history.push(path);
  };
  render() {
    if (this.state.filterType === "requests") {
      if (
        this.state.filteredRequests.length < 1 &&
        this.state.searchObject !==
          this.props.displayName.toLowerCase().split(" ").join("")
      ) {
        return (
          <h3 style={{ color: "grey" }}>
            Oops...This user did not make any requests
          </h3>
        );
      } else if (
        this.state.filteredRequests.length < 1 &&
        this.state.searchObject ===
          this.props.displayName.toLowerCase().split(" ").join("")
      ) {
        return (
          <h3 style={{ color: "grey" }}>
            Oops...Post your request and view it here
          </h3>
        );
      } else {
        const myRequests = this.state.filteredRequests.map((request) => {
          return (
            <Request
              isProfile={true}
              key={request.key}
              request={request}
              node={request.key}
              module={request.requestDetails.module}
              textbook={request.requestDetails.textbook}
              requestType={request.requestDetails.requestType}
              userId={request.displayName}
              date={request.date}
              priority={request.requestDetails.priority}
              history={this.props.history}
            />
          );
        });
        return (
          <div style={{ width: "100%" }}>
            <div className={classes.Listings}>{myRequests}</div>
            <h3 style={{ color: "grey", textAlign: "center" }}>
              Oops...No more requests!
            </h3>
          </div>
        );
      }
    }

    if (this.state.filteredListings.length < 1) {
      switch (this.state.filterType) {
        case "location":
          return (
            <h3 style={{ color: "grey" }}>
              Oops...No available listings at this location
            </h3>
          );
        case "displayName":
          return (
            <h3 style={{ color: "grey" }}>
              Oops...Post your listing and view it here
            </h3>
          );
        case "searchProfile":
          return (
            <h3 style={{ color: "grey" }}>Oops...This user has no listings</h3>
          );
        case "onRent":
          return <h3 style={{ color: "grey" }}>Oops...No rentals yet</h3>;
        case "moduleCode":
          return (
            <React.Fragment>
              <h3 style={{ color: "grey" }}>
                Oops...No available listings for this module
              </h3>
              <div className={classes.Selections}>
                {this.props.isAuthenticated ? (
                  <a onClick={this.onRedirectToNewRequest}>Submit request</a>
                ) : (
                  <a onClick={() => this.props.history.push("/auth")}>
                    Submit request
                  </a>
                )}
              </div>
            </React.Fragment>
          );
        case "textbook":
          return (
            <React.Fragment>
              <h3 style={{ color: "grey" }}>
                Oops...No available listings for this textbook
              </h3>
              <div className={classes.Selections}>
                {this.props.isAuthenticated ? (
                  <a onClick={this.onRedirectToNewRequest}>Submit request</a>
                ) : (
                  <a onClick={() => this.props.history.push("/auth")}>
                    Submit request
                  </a>
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

    let requestPrompt = null;
    if (
      this.state.filterType === "moduleCode" ||
      this.state.filterType === "textbook" ||
      this.state.filterType === "location"
    ) {
      requestPrompt = (
        <div style={{ fontSize: "small", paddingTop: "-20px" }}>
          <p>
            <i>Not what you are looking for? Make a request!</i>
          </p>
          <div className={classes.Selections}>
            {this.props.isAuthenticated ? (
              <a onClick={this.onRedirectToNewRequest}>Submit request</a>
            ) : (
              <a onClick={() => this.props.history.push("/auth")}>
                Submit request
              </a>
            )}
          </div>
        </div>
      );
    }

    return (
      <div>
        {requestPrompt}
        <div className={classes.Listings}>{listings}</div>
        {this.state.filterType === "onRent" ? null : (
          <h3 style={{ color: "grey", textAlign: "center" }}>
            Oops...No more listings!
          </h3>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listings: state.listing.listings,
    filterType: state.search.filterType,
    searchObject: state.search.searchObject,
    allRequests: state.request.requests,
    displayName: state.auth.displayName,
    isAuthenticated: state.auth.user !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFilterTermForListing: (filterType, object) =>
      dispatch(actions.setFilterListings(filterType, object)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(FilterResults);
