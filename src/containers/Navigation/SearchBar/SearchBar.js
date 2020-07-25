import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationArrow,
  faBookOpen,
  faUniversity,
  faSearch,
  faChevronDown,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import classes from "./SearchBar.css";
import * as actions from "../../../store/actions/index";
import DropDown from "../../../components/UI/Dropdown/DropDown";

class SearchBar extends Component {
  state = {
    showFilterDropDown: false,
    userInput: "",
    filterType: "moduleCode",
    placeHolder: "module",
  };

  changeFilterHandler = (filter) => {
    let placeHolder = "";
    switch (filter) {
      case "moduleCode":
        placeHolder = "module";
        break;
      case "textbook":
        placeHolder = "textbook";
        break;
      case "searchProfile":
        placeHolder = "exact username";
        break;
      default:
        placeHolder = "location";
        break;
    }
    this.setState({
      showFilterDropDown: false,
      filterType: filter,
      placeHolder: placeHolder,
      userInput: "",
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

  onSearchHandler = (event) => {
    if (this.state.userInput === "") {
      return;
    }

    if (this.state.filterType === "searchProfile") {
      let formattedDisplayName = this.state.userInput
        .toLowerCase()
        .split(" ")
        .join("");

      let pathName = this.props.history.location.pathname;

      if (this.props.history.location.search) {
        pathName = this.props.history.location.search
          .split("&&")[0]
          .split("=")[1];
      }

      if (
        this.props.displayName.toLowerCase().split(" ").join("") ===
        formattedDisplayName
      ) {
        this.props.setFilterTermForListing("displayName", "");

        let query = "/profile?from=" + pathName + "&&profile=personal";

        this.props.history.push(query);
      } else {
        this.props.setFilterProfile(formattedDisplayName);

        let query =
          "/searchProfile?from=" +
          pathName +
          "&&profile=" +
          formattedDisplayName;

        this.props.history.push(query);
      }
    } else {
      this.props.setFilterTermForListing(
        this.state.filterType,
        this.state.userInput.toLowerCase().split(" ").join("")
      );

      let pathName = this.props.history.location.pathname;

      if (this.props.history.location.search) {
        pathName = this.props.history.location.search
          .split("&&")[0]
          .split("=")[1];
      }

      let query =
        "/searchResults?from=" + pathName + "&&search=" + this.state.userInput;
      this.props.history.push(query);
    }
  };

  onEnterSearchHandler = (event) => {
    if (event.keyCode === 13) {
      this.onSearchHandler();
    }
  };

  render() {
    const activeDropDownStyle = { backgroundColor: "#ffb3a7" };
    let dropDown = (
      <React.Fragment>
        <DropDown
          icon={faUniversity}
          onClick={() => this.changeFilterHandler("moduleCode")}
          text={"Module"}
          style={
            this.state.filterType === "moduleCode" ? activeDropDownStyle : null
          }
        />
        <DropDown
          icon={faBookOpen}
          onClick={() => this.changeFilterHandler("textbook")}
          text={"Textbook"}
          style={
            this.state.filterType === "textbook" ? activeDropDownStyle : null
          }
        />
        <DropDown
          icon={faLocationArrow}
          onClick={() => this.changeFilterHandler("location")}
          text={"Location"}
          style={
            this.state.filterType === "location" ? activeDropDownStyle : null
          }
        />
        <DropDown
          icon={faUser}
          onClick={() => this.changeFilterHandler("searchProfile")}
          text={"Username"}
          style={
            this.state.filterType === "searchProfile"
              ? activeDropDownStyle
              : null
          }
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
            <div
              style={{ height: "100%" }}
              onClick={this.filterDropdownHandler}
            >
              <button className={classes.button}>Filtering by</button>
              <span
                style={{
                  paddingRight: "5px",
                  color: "grey",
                  fontSize: "small",
                  cursor: "pointer",
                }}
              >
                {this.state.filterType === "moduleCode" ? (
                  <FontAwesomeIcon icon={faUniversity} />
                ) : this.state.filterType === "textbook" ? (
                  <FontAwesomeIcon icon={faBookOpen} />
                ) : this.state.filterType === "location" ? (
                  <FontAwesomeIcon icon={faLocationArrow} />
                ) : (
                  <FontAwesomeIcon icon={faUser} />
                )}
              </span>
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
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    displayName: state.auth.displayName,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFilterTermForListing: (filterType, object) =>
      dispatch(actions.setFilterListings(filterType, object)),
    setFilterProfile: (displayName) =>
      dispatch(actions.setFilterProfile(displayName.toLowerCase())),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
