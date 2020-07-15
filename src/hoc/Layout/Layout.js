import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import classes from "./Layout.css";
import NavigationItems from "../../containers/Navigation/NavigationItems";

class Layout extends Component {
  render() {
    const style = [classes.Content];
    if (this.props.lockScroll) {
      style.push(classes.LockScroll);
    }

    return (
      <React.Fragment>
        <NavigationItems
          isAuthenticated={this.props.isAuthenticated}
          history={this.props.history}
        />
        <main className={style.join(" ")}>{this.props.children}</main>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.user !== null,
    lockScroll: state.window.showSideBar === true,
  };
};

export default withRouter(connect(mapStateToProps)(Layout));
