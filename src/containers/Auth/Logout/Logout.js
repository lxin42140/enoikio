import React, { Component } from "react";
import * as actions from "../../../store/actions/index";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class Logout extends Component {
  componentDidMount() {
    this.props.onSignOut();
  }

  render() {
    return <Redirect to="/" />;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSignOut: () => dispatch(actions.signOut()),
  };
};

export default connect(null, mapDispatchToProps)(Logout);
