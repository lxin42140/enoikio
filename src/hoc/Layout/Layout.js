import React, { Component } from "react";
//import { connect } from "react-redux";

import classes from "./Layout.css";
import NavigationItems from "../../containers/Navigation/NavigationItems/NavigationItems";

class Layout extends Component {
  render() {
    return (
      <React.Fragment>
        <NavigationItems />
        <main className={classes.Content}>{this.props.children}</main>
      </React.Fragment>
    );
  }
}

export default Layout;
