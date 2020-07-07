import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";

import classes from "../NewPost/NewPost.css";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";
import Modal from "../../components/UI/Modal/Modal";

class NewRequest extends Component {
  state = {
    dataForm: {
      module: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Module code",
        },
        value: "",
        validation: {
          required: true,
          maxLength: 8,
        },
        valid: false,
        touched: false,
      },
      textbook: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Title of textbook",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      requestType: {
        elementType: "select",
        elementConfig: {
          options: [
            {
              value: "rent",
              displayValue: "Rent",
            },
            {
              value: "buy",
              displayValue: "Buy",
            },
          ],
        },
        value: "rent",
        validation: false,
        valid: true,
      },
      priority: {
        elementType: "select",
        elementConfig: {
          options: [
            {
              value: "urgent",
              displayValue: "Urgent",
            },
            {
              value: "moderate",
              displayValue: "Moderate",
            },
            {
              value: "low",
              displayValue: "Low",
            },
          ],
        },
        value: "urgent",
        validation: false,
        valid: true,
      },
    },
    formIsValid: false,
    showModal: false,
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (rules) {
      if (rules.required) {
        isValid = value.trim() !== "" && isValid;
      }
      if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid;
      }
    }
    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedDataForm = {
      ...this.state.dataForm,
    };
    const updatedFormElement = {
      ...updatedDataForm[inputIdentifier],
    };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedFormElement.touched = true;
    updatedDataForm[inputIdentifier] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifiers in updatedDataForm) {
      if (!updatedDataForm[inputIdentifiers].valid) {
        formIsValid = false;
        break;
      }
    }
    this.setState({ dataForm: updatedDataForm, formIsValid: formIsValid });
  };

  onSubmitHandler = (event) => {
    event.preventDefault();
    const date = moment().format("DD/MM/YYYY");
    const time = moment().format("HH:mm:ss");
    const unique = this.props.displayName + Date.now();
    const formData = {};
    for (let key in this.state.dataForm) {
      switch (key) {
        case "module":
          formData[key] = this.state.dataForm[key].value.toLowerCase();
          break;
        case "textbook":
          let str = this.state.dataForm[key].value.toLowerCase();
          formData[key] = str.charAt(0).toUpperCase() + str.slice(1);
          break;
        default:
          formData[key] = this.state.dataForm[key].value;
      }
    }

    const postDetails = {
      displayName: this.props.displayName,
      unique: unique,
      date: date,
      time: time,
      requestDetails: formData,
    };
    this.props.dispatchSubmitRequest(postDetails);
    this.setState({ showModal: false });
  };

  toggleModalHandler = () => {
    this.setState((prevState) => ({ showModal: !prevState.showModal }));
  };

  render() {
    const formElementsArray = [];

    for (let key in this.state.dataForm) {
      formElementsArray.push({
        id: key,
        config: this.state.dataForm[key],
      });
    }

    let form = formElementsArray.map((formElement) => {
      return (
        <Input
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          valid={formElement.config.valid}
          shouldValidate={formElement.config.validation}
          touched={formElement.config.touched}
          change={(event) => this.inputChangedHandler(event, formElement.id)}
        />
      );
    });

    let createNewPost = (
      <div className={classes.NewPost}>
        <h4>
          {this.props.uploadingRequest
            ? "Submitting..."
            : "Enter Request Details"}
        </h4>
        {this.props.uploadingRequest ? (
          <Spinner />
        ) : (
          <React.Fragment>
            {form}
            <Button
              btnType="Important"
              onClick={this.toggleModalHandler}
              disabled={!this.state.formIsValid}
            >
              SUBMIT
            </Button>
          </React.Fragment>
        )}
      </div>
    );

    if (this.props.requestUploaded) {
      createNewPost = null;
    }

    let postSummary = (
      <Modal show={this.state.showModal}>
        <h1>Confirm request details:</h1>
        <p>
          <b>Module code: </b>
          {this.state.dataForm.module.value}
        </p>
        <p>
          <b>Textbook: </b>《{this.state.dataForm.textbook.value}》
        </p>
        <p>
          <b>Request type: </b>
          {this.state.dataForm.requestType.value}
        </p>
        <p>
          <b>Priority level: </b>
          {this.state.dataForm.priority.value}
        </p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={this.toggleModalHandler}>Go back</Button>
          <Button onClick={this.onSubmitHandler}>Submit</Button>
        </div>
      </Modal>
    );

    let successPost = (
      <Modal show={this.props.requestUploaded}>
        Request successfully posted!
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "20px",
          }}
        >
          <Link to="/" style={{ paddingRight: "10px" }}>
            <Button onClick={() => this.props.dispatchClearRequestData()}>
              Home
            </Button>
          </Link>
        </div>
      </Modal>
    );

    return (
      <div>
        {createNewPost}
        {postSummary}
        {successPost}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    uploadingRequest: state.request.uploadingRequest,
    requestUploaded: state.request.requestUploaded,
    displayName: state.auth.displayName,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchSubmitRequest: (newRequest) =>
      dispatch(actions.submitNewRequest(newRequest)),
    dispatchClearRequestData: () => dispatch(actions.clearRequestData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewRequest);
