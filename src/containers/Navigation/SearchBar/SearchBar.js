import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import classes from "./SearchBar.css";
import * as actions from "../../../store/actions/index";
import Button from "../../../components/UI/Button/Button";
import DropDown from "./Dropdown/DropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationArrow,
  faBook,
  faUniversity,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";

class SearchBar extends Component {
  state = {
    showFilterDropDown: false,
    userInput: "",
    filterType: "module",
    placeHolder: "module code",
  };

  changeFilterHandler = (filter) => {
    let placeHolder = "";
    switch (filter) {
      case "module":
        placeHolder = "module code";
        break;
      case "title":
        placeHolder = "textbook title";
        break;
      default:
        placeHolder = "preferred location";
        break;
    }
    this.setState({
      showFilterDropDown: false,
      filterType: filter,
      placeHolder: placeHolder,
    });
  };

  filterDropdownHandler = (event) => {
    this.setState((prevState) => ({
      showFilterDropDown: !prevState.showFilterDropDown,
    }));
  };

  onChangeHandler = (event) => {
    this.setState({ userInput: event.target.value });
  };

  onCancelSearchHandler = (event) => {
    if (this.state.userInput !== "") {
      this.props.dispatchFetchAllListing();
      this.props.history.goBack();
    }
    this.props.onClick();
  };

  render() {
    let dropDown = null;

    if (this.state.showFilterDropDown) {
      dropDown = (
        <React.Fragment>
          <DropDown
            icon={faLocationArrow}
            onClick={() => this.changeFilterHandler("location")}
            text={"location"}
          />
          <DropDown
            icon={faBook}
            onClick={() => this.changeFilterHandler("title")}
            text={"book title"}
          />
          <DropDown
            icon={faUniversity}
            onClick={() => this.changeFilterHandler("module")}
            text={"module code"}
          />
        </React.Fragment>
      );
    }

    let filterButton = (
        <span style={{ paddingRight: "20px" }}>
          <Button onClick={this.filterDropdownHandler}>Filter by</Button>
          <div className={classes.dropdownContent}>{dropDown}</div>
        </span>
    );

    let searchButton = (
      <span style={{ paddingLeft: "20px" }}>
        <Link to="/">
          <Button
            btnType="Important"
            onClick={() =>
              this.state.userInput !== ""
                ? this.props.dispatchFetchFilteredListing(
                    this.state.filterType,
                    this.state.userInput
                  )
                : null
            }
          >
            Search
          </Button>
        </Link>
      </span>
    );

    let cancelSearchButton = (
      <FontAwesomeIcon
        icon={faWindowClose}
        style={{
          color: "white",
          fontSize: "1.5rem",
          paddingLeft: "10%",
          paddingRight: "2%",
        }}
        onClick={this.onCancelSearchHandler}
      />
    );

    const placeHolder =
      "Enter the " + this.state.placeHolder + " to start searching!";

    return (
      <div className={classes.Searchbar}>
        {filterButton}
        <input
          className={classes.input}
          type="text"
          onChange={this.onChangeHandler}
          value={this.state.userInput}
          placeholder={placeHolder}
        />
        {searchButton}
        {cancelSearchButton}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchFetchFilteredListing: (filterType, data) =>
      dispatch(actions.fetchFilteredListing(filterType, data)),
    dispatchFetchAllListing: () => dispatch(actions.fetchAllListings()),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withErrorHandler(SearchBar, axios));
