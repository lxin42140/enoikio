import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import classes from "./Auth.css";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";
import firebaseAxios from "../../firebaseAxios";
import auth from "../../firebase/firebase"

class Auth extends Component {
  state = {
    controls: {
      displayName: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Display name (permanent)",
        },
        validation: false,
        valid: false,
        validated: false,
        validationError: null,
        value: "",
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your email",
        },
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
        value: "",
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Your password",
        },
        validation: {
          required: true,
          minLength: 6,
        },
        valid: false,
        touched: false,
        value: "",
      },
    },
    isSignUp: true,
    valid: false,
  };

  checkValidation(value, rules) {
    let isValid = true;
    if (rules) {
      if (rules.required) {
        isValid = value.trim() !== "";
      }
      if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid;
      }
      if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test(value) && isValid;
      }
    }
    return isValid;
  }

  validateDisplayName = (event) => {
    const displayName = this.state.controls.displayName.value;
    if (displayName !== "") {
      const query = 'orderBy="displayName"&equalTo="' + displayName + '"';
      firebaseAxios
        .get("/users.json?".concat(query))
        .then((response) => {
          this.setState((prevState) => ({
            ...prevState,
            controls: {
              ...prevState.controls,
              displayName: {
                ...prevState.controls.displayName,
                valid: Object.keys(response.data).length === 0,
                validated: true,
              },
            },
            valid:
              prevState.controls.email.valid &&
              prevState.controls.password.valid &&
              Object.keys(response.data).length === 0,
          }));
        })
        .catch((error) => {
          this.setState((prevState) => ({
            ...prevState,
            controls: {
              ...prevState.controls,
              displayName: {
                ...prevState.controls.displayName,
                validationError: error,
              },
            },
            valid: false,
          }));
        });
    }
  };

  inputChangeHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidation(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true,
      },
    };
    if (controlName === "displayName") {
      updatedControls.displayName.validated = false;
      updatedControls.displayName.valid = false;
    }
    let valid = updatedControls.email.valid && updatedControls.password.valid;
    if (this.state.isSignUp) {
      valid = valid && updatedControls.displayName.valid;
    }
    this.setState({
      controls: updatedControls,
      valid: valid,
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    if (this.state.isSignUp) {
      this.props.dispatchSignUp(
        this.state.controls.email.value,
        this.state.controls.password.value,
        this.state.controls.displayName.value
      );
    } else {
      this.props.dispatchSignIn(
        this.state.controls.email.value,
        this.state.controls.password.value
      );
    }
  };

  switchAuthModeHandler = () => {
    this.setState((prevState) => {
      return {
        isSignUp: !prevState.isSignUp,
      };
    });
  };

  render() {
    const formElementArray = [];
    for (let key in this.state.controls) {
      if (key === "displayName" && !this.state.isSignUp) {
        continue;
      }
      formElementArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    const form = formElementArray.map((x) => {
      let validationCheck = null;
      let validationMessage = null;
      if (x.id === "displayName") {
        if (x.config.validated && x.config.valid) {
          validationMessage = (
            <p style={{ color: "green", fontWeight: "bold" }}>Valid!</p>
          );
        } else if (x.config.validated && !x.config.valid) {
          validationMessage = (
            <p style={{ color: "red", fontWeight: "bold" }}>
              Name already exists!
            </p>
          );
        }
        validationCheck = (
          <React.Fragment>
            {validationMessage}
            <Button
              onClick={this.validateDisplayName}
              disabled={x.config.value === ""}
            >
              validate
            </Button>
          </React.Fragment>
        );
      }
      return (
        <React.Fragment key={x.id}>
          <Input
            elementType={x.config.elementType}
            elementConfig={x.config.elementConfig}
            value={x.config.value}
            valid={x.config.valid}
            shouldValidate={x.config.validation}
            touched={x.config.touched}
            change={(event) => this.inputChangeHandler(event, x.id)}
          />
          {validationCheck}
        </React.Fragment>
      );
    });

    const content = this.props.loading ? (
      <Spinner />
    ) : (
      <div>
        {form}
        <Button
          btnType="Important"
          disabled={!this.state.valid}
          onClick={this.submitHandler}
        >
          {this.state.isSignUp ? "Sign up now" : "Sign in now"}
        </Button>
      </div>
    );

    const errorMessage = this.props.error ? (
      <p>{this.props.error.message}</p>
    ) : this.state.controls.displayName.validationError ? (
      <p>{this.state.controls.displayName.validationError}</p>
    ) : null;

    let redirect = null;
    if (this.props.isAuthenticated) {
      redirect = <Redirect to={this.props.authRedirect} />;
    }

    return (
      <div className={classes.Auth}>
        {redirect}
        {errorMessage}
        {content}
        <br />
        <Button onClick={this.switchAuthModeHandler}>
          {this.state.isSignUp ? "Sign in ?" : "Sign up ?"}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    authRedirect: state.auth.authRedirectPath,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchSignUp: (email, password, displayName) =>
      dispatch(actions.signUp(email, password, displayName)),
    dispatchSignIn: (email, password) =>
      dispatch(actions.signIn(email, password)),
    dispatchSetRedirectPath: () => dispatch(actions.setAuthRedirectPath("/")),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
