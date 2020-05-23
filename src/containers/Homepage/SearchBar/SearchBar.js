import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";

import AutoComplete from "./AutoComplete/AutoComplete";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import classes from "./SearchBar.css";
import * as actions from "../../../store/actions/index";
import Button from "../../../components/UI/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faLocationArrow,
  faBook,
  faUniversity,
} from "@fortawesome/free-solid-svg-icons";

class SearchBar extends Component {
  state = {
    filterType: "module code",
    showDropDown: false,
  };

  componentDidMount() {
    this.props.dispatchSuggestionsInit("modules");
  }

  changeFilterHandler = (filter) => {
    switch (filter) {
      case "locations":
        this.setState({
          showDropDown: false,
          filterType: "preferred location",
        });
        break;
      case "titles":
        this.setState({
          showDropDown: false,
          filterType: "book title",
        });
        break;
      default:
        this.setState({
          showDropDown: false,
          filterType: "module code",
        });
        break;
    }
  };

  filterDropdownHandler = (event) => {
    this.setState((prevState) => ({
      showDropDown: !prevState.showDropDown,
    }));
  };

  render() {
    let dropDown = null;

    if (this.state.showDropDown) {
      dropDown = (
        <React.Fragment>
          <span className={classes.dropDownElement}>
            <FontAwesomeIcon
              icon={faLocationArrow}
              style={{ padding: "0 3px", fontSize: "1rem", color: "#ff9f90" }}
            />
            <a onClick={() => this.changeFilterHandler("locations")}>
              location
            </a>
          </span>
          <span className={classes.dropDownElement}>
            <FontAwesomeIcon
              icon={faBook}
              style={{ padding: "0 3px", fontSize: "1rem", color: "#ff9f90" }}
            />
            <a onClick={() => this.changeFilterHandler("titles")}>book title</a>
          </span>
          <span className={classes.dropDownElement}>
            <FontAwesomeIcon
              icon={faUniversity}
              style={{ padding: "0 3px", fontSize: "1rem", color: "#ff9f90" }}
            />
            <a onClick={() => this.changeFilterHandler("modules")}>
              module code
            </a>
          </span>
        </React.Fragment>
      );
    }

    return (
      <div className={classes.searchbar}>
        <div className={classes.dropDown}>
          <Button onClick={this.filterDropdownHandler}>Filter by</Button>
          <div className={classes.dropdownContent}>{dropDown}</div>
        </div>
        <AutoComplete
          suggestions={this.props.modules}
          filterType={this.state.filterType}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    modules: state.search.modules,
    locations: state.search.locations,
    textbooks: state.search.textbook,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchSuggestionsInit: (filter) =>
      dispatch(actions.suggestionsInit(filter)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(SearchBar, axios));
