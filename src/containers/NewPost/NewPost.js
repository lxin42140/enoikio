import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";

import classes from "./NewPost.css";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import firebaseAxios from "../../firebaseAxios";
import Modal from "../../components/UI/Modal/Modal";

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
      description: {
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
    imageAsFile: [],
    uploadImageError: false,
    formIsValid: false,
    showModal: false,
    editing: false,
    initialEdit: true,
  };

  componentDidMount() {
    if (this.props.editListingLoading) {
      this.setState({ editing: true });
    } else {
      this.setState({ initialEdit: false });
      this.props.dispatchRemoveExpandListing();
    }
  }

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

  inputChangedHandler = (event, formElement) => {
    let updatedDataForm = {};
    if (this.state.editing && this.state.initialEdit) {
      const form = [
        "module",
        "textbook",
        "price",
        "deliveryMethod",
        "location",
        "description",
      ];
      for (let data in form) {
        const object = this.state.dataForm[form[data]];
        object.value = this.props.editListing.postDetails[form[data]];
        object.valid = true;
        updatedDataForm[form[data]] = object;
      }
    } else {
      updatedDataForm = {
        ...this.state.dataForm,
      };
    }

    const updatedFormElement = {
      ...updatedDataForm[formElement.id],
    };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedFormElement.touched = true;
    updatedDataForm[formElement.id] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifiers in updatedDataForm) {
      if (!updatedDataForm[inputIdentifiers].valid) {
        formIsValid = false;
        break;
      } else if (!this.state.editing && this.state.imageAsFile.length === 0) {
        formIsValid = false;
        break;
      }
    }
    this.setState({
      dataForm: updatedDataForm,
      formIsValid: formIsValid,
      initialEdit: false,
    });
  };

  onSubmitHandler = (event) => {
    event.preventDefault();
    const date = moment().format("DD/MM/YYYY");
    const time = moment().format("HH:mm:ss");
    const unique = this.props.userId + Date.now();
    const formData = {};
    for (let key in this.state.dataForm) {
      switch (key) {
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
      displayName: this.props.displayName,
      unique: unique,
      date: date,
      time: time,
      numberOfImages: this.state.imageAsFile.length,
      status: "available",
      likedUsers: ["none"],
    };
    this.state.editing
      ? this.props.dispatchEditPost(formData, this.props.editListing.key)
      : this.props.dispatchSubmitPost(postDetails, this.props.token);
    this.props.dispatchSubmitPhoto(this.state.imageAsFile, unique);
    this.setState({ showModal: false });
  };

  handleImageAsFile = (event) => {
    let images = event.target.files;

    let imageArray = [...this.state.imageAsFile];

    //check whether images uploaded is same as any file in the state already
    for (let uploadedImage in images) {
      let diffImage = true;
      for (let currImage in imageArray) {
        if (imageArray[currImage].name === images[uploadedImage].name) {
          diffImage = false;
          break;
        }
      }
      if (diffImage) {
        imageArray.push(images[uploadedImage]);
      }
    }
    imageArray = imageArray.slice(0, imageArray.length - 2);

    if (imageArray.length > 3) {
      this.setState({ uploadImageError: true });
    } else {
      let formIsValid = true;
      for (let element in this.state.dataForm) {
        if (!this.state.dataForm[element].valid) {
          formIsValid = false;
          break;
        }
      }
      const numImages = imageArray.length;
      this.setState({
        imageAsFile: imageArray,
        numberOfImages: numImages,
        formIsValid: formIsValid,
        uploadImageError: false,
      });
    }
  };

  removeImageHandler = (imageName) => {
    let imageArray;
    // if (this.props.editListing.imageURL.length === this.state.imageAsFile.length) {
    //   imageArray = this.props.editListing.imageURL;
    // } else {
    imageArray = [...this.state.imageAsFile];
    // }
    for (let image in imageArray) {
      if (imageArray[image].name === imageName) {
        imageArray.splice(image, 1);
        break;
      }
    }
    this.setState({ imageAsFile: imageArray });
  };

  createNewFormHandler = () => {
    this.props.dispatchClearNewPostData();
    const refreshedForm = {
      ...this.state.dataForm,
    };
    for (let element in refreshedForm) {
      refreshedForm[element].value = "";
      refreshedForm[element].touched = false;
      if (refreshedForm[element].validation) {
        refreshedForm[element].valid = false;
      }
    }
    this.setState({
      dataForm: refreshedForm,
      imageAsFile: "",
      formIsValid: false,
      showModal: false,
    });
  };

  toggleModalHandler = () => {
    this.setState((prevState) => ({ showModal: !prevState.showModal }));
  };

  render() {
    if (this.props.editListingLoading) {
      return <Spinner />;
    }

    const formElementsArray = [];
    if (this.state.editing && this.state.initialEdit) {
      const form = [
        "module",
        "textbook",
        "price",
        "deliveryMethod",
        "location",
        "description",
      ];
      for (let key in form) {
        formElementsArray.push({
          id: form[key],
          config: {
            ...this.state.dataForm[form[key]],
            value: this.props.editListing.postDetails[form[key]],
          },
        });
      }
    } else {
      for (let key in this.state.dataForm) {
        formElementsArray.push({
          id: key,
          config: this.state.dataForm[key],
        });
      }
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
          change={(event) => this.inputChangedHandler(event, formElement)}
        />
      );
    });

    let imageList;
    if (this.state.editing && this.state.initialEdit) {
      imageList = this.props.editListing.imageURL;
    } else if (!this.state.editing || !this.state.initialEdit) {
      imageList = this.state.imageAsFile;
    }

    let displayImageList;
    if (!this.state.editing) {
      displayImageList = imageList.map((image) => {
        return (
          <div key={image.name}>
            <p>{image.name}</p>
            <Button onClick={() => this.removeImageHandler(image.name)}>
              Remove
            </Button>
          </div>
        );
      });
    }

    let createNewPost = (
      <div className={classes.NewPost}>
        <h4>
          {this.props.uploadingImage || this.props.uploadingPost
            ? "Submitting..."
            : this.state.editing
            ? "Edit Rental Details"
            : "Enter Rental Details"}
        </h4>
        {this.props.uploadingImage || this.props.uploadingPost ? (
          <Spinner />
        ) : (
          <React.Fragment>
            {form}
            <br />
            {!this.state.editing ? (
              <React.Fragment>
                <div style={{ marginBottom: "10px" }}>
                  <input
                    type="file"
                    accept=".png,.jpeg, .jpg"
                    multiple
                    style={{ width: "95px" }}
                    onChange={this.handleImageAsFile}
                    disabled={this.state.imageAsFile.length >= 3}
                  />
                </div>
                <div>{displayImageList}</div>
                <p style={{ color: "red" }}>
                  {this.state.uploadImageError
                    ? "Please select a maximum of 3 images"
                    : null}
                </p>
              </React.Fragment>
            ) : null}
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

    if (this.props.postUploaded && this.props.imageUploaded) {
      createNewPost = null;
    }

    let postSummary = (
      <Modal show={this.state.showModal}>
        <h1>Confirm listing details:</h1>
        <p>Module code: {this.state.dataForm.module.value}</p>
        <p>Textbook:《{this.state.dataForm.textbook.value}》</p>
        <p>Price: {this.state.dataForm.price.value}</p>
        <p>Delivery method: {this.state.dataForm.deliveryMethod.value}</p>
        <p>Location: {this.state.dataForm.location.value}</p>
        <p>
          Description: <br />
          {this.state.dataForm.description.value}
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={this.toggleModalHandler}>Go back</Button>
          <Button onClick={this.onSubmitHandler}>Submit</Button>
        </div>
      </Modal>
    );

    let successPost = (
      <Modal show={this.props.postUploaded && this.props.imageUploaded}>
        {this.state.editing ? "Successfully edited!" : "Successfully posted!"}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link to="/">
            <Button onClick={() => this.props.dispatchClearNewPostData()}>
              Home
            </Button>
          </Link>
          <Button onClick={this.createNewFormHandler}>New Post</Button>
        </div>
      </Modal>
    );

    return (
      <React.Fragment>
        {createNewPost}
        {postSummary}
        {successPost}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    uploadingPost: state.newPost.uploadingPost,
    postUploaded: state.newPost.postUploaded,
    uploadingImage: state.newPost.uploadingImage,
    imageUploaded: state.newPost.imageUploaded,
    userId: state.auth.userId,
    displayName: state.auth.displayName,
    token: state.auth.token,
    editListing: state.listing.expandedListing,
    editListingLoading: state.listing.expandedListingLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchSubmitPost: (newPost, token) =>
      dispatch(actions.submitNewPost(newPost, token)),
    dispatchSubmitPhoto: (imageAsFile, identifier) =>
      dispatch(actions.submitNewPhoto(imageAsFile, identifier)),
    dispatchClearNewPostData: () => dispatch(actions.clearPostData()),
    dispatchRemoveExpandListing: () => dispatch(actions.clearExpandedListing()),
    dispatchEditPost: (editedPost, node) =>
      dispatch(actions.editPost(editedPost, node)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(NewPost, firebaseAxios));
