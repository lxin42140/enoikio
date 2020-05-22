import React, { Component } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";

import Layout from "./hoc/Layout/Layout";
import SearchBar from './containers/Homepage/SearchBar/SearchBar';
// import Logout from "./containers/Auth/Logout/Logout";
// import { connect } from "react-redux";
// import * as actions from "../src/store/actions/index";
// import asyncComponent from './hoc/asyncComponent/asyncComponent';

// const asyncCheckout = asyncComponent(() => {
//   return import("./containers/Checkout/Checkout")
// });


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
        <SearchBar />
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
