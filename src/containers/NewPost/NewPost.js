import React, { Component } from "react";
import { connect } from "react-redux";

import classes from "./NewPost.css";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import firebaseAxios from "../../firebaseAxios";

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
            { value: "meet up", displayValue: "Meet up" },
            { value: "mail", displayValue: "Mail" },
          ],
        },
        value: "meetup",
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
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Please enter any other information",
        },
        value: "",
        validation: false,
        valid: false,
        touched: false,
      },
    },
    imageAsFile: "",
    formIsValid: false,
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
      if (!updatedDataForm[inputIdentifiers].valid) {
        formIsValid = false;
        break;
      }
    }
    this.setState({ dataForm: updatedDataForm, formIsValid: formIsValid });
  };

  onSubmitHandler = (event) => {
    const formData = {};
    for (let key in this.state.dataForm) {
      formData[key] = this.state.dataForm[key].value;
    }
    const postDetails = {
      postDetails: formData,
      userId: new Date().getDate(),
    };
    this.props.onSubmitPost(postDetails);
    const refreshedForm = {
      ...this.state.dataForm,
    };
    for (let element in refreshedForm) {
      refreshedForm[element].value = "";
    }
    this.setState({
      formIsValid: false,
      dataForm: refreshedForm,
    });
  };

  handleFireBaseUpload = (event) => {
    event.preventDefault();
    this.props.onSubmitPhoto(
      this.state.imageAsFile,
      this.state.dataForm.textbook.value
    );
  };

  handleImageAsFile = (event) => {
    const image = event.target.files[0];
    this.setState({ imageAsFile: image });
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

    let uploadImageButton = this.props.imageUploaded ? (
      <strong>
        <p> Image Successfully uploaded !</p>
      </strong>
    ) : this.props.imageUploading ? (
      <span>
        <p>Uploading image...</p>
        <Spinner />
      </span>
    ) : (
      <form onSubmit={this.handleFireBaseUpload}>
        <input
          type="file"
          accept=".png,.jpeg, .jpg"
          onChange={this.handleImageAsFile}
        />
        <Button disabled={!this.state.formIsValid}>Upload!</Button>
      </form>
    );

    if (this.props.loading) {
      form = <Spinner />;
      uploadImageButton = null;
    }
    return (
      <div className={classes.NewPost}>
        <h4>{this.props.loading ? "Submitting..." : "Enter Rental Details"}</h4>
        {form}
        {uploadImageButton}
        <br /> <br />
        <Button
          btnType="Important"
          disabled={!this.state.formIsValid}
          onClick={this.onSubmitHandler}
        >
          SUBMIT
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.newPost.loading,
    imageUploading: state.newPost.uploadingImageLoading,
    imageUploaded: state.newPost.imageUploaded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmitPost: (newPost, userID) =>
      dispatch(actions.submitNewPost(newPost, userID)),
    onSubmitPhoto: (imageAsFile, identifier) =>
      dispatch(actions.submitNewPhoto(imageAsFile, identifier)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(NewPost, firebaseAxios));
