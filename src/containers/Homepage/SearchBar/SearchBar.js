import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import classes from "./SearchBar.css";
import * as actions from "../../../store/actions/index";
import Button from "../../../components/UI/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationArrow,
  faBook,
  faUniversity,
} from "@fortawesome/free-solid-svg-icons";

class SearchBar extends Component {
  state = {
    filterType: "module code",
    showFilterDropDown: false,
    userInput: "",
  };

  changeFilterHandler = (filter) => {
    this.setState({
      showFilterDropDown: false,
      filterType: filter,
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

  render() {
    let dropDown = null;

    if (this.state.showFilterDropDown) {
      dropDown = (
        <React.Fragment>
          <span className={classes.dropDownElement}>
            <FontAwesomeIcon
              icon={faLocationArrow}
              style={{ padding: "0 3px", fontSize: "1rem", color: "#ff9f90" }}
            />
            <a onClick={() => this.changeFilterHandler("preferred location")}>
              location
            </a>
          </span>
          <span className={classes.dropDownElement}>
            <FontAwesomeIcon
              icon={faBook}
              style={{ padding: "0 3px", fontSize: "1rem", color: "#ff9f90" }}
            />
            <a onClick={() => this.changeFilterHandler("textbook title")}>
              book title
            </a>
          </span>
          <span className={classes.dropDownElement}>
            <FontAwesomeIcon
              icon={faUniversity}
              style={{ padding: "0 3px", fontSize: "1rem", color: "#ff9f90" }}
            />
            <a onClick={() => this.changeFilterHandler("module code")}>
              module code
            </a>
          </span>
        </React.Fragment>
      );
    }

    const placeHolder =
      "Enter the " + this.state.filterType + " to start searching!";

    return (
      <div className={classes.Searchbar}>
        <div className={classes.dropDown}>
          <span style={{ paddingRight: "20px" }}>
            <Button onClick={this.filterDropdownHandler}>Filter by</Button>
            <div className={classes.dropdownContent}>{dropDown}</div>
          </span>
        </div>
        <input
          className={classes.input}
          type="text"
          onChange={this.onChangeHandler}
          value={this.state.userInput}
          placeholder={placeHolder}
        />
        <span style={{ paddingLeft: "20px" }}>
          <Link to="/">
            <Button
              btnType="Important"
              onClick={() =>
                this.state.userInput !== ""
                  ? this.props.dispatchFetchListing(this.state.userInput)
                  : null
              }
            >
              Search
            </Button>
          </Link>
        </span>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchFetchListing: (userInput) =>
      dispatch(actions.fetchListing(userInput)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withErrorHandler(SearchBar, axios));
