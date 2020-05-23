import React, { Component } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";

import Layout from "./hoc/Layout/Layout";

// import Logout from "./containers/Auth/Logout/Logout";
// import { connect } from "react-redux";
// import * as actions from "../src/store/actions/index";
import asyncComponent from "./hoc/asyncComponent/asyncComponent";
import Homepage from "./containers/Homepage/Homepage";

const asyncNewPost = asyncComponent(() => {
  return import("../src/containers/NewPost/NewPost");
});

class App extends Component {
  // componentDidMount() {
  //   this.props.onTryAutoSignUp();
  // }

  render() {
    // let routes = (
    //   <Switch>
    //     <Redirect to="/" />
    //   </Switch>
    // );

    // if (this.props.isAuthenticated) {
    //   routes = (
    //     <Switch>
    //       <Route path="/logout" component={Logout} />
    //       <Redirect to="/" />
    //     </Switch>
    //   );
    // }

    return (
      <div>
        <Layout>
          <Switch>
            <Route path="/" exact component={Homepage} />
            <Route path="/new-post" component={asyncNewPost} />
            <Redirect to="/" />
          </Switch>
        </Layout>
      </div>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     isAuthenticated: state.auth.token !== null,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     onTryAutoSignUp: () => dispatch(actions.authCheckState()),
//   };
// };

//export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export default withRouter(App);
