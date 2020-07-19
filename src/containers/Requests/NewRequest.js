import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import axios from "axios";
import { faTimes, faCheck, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        validation: false,
        valid: false,
        touched: false,
        validated: false,
        validationError: null,
        moduleName: "",
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

  componentDidUpdate() {
    if (!this.state.dataForm.module.validated) {
      this.verifyModuleCode();
    }
  }

  validateFormExcludingModule = (prevState) => {
    for (let element in prevState.dataForm) {
      if (element === "module") {
        continue;
      } else if (!prevState.dataForm[element].valid) {
        return false;
      }
    }
    return true;
  };

  verifyModuleCode = () => {
    axios
      .get("https://api.nusmods.com/v2/2018-2019/moduleList.json")
      .then((res) => {
        let moduleCodeValid = false;
        for (let i = 0; i < res.data.length; i++) {
          if (
            res.data[i].moduleCode.toLowerCase().split(" ").join("") ===
            this.state.dataForm.module.value.toLowerCase().split(" ").join("")
          ) {
            moduleCodeValid = true;
            this.setState((prevState) => ({
              ...prevState,
              formIsValid: this.validateFormExcludingModule(prevState),
              dataForm: {
                ...prevState.dataForm,
                module: {
                  ...prevState.dataForm.module,
                  valid: true,
                  validated: true,
                  moduleName: res.data[i].title,
                },
              },
            }));
            break;
          }
        }
        if (!moduleCodeValid) {
          this.setState((prevState) => ({
            ...prevState,
            formIsValid: false,
            dataForm: {
              ...prevState.dataForm,
              module: {
                ...prevState.dataForm.module,
                valid: false,
                validated: true,
                moduleName: "",
              },
            },
          }));
        }
      })
      .catch((error) => {
        this.setState((prevState) => ({
          ...prevState,
          formIsValid: false,
          dataForm: {
            ...prevState.dataForm,
            module: {
              ...prevState.dataForm.module,
              valid: false,
              validated: true,
              validationError: error,
              moduleName: "",
            },
          },
        }));
      });
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

    if (inputIdentifier !== "module") {
      updatedFormElement.valid = this.checkValidity(
        updatedFormElement.value,
        updatedFormElement.validation
      );
    } else {
      updatedFormElement.validated = false;
    }

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
      let validationCheck = null;
      let validationMessage = null;
      if (formElement.id === "module") {
        if (formElement.config.validated && formElement.config.valid) {
          validationMessage = (
            <p style={{ color: "grey", fontWeight: "bold" }}>
              {formElement.config.moduleName}
            </p>
          );
        } else if (formElement.config.validated && !formElement.config.valid) {
          validationMessage = (
            <p style={{ color: "red", fontWeight: "bold" }}>
              Module code does not exist!
            </p>
          );
        } else if (formElement.config.validationError) {
          validationMessage = (
            <p style={{ color: "red", fontWeight: "bold" }}>
              {formElement.config.validationError}
            </p>
          );
        }
        validationCheck = <React.Fragment>{validationMessage}</React.Fragment>;
      }
      return (
        <React.Fragment key={formElement.id}>
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
          {validationCheck}
        </React.Fragment>
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                btnType="Important"
                onClick={this.toggleModalHandler}
                disabled={!this.state.formIsValid}
              >
                {
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ paddingRight: "5px" }}
                  />
                }
                SUBMIT
              </Button>
              <Button
                onClick={() => {
                  this.props.history.goBack();
                }}
              >
                {
                  <FontAwesomeIcon
                    icon={faTimes}
                    style={{ paddingRight: "5px" }}
                  />
                }
                Cancel
              </Button>
            </div>
          </React.Fragment>
        )}
      </div>
    );

    if (this.props.requestUploaded) {
      createNewPost = null;
    }

    let postSummary = (
      <Modal show={this.state.showModal}>
        <div className={classes.postSummary}>
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
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button onClick={this.onSubmitHandler} btnType="Important">
            {<FontAwesomeIcon icon={faCheck} style={{ paddingRight: "5px" }} />}
            Submit
          </Button>
          <span style={{ paddingRight: "3px" }} />
          <Button onClick={this.toggleModalHandler}>
            {<FontAwesomeIcon icon={faTimes} style={{ paddingRight: "5px" }} />}
            Go back
          </Button>
        </div>
      </Modal>
    );

    let successPost = (
      <Modal show={this.props.requestUploaded}>
        <p style={{ color: "green" }}>Request successfully posted!</p>
        <Button
          onClick={() => {
            this.props.dispatchClearRequestData();
            this.props.history.push("/");
          }}
          btnType="Important"
        >
          {<FontAwesomeIcon icon={faHome} style={{ paddingRight: "5px" }} />}
          Home
        </Button>
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
