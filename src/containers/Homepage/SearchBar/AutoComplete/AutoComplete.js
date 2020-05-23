import React, { Component } from "react";
import { connect } from "react-redux";

import classes from "./AutoComplete.css";
import * as actions from "../../../../store/actions/index";
import Button from "../../../../components/UI/Button/Button";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSearch } from "@fortawesome/free-solid-svg-icons";

class Autocomplete extends Component {
  state = {
    activeSuggestion: 0,
    filteredSuggestions: [],
    showSuggestions: false,
    userInput: "",
  };

  onChange = (event) => {
    const filteredSuggestions = this.props.suggestions.filter(
      (suggestion) =>
        suggestion
          .toLowerCase()
          .indexOf(event.currentTarget.value.toLowerCase()) > -1
    );
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: filteredSuggestions,
      showSuggestions: true,
      userInput: event.currentTarget.value,
    });
  };

  onClick = (event) => {
    this.props.dispatchSearchRequest(event.currentTarget.innerText);
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: event.currentTarget.innerText,
    });
  };

  onKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.props.dispatchSearchRequest(
        this.state.filteredSuggestions[this.state.activeSuggestion]
      );
      this.setState((prevState) => ({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: prevState.filteredSuggestions[prevState.activeSuggestion],
      }));
    } else if (event.keyCode === 38) {
      if (this.state.activeSuggestion === 0) {
        return;
      }
      this.setState((prevState) => ({
        activeSuggestion: prevState.activeSuggestion - 1,
      }));
    } else if (event.keyCode === 40) {
      if (
        this.state.activeSuggestion - 1 ===
        this.state.filteredSuggestions.length
      ) {
        return;
      }
      this.setState((prevState) => ({
        activeSuggestion: prevState.activeSuggestion + 1,
      }));
    }
  };

  render() {
    let suggestionsListComponent;
    const suggestionArray = Object.assign(this.state.filteredSuggestions, []);
    if (
      suggestionArray.length > 0 &&
      this.state.userInput !== "" &&
      this.state.showSuggestions
    ) {
      suggestionsListComponent = suggestionArray.map((suggestion, index) => {
        let name;
        if (index === this.state.activeSuggestion) {
          name = classes.suggestionActive;
        }
        return (
          <li className={name} key={suggestion} onClick={this.onClick}>
            {suggestion}
          </li>
        );
      });
    } else if (this.state.userInput !== "") {
      suggestionsListComponent = (
        <div className={classes.noSuggestions}>
          <em>Currently not available!</em>
        </div>
      );
    }

    const placeHolder =
      "Enter the " + this.props.filterType + " to start searching!";

    return (
      <React.Fragment>
        <div className={classes.autoComplete}>
          <input
            className={classes.input}
            type="text"
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            value={this.state.userInput}
            placeholder={placeHolder}
          />
          <ul className={classes.suggestions}>{suggestionsListComponent}</ul>
        </div>
        <Button
          btnType="Search"
          onClick={() =>
            this.state.userInput !== ""
              ? this.props.dispatchSearchRequest(this.state.userInput)
              : null
          }
        >
          Search
        </Button>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchSearchRequest: (query) => dispatch(actions.searchRequest(query)),
  };
};

export default connect(null, mapDispatchToProps)(Autocomplete);
