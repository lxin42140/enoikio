import React, { Component } from "react";
import { connect } from "react-redux";

import Spinner from "../../components/UI/Spinner/Spinner";
import firebaseAxios from "../../firebaseAxios";
import * as actions from "../../store/actions/index";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import FilteredListings from "../Listings/FilteredListings";

class PostHistory extends Component {
  componentDidMount() {
    this.props.dispatchFetchUserPosts("userID", this.props.userID);
  }

  render() {
    let history = this.props.loading ? <Spinner /> : <FilteredListings />;
    return <div>{history}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.filteredListing.loading,
    userID: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchFetchUserPosts: (type, userID) =>
      dispatch(actions.fetchFilteredListing(type, userID)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(PostHistory, firebaseAxios));
