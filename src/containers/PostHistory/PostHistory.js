import React, { Component } from "react";
import { connect } from "react-redux";

import Spinner from "../../components/UI/Spinner/Spinner";
import firebaseAxios from "../../firebaseAxios";
import * as actions from "../../store/actions/index";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import Listings from "../Listings/Listings";

class PostHistory extends Component {
  componentDidMount() {
    this.props.onFetchUserPosts("userID", this.props.userID);
  }

  componentWillUnmount() {
    this.props.onFetchAllPosts()
  }

  render() {
    let history = this.props.loading ? <Spinner /> : <Listings />;
    return <div>{history}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    listingData: state.listing.listings,
    loading: state.listing.loading,
    userID: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchUserPosts: (type, userID) =>
      dispatch(actions.fetchFilteredListing(type, userID)),
    onFetchAllPosts: () => dispatch(actions.fetchAllListings())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(PostHistory, firebaseAxios));
