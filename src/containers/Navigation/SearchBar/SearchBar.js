import React, { Component } from "react";
import { connect } from "react-redux";

import classes from "./SearchBar.css";
import * as actions from "../../../store/actions/index";
import DropDown from "./Dropdown/DropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationArrow,
  faBook,
  faUniversity,
  faWindowClose,
  faSearch,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

class SearchBar extends Component {
  state = {
    showFilterDropDown: false,
    userInput: "",
    filterType: "moduleCode",
    placeHolder: "module code",
  };

  changeFilterHandler = (filter) => {
    let placeHolder = "";
    switch (filter) {
      case "moduleCode":
        placeHolder = "module code";
        break;
      case "textbook":
        placeHolder = "textbook title";
        break;
      default:
        placeHolder = "location";
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
    this.setState({ userInput: event.target.value, showFilterDropDown: false });
  };

  onCancelSearchHandler = (event) => {
    this.props.onClick();
    this.props.history.goBack();
  };

  onSearchHandler = (event) => {
    if (this.state.userInput !== "") {
      this.props.setFilterTerm(
        this.state.filterType,
        this.state.userInput.toLowerCase()
      );
      this.props.history.push("/searchResults");
    }
  };

  onEnterSearchHandler = (event) => {
    if (event.keyCode === 13) {
      this.onSearchHandler();
    }
  };

  render() {
    let dropDown = (
      <React.Fragment>
        <DropDown
          icon={faLocationArrow}
          onClick={() => this.changeFilterHandler("location")}
          text={"location"}
        />
        <DropDown
          icon={faBook}
          onClick={() => this.changeFilterHandler("textbook")}
          text={"book title"}
        />
        <DropDown
          icon={faUniversity}
          onClick={() => this.changeFilterHandler("moduleCode")}
          text={"module code"}
        />
      </React.Fragment>
    );

    if (!this.state.showFilterDropDown) {
      dropDown = null;
    }

    const placeHolder =
      "Enter the " + this.state.placeHolder + " to start searching...";

    return (
      <React.Fragment>
        <div className={classes.Searchbar}>
          <div className={classes.filter}>
            <div style={{height: "100%"}}onClick={this.filterDropdownHandler}>
              <button className={classes.button}>Filter by</button>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={classes.arrowDown}
              />
            </div>
            <div className={classes.dropdownContent}>{dropDown}</div>
          </div>
          <div className={classes.searchBox}>
            <input
              className={classes.input}
              type="text"
              onChange={this.onChangeHandler}
              onKeyDown={this.onEnterSearchHandler}
              value={this.state.userInput}
              placeholder={placeHolder}
            />
            <div>
              <FontAwesomeIcon
                icon={faSearch}
                className={classes.searchIcon}
                style={{ paddingRight: "10px" }}
                onClick={this.onSearchHandler}
              />
            </div>
          </div>
        </div>
        <FontAwesomeIcon
          icon={faWindowClose}
          className={classes.closeIcon}
          onClick={this.onCancelSearchHandler}
        />
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFilterTerm: (filterType, object) =>
      dispatch(actions.setFilterListings(filterType, object)),
  };
};

export default connect(null, mapDispatchToProps)(SearchBar);
