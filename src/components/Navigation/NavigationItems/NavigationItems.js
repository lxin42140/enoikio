import React from "react";

import classes from "./NavigationItems.css";
import NavigationItem from "./NavigationItem/NavigationItem";

const navigationItems = (props) => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link="/" exact>Home</NavigationItem>
    <NavigationItem link="/new-post">New Post</NavigationItem>
    <NavigationItem link="/rental-history">Rental History</NavigationItem>
    <NavigationItem link="/logout">Log out</NavigationItem>
    <NavigationItem link="/auth">Log In</NavigationItem>
  </ul>
);

export default navigationItems;
