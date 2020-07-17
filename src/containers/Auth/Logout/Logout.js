import React, { Component } from "react";
import * as actions from "../../../store/actions/index";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeartBroken,
  faTimes,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

import Button from "../../../components/UI/Button/Button";
class Logout extends Component {
  onLogoutHandler = () => {
    this.props.onSignOut();
    this.props.history.push("/");
  };

  onCancelHandler = () => {
    this.props.history.goBack("/");
  };

  render() {
    return (
      <React.Fragment>
        <h3>We are sorry to see you go! Are you sure you want to log out?</h3>
        <FontAwesomeIcon
          icon={faHeartBroken}
          style={{ fontSize: "3rem", color: "rgb(247, 27, 27)" }}
        />
        <br />
        <br />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button btnType="Important" onClick={this.onLogoutHandler}>
            {
              <FontAwesomeIcon
                icon={faSignOutAlt}
                style={{ paddingRight: "5px" }}
              />
            }
            Confirm log out
          </Button>
          <Button onClick={this.onCancelHandler}>
            {<FontAwesomeIcon icon={faTimes} style={{ paddingRight: "5px" }} />}
            Go back
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSignOut: () => dispatch(actions.signOut()),
  };
};

export default connect(null, mapDispatchToProps)(Logout);
