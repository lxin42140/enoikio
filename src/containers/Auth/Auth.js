import React, { Component } from "react";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import classes from "./Auth.css";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";
import { Redirect } from "react-router-dom";

class Auth extends Component {
  state = {
    controls: {
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
  };

  checkValidation(value, rules) {
    let isValid = true;
    if (rules) {
      if (rules.required) {
        isValid = value.trim() !== " ";
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
    this.setState({
      controls: updatedControls,
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignUp
    );
  };

  switchAuthModeHandler = () => {
    this.setState((prevState) => {
      return {
        isSignUp: !prevState.isSignUp,
      };
    });
  };

  // componentDidMount() {
  //   if(!this.props.building && this.props.authRedirectPath!=='/') {
  //     this.props.onSetRedirectPath();
  //   }
  // }

  render() {
    const formElementArray = [];
    for (let key in this.state.controls) {
      formElementArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    const form = formElementArray.map((x) => {
      return (
        <Input
          key={x.id}
          elementType={x.config.elementType}
          elementConfig={x.config.elementConfig}
          value={x.config.value}
          valid={x.config.valid}
          shouldValidate={x.config.validation}
          touched={x.config.touched}
          change={(event) => this.inputChangeHandler(event, x.id)}
        />
      );
    });

    const content = this.props.loading ? (
      <Spinner />
    ) : (
      <form onSubmit={this.submitHandler}>
        {form}
        <Button btnType="Success">{this.state.isSignUp ? "Sign up" : "Sign in" }</Button>
      </form>
    );

    const errorMessage = this.props.error ? (
      <p>{this.props.error.message}</p>
    ) : null;

    let redirect = null;
    // if (this.props.isAuthenticated) {
    //   redirect = <Redirect to={this.props.authRedirect}/>;
    // }

    if (this.props.isAuthenticated && this.props.building) {
      redirect =  <Redirect to="/checkout"/>;
    } else if (this.props.isAuthenticated) {
      redirect =  <Redirect to="/"/>;
    }

    return (
      <div className={classes.Auth}>
        {redirect}
        {errorMessage}
        {content}
        <Button btnType="Danger" clicked={this.switchAuthModeHandler}>
          Switch to {this.state.isSignUp ? "Sign in" : "Sign up"}
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
    building: state.burgerBuilder.building,
    //authRedirect: state.auth.authRedirectPath
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignUp) =>
      dispatch(actions.auth(email, password, isSignUp)),
    //onSetRedirectPath: () => dispatch(actions.setAuthRedirectPath("/"))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
