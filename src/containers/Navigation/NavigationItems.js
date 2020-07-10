import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars } from "@fortawesome/free-solid-svg-icons";

import classes from "./NavigationItems.css";
import NavigationItem from "./NavigationItem/NavigationItem";
import SearchBar from "./SearchBar/SearchBar";
import * as actions from "../../store/actions/index";

class NavigationItems extends Component {
  state = {
    showSearchBar: false,
    showDropDown: false,
  };

  toggleSearchBarHandler = (event) => {
    this.setState((prevState) => ({ showSearchBar: !prevState.showSearchBar }));
  };

  toggleDropDown = () => {
    this.setState((prevState) => ({ showDropDown: !prevState.showDropDown }));
  };

  render() {
    let nav;

    //KIV: change this to side menu
    if (this.props.windowWidth < 525) {
      let dropDown;
      if (this.props.isAuthenticated) {
        dropDown = (
          <React.Fragment>
            <NavigationItem link="/" exact onClick={this.toggleDropDown}>
              Home
            </NavigationItem>
            <NavigationItem link="/new-post" onClick={this.toggleDropDown}>
              New Post
            </NavigationItem>
            <NavigationItem
              link="/liked-listings"
              onClick={() => {
                this.props.setFilterTerm("favorites");
                this.toggleDropDown();
              }}
            >
              Favorites
            </NavigationItem>
            <NavigationItem link="/chats" onClick={this.toggleDropDown}>
              Chats
            </NavigationItem>
            <NavigationItem
              link="/profile"
              onClick={() => {
                this.props.setFilterTerm("displayName");
                this.toggleDropDown();
              }}
            >
              Profile
            </NavigationItem>
            <NavigationItem link="/logout" onClick={this.toggleDropDown}>
              Log out
            </NavigationItem>
          </React.Fragment>
        );
      } else {
        dropDown = (
          <React.Fragment>
            <NavigationItem link="/" exact onClick={this.toggleDropDown}>
              Home
            </NavigationItem>
            <NavigationItem link="/auth" onClick={this.toggleDropDown}>
              Log in
            </NavigationItem>
          </React.Fragment>
        );
      }

      nav = (
        <div className={classes.filter}>
          <div className={classes.Button}>
            <FontAwesomeIcon
              icon={faBars}
              style={{
                color: "white",
                fontSize: "1.5rem",
                paddingTop: "12px",
              }}
              onClick={this.toggleDropDown}
            />
          </div>
          <div className={classes.dropdownContent}>
            {this.state.showDropDown ? dropDown : null}
          </div>
        </div>
      );
    } else {
      if (!this.props.isAuthenticated) {
        nav = (
          <React.Fragment>
            <NavigationItem link="/" exact>
              Home
            </NavigationItem>
            <NavigationItem link="/auth">Log In</NavigationItem>
          </React.Fragment>
        );
      } else {
        nav = (
          <React.Fragment>
            <NavigationItem link="/" exact>
              Home
            </NavigationItem>
            <NavigationItem link="/new-post">New Post</NavigationItem>
            <NavigationItem
              link="/liked-listings"
              onClick={() => this.props.setFilterTermForListing("favorites")}
            >
              Favorites
            </NavigationItem>
            <NavigationItem link="/chats">Chats</NavigationItem>
            <NavigationItem
              link="/profile?profile=personal"
              onClick={() => this.props.setFilterTermForListing("displayName")}
            >
              Profile
            </NavigationItem>
            <NavigationItem link="/logout">Log out</NavigationItem>
          </React.Fragment>
        );
      }
    }

    let searchIcon = (
      <div className={classes.SearchIcon}>
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
      </div>
    );

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
        {searchIcon}
      </ul>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    windowWidth: state.window.width,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFilterTermForListing: (filterType) =>
      dispatch(actions.setFilterListings(filterType, "")),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NavigationItems);
