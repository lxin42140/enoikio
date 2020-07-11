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
    // if (this.props.windowWidth < 525) {
    //   let dropDown;
    //   if (this.props.isAuthenticated) {
    //     dropDown = (
    //       <React.Fragment>
    //         <NavigationItem link="/" exact onClick={this.toggleDropDown}>
    //           Home
    //         </NavigationItem>
    //         <NavigationItem link="/new-post" onClick={this.toggleDropDown}>
    //           New Post
    //         </NavigationItem>
    //         <NavigationItem
    //           link="/liked-listings"
    //           onClick={() => {
    //             this.props.setFilterTerm("favorites");
    //             this.toggleDropDown();
    //           }}
    //         >
    //           Favorites
    //         </NavigationItem>
    //         <NavigationItem link="/chats" onClick={this.toggleDropDown}>
    //           Chats
    //         </NavigationItem>
    //         <NavigationItem
    //           link="/profile"
    //           onClick={() => {
    //             this.props.setFilterTerm("displayName");
    //             this.toggleDropDown();
    //           }}
    //         >
    //           Profile
    //         </NavigationItem>
    //         <NavigationItem link="/logout" onClick={this.toggleDropDown}>
    //           Log out
    //         </NavigationItem>
    //       </React.Fragment>
    //     );
    //   } else {
    //     dropDown = (
    //       <React.Fragment>
    //         <NavigationItem link="/" exact onClick={this.toggleDropDown}>
    //           Home
    //         </NavigationItem>
    //         <NavigationItem link="/auth" onClick={this.toggleDropDown}>
    //           Log in
    //         </NavigationItem>
    //       </React.Fragment>
    //     );
    //   }

    //   nav = (
    //     <div className={classes.filter}>
    //       <div className={classes.Button}>
    //         <FontAwesomeIcon
    //           icon={faBars}
    //           style={{
    //             color: "white",
    //             fontSize: "1.5rem",
    //             paddingTop: "12px",
    //           }}
    //           onClick={this.toggleDropDown}
    //         />
    //       </div>
    //       <div className={classes.dropdownContent}>
    //         {this.state.showDropDown ? dropDown : null}
    //       </div>
    //     </div>
    //   );
    // } else {

    if (this.state.showSearchBar) {
      nav = (
        <React.Fragment>
          <SearchBar history={this.props.history} />
        </React.Fragment>
      );
    } else if (!this.props.isAuthenticated) {
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
            {
              <FontAwesomeIcon
                icon={faComments}
                style={{ paddingRight: "5px" }}
              />
            }
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
            {
              <FontAwesomeIcon
                icon={faSignOutAlt}
                style={{ paddingRight: "5px" }}
              />
            }
            Log out
          </NavigationItem>
        </React.Fragment>
      );
    }
    // }

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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFilterTermForListing: (filterType) =>
      dispatch(actions.setFilterListings(filterType, "")),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NavigationItems);
