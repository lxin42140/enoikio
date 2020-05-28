import React, { Component } from "react";
import { connect } from "react-redux";

import classes from "./NewPost.css";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import firebaseAxios from "../../firebaseAxios";
import Notification from '../../components/UI/Modal/Notification/Notification';

class NewPost extends Component {
  state = {
    dataForm: {
      module: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Module Code",
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
          placeholder: "Title of Textbook",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      price: {
        elementType: "input",
        elementConfig: {
          type: "number",
          placeholder: "Rent Price (per month)",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "meet-up", displayValue: "Meet up" },
            { value: "mail", displayValue: "Mail" },
          ],
        },
        value: "meet-up",
        validation: false,
        valid: true,
      },
      location: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Pick-up location",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      Description: {
        elementType: "textarea",
        elementConfig: {
          type: "text",
          placeholder: "Please enter any other information",
        },
        value: "",
        validation: false,
        valid: true,
        touched: false,
      },
    },
    imageAsFile: "",
    formIsValid: false,
    confirmPost: null,
    submitted: false,
    closeModal: false
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
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
      if (
        !updatedDataForm[inputIdentifiers].valid ||
        this.state.imageAsFile === ""
      ) {
        formIsValid = false;
        break;
      }
    }
    this.setState({ dataForm: updatedDataForm, formIsValid: formIsValid });
  };

  onSubmitHandler = (event) => {
    event.preventDefault();
    let today = new Date();
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    let time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const unique = this.props.userId + date + time;
    const formData = {};
    for (let key in this.state.dataForm) {
      switch (formData[key]) {
        case "module":
        case "textbook":
        case "location":
          formData[key] = this.state.dataForm[key].value.toLowerCase();
          break;
        default:
          formData[key] = this.state.dataForm[key].value;
      }
    }
    const postDetails = {
      postDetails: formData,
      userId: this.props.userId,
      unique: unique,
      dateAndTime: date + "_" + time,
    };
    this.props.onSubmitPost(postDetails, this.props.token);
    this.props.onSubmitPhoto(this.state.imageAsFile, unique);
    //TODO: include a submitted state used to ask the user whether to make another post or proceed to homepage

    if (!this.props.error) {
      this.setState({ confirmPost: true });
    } else {
      this.setState({ confirmPost: false });
    }
  };

  handleImageAsFile = (event) => {
    const image = event.target.files[0];
    let formIsValid = true;
    for (let element in this.state.dataForm) {
      if (!this.state.dataForm[element].valid) {
        formIsValid = false;
        break;
      }
    }
    this.setState({ imageAsFile: image, formIsValid: formIsValid });
  };

  modalClosed = () => {
    this.setState({ closeModal: true, submitted: false });
  }

  confirmFormHandler = () => {
    this.setState({ submitted: true, closeModal: false });
  }

  newFormHandler = () => {
    const refreshedForm = {
      ...this.state.dataForm,
    };
    for (let element in refreshedForm) {
      refreshedForm[element].value = "";
    }
    this.setState({
      formIsValid: false,
      dataForm: refreshedForm,
      submitted: false,
      closeModal: true
    });
  }

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

    const postError = (
      <React.Fragment>
        <p>There is an error, please try again.</p>
        <Button btnType="Important" onClick={this.modalClosed}>Go Back</Button>
      </React.Fragment>
    );
    const postSuccess = (
      <React.Fragment>
        <p>Listing successfully posted!</p>
        <Button onClick={() => <Redirect from="/new-post" to="/" exact />}>Home page</Button>
        <Button onClick={this.newFormHandler}>Submit new listing</Button>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {!this.state.submitted ? 
        <div className={classes.NewPost}>
          <h4>{this.props.loading ? "Submitting..." : "Enter Rental Details"}</h4>
          {this.props.loading ? (
              <Spinner />
            ) : (
                <React.Fragment>
                  {form}
                  <br /> <br />
                    <input
                      type="file"
                      accept=".png,.jpeg, .jpg"
                      onChange={this.handleImageAsFile}
                    />
                    <Button 
                      btnType="Important" 
                      onClick={this.confirmFormHandler} 
                      disabled={!this.state.formIsValid}>
                        SUBMIT
                    </Button>
                </React.Fragment>
              )}
        </div> : null}
        {this.state.submitted && this.state.confirmPost === null ? 
        <div>
            <Notification
              type="ListingSummary"
              showModal={!this.state.closeModal}
              modalClosed={this.modalClosed}
              submit={this.onSubmitHandler}>
              <h1>Confirm details:</h1>
              <p>Module code: {this.state.dataForm.module.value}</p>
              <p>Textbook: {this.state.dataForm.textbook.value}</p>
              <p>Price: {this.state.dataForm.price.value}</p>
              <p>Description: {this.state.dataForm.Description.value}</p>
            </Notification>
        </div> : null}
        {this.state.confirmPost ?
          <div>
            <Notification
              type="ListingSuccess"
              newForm={this.newFormHandler}
              showModal={!this.state.modalClosed}>
              Successfully posted!
            </Notification>
          </div> : null}
        {this.state.submitted && this.state.comfirmPost === false ? 
          <div>
            <Notification
              type="ListingFail"
              showModal={!this.state.modalClosed}
              modalClosed={this.modalClosed}
              newForm={this.newFormHandler}>
              There is an error, please try again.
            </Notification>
          }
        </div> : null}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.newPost.loading,
    imageUploading: state.newPost.uploadingImageLoading,
    imageUploaded: state.newPost.imageUploaded,
    error: state.newPost.error,
    userId: state.auth.userId,
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmitPost: (newPost, token) =>
      dispatch(actions.submitNewPost(newPost, token)),
    onSubmitPhoto: (imageAsFile, identifier) =>
      dispatch(actions.submitNewPhoto(imageAsFile, identifier)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(NewPost, firebaseAxios));
