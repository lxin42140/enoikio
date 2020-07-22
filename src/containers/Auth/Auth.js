import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import classes from "./Auth.css";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";
import { database } from "../../firebase/firebase";

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
    valid: false,
    isSignUp: false,
    isSignIn: true,
    isResetPassword: false,
  };

  componentDidUpdate() {
    if (this.props.sentEmailVerification && this.state.isSignUp) {
      this.setState({
        isSignUp: false,
        isSignIn: true,
        isResetPassword: false,
      });
    } else if (
      this.state.isSignUp &&
      !this.state.controls.displayName.validated
    ) {
      this.validateDisplayName();
    }
  }

  toggleSignUpHandler = () => {
    this.setState({
      isSignUp: true,
      isSignIn: false,
      isResetPassword: false,
    });
  };

  toggleSignInHandler = () => {
    this.setState({
      isSignUp: false,
      isSignIn: true,
      isResetPassword: false,
    });
  };

  toggleResetHandler = () => {
    this.setState({
      isSignUp: false,
      isSignIn: false,
      isResetPassword: true,
    });
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
    // display names have no spaces and are all in lower case
    const displayName = this.state.controls.displayName.value
      .toLowerCase()
      .split(" ")
      .join("");
    if (displayName !== "") {
      database
        .ref()
        .child("displayNames")
        .once("value", (snapShot) => {
          if (snapShot.exists()) {
            snapShot.forEach((data) => {
              this.setState((prevState) => ({
                ...prevState,
                controls: {
                  ...prevState.controls,
                  displayName: {
                    ...prevState.controls.displayName,
                    valid: data.val().displayNames.indexOf(displayName) < 0,
                    validated: true,
                  },
                },
                valid:
                  prevState.controls.email.valid &&
                  prevState.controls.password.valid &&
                  data.val().displayNames.indexOf(displayName) < 0,
              }));
            });
          } else {
            this.setState((prevState) => ({
              ...prevState,
              controls: {
                ...prevState.controls,
                displayName: {
                  ...prevState.controls.displayName,
                  valid: true,
                  validated: true,
                },
              },
              valid:
                prevState.controls.email.valid &&
                prevState.controls.password.valid &&
                true,
            }));
          }
        })
        .catch((error) => {
          this.setState((prevState) => ({
            ...prevState,
            controls: {
              ...prevState.controls,
              displayName: {
                ...prevState.controls.displayName,
                validationError: error.message,
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

  resetEmailHandler = (event) => {
    event.preventDefault();
    this.props.dispatchResetPassword(this.state.controls.email.value);
    this.toggleSignInHandler();
  };

  render() {
    const formElementArray = [];

    for (let key in this.state.controls) {
      if (
        (key === "displayName" && this.state.isSignIn) || //sign in
        ((key === "displayName" || key === "password") && //password reset
          this.state.isResetPassword)
      ) {
        continue;
      }

      let config = this.state.controls[key];

      switch (key) {
        case "email":
          config.elementConfig.placeholder = this.state.isSignUp
            ? "Enter a valid email address"
            : "Enter your email";
          break;
        case "password":
          config.elementConfig.placeholder = this.state.isSignUp
            ? "Enter a password of at least 6 characters"
            : "Enter your password";
          break;
        default:
          break;
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
        } else if (x.config.validationError) {
          validationMessage = (
            <p style={{ color: "red", fontWeight: "bold" }}>
              {x.config.validationError}
            </p>
          );
        }
        validationCheck = <React.Fragment>{validationMessage}</React.Fragment>;
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

    const formContent = this.props.loading ? (
      <Spinner />
    ) : (
      <div className={classes.formStyling}>
        {form}
        {this.state.isResetPassword ? (
          <Button
            btnType="Important"
            disabled={!this.state.controls.email.valid}
            onClick={this.resetEmailHandler}
          >
            Send reset email
          </Button>
        ) : (
          <Button
            btnType="Important"
            disabled={!this.state.valid}
            onClick={this.submitHandler}
          >
            {this.state.isSignUp ? "Sign up now" : "Sign in"}
          </Button>
        )}
      </div>
    );

    let message = null;
    if (this.props.error) {
      message = (
        <p style={{ color: "red", fontSize: "small" }}>{this.props.error}</p>
      );
    } else if (this.state.controls.displayName.validationError) {
      message = (
        <p style={{ color: "red", fontSize: "small" }}>
          {this.state.controls.displayName.validationError}
        </p>
      );
    } else if (this.props.sentEmailVerification) {
      message = (
        <p style={{ color: "green" }}>
          A verification email has been sent. Please verify your email and sign
          in again.
        </p>
      );
    } else if (this.props.passwordReset) {
      message = <p style={{ color: "green" }}>A reset email has been sent</p>;
    }

    let redirect = null;
    if (this.props.isAuthenticated) {
      redirect = <Redirect to={this.props.authRedirect} />;
    }

    let buttons = (
      <div className={classes.Selections}>
        <a onClick={this.toggleSignUpHandler}>
          No account? <b>Create one for free!</b>
        </a>
        <a onClick={this.toggleResetHandler}>Reset password</a>
      </div>
    );

    if (this.state.isSignUp) {
      buttons = (
        <div className={classes.Selections}>
          <a onClick={this.toggleSignInHandler}>
            Have an account? <b>Sign in!</b>
          </a>
          <a onClick={this.toggleResetHandler}>Reset password</a>
        </div>
      );
    }

    if (this.state.isResetPassword) {
      buttons = (
        <div className={classes.Selections}>
          <a onClick={this.toggleSignInHandler}>
            Have an account? <b>Sign in!</b>
          </a>
          <a onClick={this.toggleSignUpHandler}>
            No account? <b>Create one for free!</b>
          </a>
        </div>
      );
    }

    return (
      <div className={classes.Auth}>
        {redirect}
        {message}
        {formContent}
        {buttons}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.user !== null,
    authRedirect: state.auth.authRedirectPath,
    sentEmailVerification: state.auth.sentEmailVerification,
    passwordReset: state.auth.passwordReset,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchSignUp: (email, password, displayName) =>
      dispatch(actions.signUp(email, password, displayName)),
    dispatchSignIn: (email, password) =>
      dispatch(actions.signIn(email, password)),
    dispatchResetPassword: (email) => dispatch(actions.passwordReset(email)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
