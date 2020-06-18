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

const asyncAuth = asyncComponent(() => {
  return import("./containers/Auth/Auth");
});

const asyncFilteredListings = asyncComponent(() => {
  return import("./containers/Listings/FilteredListings");
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

class App extends Component {
  componentDidMount() {
    this.props.dispatchAutoSignIn();
    this.props.dispatchFetchAllListings();
    this.props.history.push("/");
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
        <Route path="/searchResults" component={asyncFilteredListings} />
        <Route path="/expanded-listing" component={asyncExpandedListing} />
        <Route path="/auth" component={asyncAuth} />
        <Redirect to="/" />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/" exact component={Listings} />
          <Route path="/searchResults" component={asyncFilteredListings} />
          <Route path="/new-post" component={asyncNewPost} />
          <Route path="/edit-post" component={asyncEditPost} />
          <Route path="/expanded-listing" component={asyncExpandedListing} />
          <Route path="/post-history" component={asyncFilteredListings} />
          <Route path="/liked-listings" component={asyncFilteredListings} />
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
    dispatchFetchChats: () => dispatch(actions.fetchChats()),
    dispatchAutoSignIn: () => dispatch(actions.autoSignIn()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
