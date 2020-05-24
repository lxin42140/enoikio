import React, { Component } from "react";

import classes from "./NavigationItems.css";
import NavigationItem from "./NavigationItem/NavigationItem";
import SearchBar from "../../../containers/Homepage/SearchBar/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faWindowClose } from "@fortawesome/free-solid-svg-icons";

class NavigationItems extends Component {
  state = {
    showSearchBar: false,
  };

  toggleSearchBarHandler = (event) => {
    this.setState((prevState) => ({ showSearchBar: !prevState.showSearchBar }));
  };

  render() {

    let nav = (
      <React.Fragment>
        <NavigationItem link="/" exact>
          Home
        </NavigationItem>
        <NavigationItem link="/new-post">New Post</NavigationItem>
        <NavigationItem link="/rental-history">Rental History</NavigationItem>
        <NavigationItem link="/logout">Log out</NavigationItem>
        <NavigationItem link="/auth">Log In</NavigationItem>
        <FontAwesomeIcon
          icon={faSearch}
          style={{
            color: "white",
            fontSize: "1.5rem",
            paddingLeft: "20px",
            paddingRight: "10px",
          }}
          onClick={this.toggleSearchBarHandler}
        />
      </React.Fragment>
    );
    
    if (this.state.showSearchBar) {
      nav = (
        <React.Fragment>
          <SearchBar />
          <FontAwesomeIcon
          icon={faWindowClose}
          style={{
            color: "white",
            fontSize: "1.5rem",
            paddingLeft: "20px",
            paddingRight: "10px",
          }}
          onClick={this.toggleSearchBarHandler}
        />
        </React.Fragment>
      )
    }

  let backgroundColor = {backgroundColor: "#fd8673"};
  if (this.state.showSearchBar) {
    backgroundColor = {backgroundColor: "#fdb2a7"}
  }

  return <ul className={classes.NavigationItems} style={backgroundColor}>{nav}</ul>;
  }
}

export default NavigationItems;
