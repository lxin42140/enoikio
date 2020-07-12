import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBars,
  faWindowClose,
  faHome,
  faEdit,
  faHeart,
  faComments,
  faUser,
  faSignOutAlt,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";

import classes from "./NavigationItems.css";
import NavigationItem from "./NavigationItem/NavigationItem";
import SearchBar from "./SearchBar/SearchBar";
import SideDrawer from "../../components/Navigation/SideDrawer"
import * as actions from "../../store/actions/index";

class NavigationItems extends Component {
  state = {
    showSearchBar: false,
    showSideBar: false,
  };

  toggleSearchBarHandler = (event) => {
    this.setState((prevState) => ({ showSearchBar: !prevState.showSearchBar }));
  };

  showSideBar = () => {
    this.setState({ showSideBar: true })
  }

  hideSideBar = () => {
    this.setState({ showSideBar: false });
  };

  //TODO:
  //1. FIX TRANSITION OF SIDEBAR
  //2. NEED TO ADJUST FOR WHEN USER SCROLL WHEN SIDEBAR IS AVAILABLE
  render() {
    let nav;

    if (this.state.showSearchBar) {
      nav = (
        <React.Fragment>
          <SearchBar history={this.props.history} />
        </React.Fragment>
      );
    } else
      if (this.props.windowWidth < 750) {
        let sideBar;
        if (this.props.isAuthenticated) {
          sideBar = (
            <SideDrawer
              open={this.state.showSideBar}
              closed={this.hideSideBar}>
              <NavigationItem link="/" exact onClick={this.hideSideBar}>
                {<FontAwesomeIcon icon={faHome} style={{ paddingRight: "5px" }} />}
              Home
            </NavigationItem>
              <NavigationItem link="/new-post" onClick={this.hideSideBar}>
                {<FontAwesomeIcon icon={faEdit} style={{ paddingRight: "5px" }} />}
              New Post
            </NavigationItem>
              <NavigationItem
                link="/liked-listings"
                onClick={() => {
                  this.props.setFilterTermForListing("favorites");
                  this.hideSideBar();
                }}
              >
                {<FontAwesomeIcon icon={faHeart} style={{ paddingRight: "5px" }} />}
              Favorites
            </NavigationItem>
              <NavigationItem link="/chats" onClick={this.hideSideBar}>
                {<FontAwesomeIcon icon={faComments} style={{ paddingRight: "5px" }} />}
              Chats
            </NavigationItem>
              <NavigationItem
                link="/profile"
                onClick={() => {
                  this.props.setFilterTermForListing("displayName");
                  this.hideSideBar();
                }}
              >
                {<FontAwesomeIcon icon={faUser} style={{ paddingRight: "5px" }} />}
              Profile
            </NavigationItem>
              <NavigationItem link="/logout" onClick={this.hideSideBar}>
                {<FontAwesomeIcon icon={faSignOutAlt} style={{ paddingRight: "5px" }} />}
              Log out
            </NavigationItem>
            </SideDrawer>
          );
        } else {
          sideBar = (
            <SideDrawer
              open={this.state.showSideBar}
              closed={this.hideSideBar}>
              <NavigationItem link="/" exact onClick={this.hideSideBar}>
                {<FontAwesomeIcon icon={faHome} style={{ paddingRight: "5px" }} />}
              Home
            </NavigationItem>
              <NavigationItem link="/auth" onClick={this.hideSideBar}>
                {<FontAwesomeIcon icon={faSignOutAlt} style={{ paddingRight: "5px" }} />}
              Log in
            </NavigationItem>
            </SideDrawer>
          );
        }

        nav = (
          <div className={classes.filter}>
            <div
              className={classes.Button}
              onClick={this.state.showSideBar ?
                this.hideSideBar :
                this.showSideBar}>
              <FontAwesomeIcon
                icon={faBars}
                style={{
                  color: "white",
                  fontSize: "1.5rem",
                  paddingLeft: "20px",
                  paddingRight: "10px",
                }}
              />
            Menu
          </div>
            <div className={classes.dropdownContent}>
              {this.state.showSideBar ? sideBar : null}
            </div>
          </div>
        );

      } else {
        if (!this.props.isAuthenticated) {
          nav = (
            <React.Fragment>
              <NavigationItem link="/" exact>
                {<FontAwesomeIcon icon={faHome} style={{ paddingRight: "5px" }} />}
            Home
          </NavigationItem>
              <NavigationItem link="/auth">
                {
                  <FontAwesomeIcon
                    icon={faSignInAlt}
                    style={{ paddingRight: "5px" }}
                  />
                }
            Log In
          </NavigationItem>
            </React.Fragment>
          );
        } else {
          nav = (
            <React.Fragment>
              <NavigationItem link="/" exact>
                {<FontAwesomeIcon icon={faHome} style={{ paddingRight: "5px" }} />}
            Home
          </NavigationItem>
              <NavigationItem link="/new-post">
                {<FontAwesomeIcon icon={faEdit} style={{ paddingRight: "5px" }} />}
            New Post
          </NavigationItem>
              <NavigationItem
                link="/liked-listings"
                onClick={() => this.props.setFilterTermForListing("favorites")}
              >
                {<FontAwesomeIcon icon={faHeart} style={{ paddingRight: "5px" }} />}
            Favorites
          </NavigationItem>
              <NavigationItem link="/chats">
                {<FontAwesomeIcon icon={faComments} style={{ paddingRight: "5px" }} />}
            Chats
          </NavigationItem>
              <NavigationItem
                link="/profile?profile=personal"
                onClick={() => this.props.setFilterTermForListing("displayName")}
              >
                {<FontAwesomeIcon icon={faUser} style={{ paddingRight: "5px" }} />}
            Profile
          </NavigationItem>
              <NavigationItem link="/logout">
                {<FontAwesomeIcon icon={faSignOutAlt} style={{ paddingRight: "5px" }} />}
            Log out
          </NavigationItem>
            </React.Fragment>
          );
        }
      }

    let searchIcon = this.state.showSearchBar ? (
      <div className={classes.SearchIcon}>
        <FontAwesomeIcon
          icon={faWindowClose}
          style={{
            color: "white",
            fontSize: "1.5rem",
            paddingLeft: "20px",
            paddingRight: "10px",
          }}
          onClick={() => {
            this.toggleSearchBarHandler();
            this.props.history.push(
              this.props.history.location.search.split("&&")[0].split("=")[1]
            );
          }}
        />
      </div>
    ) : (
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

    let backgroundColor = { backgroundColor: "#fd8673" };
    if (this.state.showSearchBar) {
      backgroundColor = { backgroundColor: "#fdb2a7" };
    }

    return (
      <div className={classes.NavigationItems} style={backgroundColor}>
        {nav}
        {searchIcon}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    windowWidth: state.window.width,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFilterTermForListing: (filterType) =>
      dispatch(actions.setFilterListings(filterType, "")),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NavigationItems);
