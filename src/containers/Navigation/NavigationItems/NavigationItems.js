import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import classes from "./NavigationItems.css";
import NavigationItem from "./NavigationItem/NavigationItem";
import SearchBar from "../../../containers/Navigation/SearchBar/SearchBar";

class NavigationItems extends Component {
  state = {
    showSearchBar: false,
  };

  toggleSearchBarHandler = (event) => {
    this.setState((prevState) => ({ showSearchBar: !prevState.showSearchBar }));
  };

  render() {
    let nav;

    if (this.props.isAuthenticated) {
      nav = (
        <React.Fragment>
          <NavigationItem link="/" exact>
            Home
          </NavigationItem>
          <NavigationItem link="/new-post">New Post</NavigationItem>
          <NavigationItem link="/post-history">Past Posts</NavigationItem>
          <NavigationItem link="/logout">Log out</NavigationItem>
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
    } else {
      nav = (
        <React.Fragment>
          <NavigationItem link="/" exact>
            Home
          </NavigationItem>
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
    }

    if (this.state.showSearchBar) {
      nav = (
        <React.Fragment>
          <SearchBar
            onClick={this.toggleSearchBarHandler}
            history={this.props.history}
          />
        </React.Fragment>
      );
    }

    let backgroundColor = { backgroundColor: "#fd8673" };
    if (this.state.showSearchBar) {
      backgroundColor = { backgroundColor: "#fdb2a7" };
    }

    return (
      <ul className={classes.NavigationItems} style={backgroundColor}>
        {nav}
      </ul>
    );
  }
}

export default NavigationItems;
