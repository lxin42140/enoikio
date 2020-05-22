import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";

import AutoComplete from "./AutoComplete/AutoComplete";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import classes from "./SearchBar.css";
import * as actions from "../../../store/actions/index";
import Button from "../../../components/UI/Button/Button";

class SearchBar extends Component {
  state = {
    filterType: "module code",
  };

  componentDidMount() {
    this.props.dispatchSuggestionsInit("modules");
  }

  changeFilterHandler = (filter) => {
    switch (filter) {
      case "locations":
        this.setState({
          filterType: "preferred location",
        });
        break;
      case "titles":
        this.setState({
          filterType: "book title",
        });
        break;
      default:
        this.setState({
          filterType: "module code",
        });
        break;
    }
  };

  render() {
    return (
      <div className={classes.SearchBar}>
        <AutoComplete
          filterType={this.state.filterType}
          suggestions={this.props.modules}
        />
        <Button
          btnType="Success"
          onClick={() => this.changeFilterHandler("locations")}
        >
          by location
        </Button>
        <Button
          btnType="Success"
          onClick={() => this.changeFilterHandler("titles")}
        >
          by book title
        </Button>
        <Button
          btnType="Success"
          onClick={() => this.changeFilterHandler("modules")}
        >
          by module code
        </Button>
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
