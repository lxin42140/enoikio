import React, { Component } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Layout from "./hoc/Layout/Layout";
import asyncComponent from "./hoc/asyncComponent/asyncComponent";
import Listings from "./containers/Listings/FullListings";
import * as actions from "./store/actions/index";

const asyncNewPost = asyncComponent(() => {
  return import("./containers/NewPost/NewPost");
});

const asyncEditPost = asyncComponent(() => {
  return import("./containers/NewPost/EditPost");
});

const asyncNewRequest = asyncComponent(() => {
  return import("./containers/Requests/NewRequest");
});

const asyncAuth = asyncComponent(() => {
  return import("./containers/Auth/Auth");
});

const asyncFilteredResults = asyncComponent(() => {
  return import("./containers/util/FilterResults");
});

const asyncProfile = asyncComponent(() => {
  return import("./containers/Auth/Profile/Profile");
});

const asyncExpandedListing = asyncComponent(() => {
  return import("./containers/Listings/ExpandedListing/ExpandedListing");
});

const asyncChat = asyncComponent(() => {
  return import("./containers/Chat/Chat");
});

const asyncLogOut = asyncComponent(() => {
  return import("../src/containers/Auth/Logout/Logout");
});

const asyncGeneralProfile = asyncComponent(() => {
  return import("./containers/Auth/Profile/GeneralProfile");
});

const asyncFavorites = asyncComponent(() => {
  return import("./containers/Listings/Favorites/Favorites");
});
class App extends Component {
  componentDidMount() {
    this.props.dispatchAutoSignIn();
    this.props.dispatchFetchAllListings();
    this.props.dispatchFetchAllRequests();
    this.props.history.push("/");

    window.addEventListener("resize", () => {
      this.props.dispatchSetWidth(window.innerWidth);
    });
  }

  componentDidUpdate() {
    if (this.props.isAuthenticated && this.props.chatInitialLoad) {
      this.props.dispatchFetchChats();
    }
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/" exact component={Listings} />
        <Route path="/searchResults" component={asyncFilteredResults} />
        <Route path="/expanded-listing" component={asyncExpandedListing} />
        <Route path="/auth" component={asyncAuth} />
        <Route path="/searchProfile" component={asyncGeneralProfile} />
        <Redirect to="/" />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/" exact component={Listings} />
          <Route path="/searchResults" component={asyncFilteredResults} />
          <Route path="/searchProfile" component={asyncGeneralProfile} />
          <Route path="/new-post" component={asyncNewPost} />
          <Route path="/edit-post" component={asyncEditPost} />
          <Route path="/new-request" component={asyncNewRequest} />
          <Route path="/expanded-listing" component={asyncExpandedListing} />
          <Route path="/post-history" component={asyncFilteredResults} />
          <Route path="/liked-listings" component={asyncFavorites} />
          <Route path="/chats" component={asyncChat} />
          <Route path="/profile" component={asyncProfile} />
          <Route path="/logout" component={asyncLogOut} />
          <Redirect to="/" />
        </Switch>
      );
    }

    return (
      <div>
        <Layout>{routes}</Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.user !== null,
    chatInitialLoad: state.chat.initialLoad,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchFetchAllListings: () => dispatch(actions.fetchAllListings()),
    dispatchFetchAllRequests: () => dispatch(actions.fetchAllRequests()),
    dispatchFetchChats: () => dispatch(actions.fetchChats()),
    dispatchAutoSignIn: () => dispatch(actions.autoSignIn()),
    dispatchSetWidth: (width) => dispatch(actions.setWindowWidth(width)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
