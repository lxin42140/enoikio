import React, {Component} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import * as classes from "./Profile.css";
import * as actions from "../../../store/actions/index"
import profileImage from '../../../assets/Images/chats/profile';

class Profile extends Component {

    onGoToPastPostHandler = () => {
        this.props.setFilterTerm("displayName")
        this.props.history.push("/post-history")
    }

    render() {
        return(
            <div>

            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      setFilterTerm: (filterType) =>
        dispatch(actions.setFilterListings(filterType, "")),
    };
  };

export default connect(null, mapDispatchToProps)(Profile);