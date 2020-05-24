import React, { Component } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";

import Layout from "./hoc/Layout/Layout";

import asyncComponent from "./hoc/asyncComponent/asyncComponent";
import Listings from "./containers/Homepage/Listings/Listings";

const asyncNewPost = asyncComponent(() => {
  return import("../src/containers/NewPost/NewPost");
});

class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          <Switch>
            <Route path="/" exact component={Listings} />
            <Route path="/new-post" component={asyncNewPost} />
            <Redirect to="/" />
          </Switch>
        </Layout>
      </div>
    );
  }
}

export default withRouter(App);
