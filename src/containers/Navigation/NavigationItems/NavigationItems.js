import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import classes from "./NavigationItems.css";
import NavigationItem from "./NavigationItem/NavigationItem";
import SearchBar from "../../../containers/Navigation/SearchBar/SearchBar";
import * as actions from "../../../store/actions/index";

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
          <NavigationItem
            link="/liked-listings"
            onClick={() => this.props.setFilterTerm("favorites")}
          >
            Favorites
          </NavigationItem>
          <NavigationItem link="/chats">Chats</NavigationItem>
          <NavigationItem
            link="/profile"
            onClick={() => this.props.setFilterTerm("displayName")}
          >
            Profile
          </NavigationItem>
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

const mapDispatchToProps = (dispatch) => {
  return {
    setFilterTerm: (filterType) =>
      dispatch(actions.setFilterListings(filterType, "")),
  };
};
export default connect(null, mapDispatchToProps)(NavigationItems);
