import React, { Component } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Layout from "./hoc/Layout/Layout";
import asyncComponent from "./hoc/asyncComponent/asyncComponent";
import Listings from "./containers/Listings/FullListings";
import Logout from "../src/containers/Auth/Logout/Logout";
import * as actions from "./store/actions/index";

const asyncNewPost = asyncComponent(() => {
  return import("./containers/NewPost/NewPost");
});

const asyncAuth = asyncComponent(() => {
  return import("./containers/Auth/Auth");
});

const asyncPostHistory = asyncComponent(() => {
  return import("./containers/PostHistory/PostHistory");
});

const asyncFilteredListings = asyncComponent(() => {
  return import("./containers/Listings/FilteredListings");
});

const asyncChatBox = asyncComponent(() => {
  return import("./containers/Chat/ChatBox");
});

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignUp();
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/" exact component={Listings} />
        <Route path="/searchResults" component={asyncFilteredListings} />
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
          <Route path="/post-history" component={asyncPostHistory} />
          <Route path="/chat" component={asyncChatBox}/>
          <Route path="/logout" component={Logout} />
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
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignUp: () => dispatch(actions.authCheckState()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
