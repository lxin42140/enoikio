import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import classes from "./NewPost.css";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";
import Modal from "../../components/UI/Modal/Modal";

class EditPost extends Component {
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
        valid: true,
        touched: true,
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
        valid: true,
        touched: true,
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
        valid: true,
        touched: true,
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
        validation: true,
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
        valid: true,
        touched: true,
      },
      description: {
        elementType: "textarea",
        elementConfig: {
          type: "text",
          placeholder: "Please enter any other information",
        },
        value: "",
        validation: true,
        valid: true,
        touched: true,
      },
    },
    imageAsFile: [],
    loading: true,
    uploadImageError: false,
    formIsValid: true,
    showModal: false,
    initialEdit: true,
    initialImageChange: true,
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

  inputChangedHandler = (event, formElement) => {
    const updatedDataForm = {
      ...this.state.dataForm,
    };

    const updatedFormElement = {
      ...updatedDataForm[formElement.id],
    };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedDataForm[formElement.id] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifiers in updatedDataForm) {
      if (!updatedDataForm[inputIdentifiers].valid) {
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
      ...this.props.editListing,
      postDetails: formData,
      numberOfImages: this.state.imageAsFile.filter((image) => image !== null)
        .length,
    };
    delete postDetails.userId;
    delete postDetails.comments;
    delete postDetails.key;
    delete postDetails.imageURL;

    this.props.dispatchEditPost(postDetails, this.props.editListing.key);
    this.props.dispatchSubmitPhoto(
      this.state.imageAsFile,
      this.props.editListing.unique
    );
    this.setState({ showModal: false });
  };

  handleImageAsFile = (event) => {
    let images = [...event.target.files];

    let imageArray = [...this.state.imageAsFile];

    if (
      imageArray.filter((image) => image !== null).length + images.length >
      3
    ) {
      this.setState({ uploadImageError: true });
    } else {
      for (let key in imageArray) {
        if (images.length === 0) {
          break;
        }
        if (imageArray[key] === null) {
          const image = images.shift();
          imageArray[key] = image;
        }
      }

      for (let uploadedImage in images) {
        imageArray.push(images[uploadedImage]);
      }

      let formIsValid = true;
      for (let element in this.state.dataForm) {
        if (!this.state.dataForm[element].valid) {
          formIsValid = false;
          break;
        }
      }
      //   console.log(imageArray);
      const numImages = imageArray.length;
      this.setState({
        imageAsFile: imageArray,
        numberOfImages: numImages,
        formIsValid: formIsValid,
        uploadImageError: false,
        initialImageChange: false,
      });
    }
  };

  removeImageHandler = (imageName) => {
    const imageArray = [...this.state.imageAsFile];

    for (let image in imageArray) {
      if (imageArray[image] === imageName) {
        imageArray[image] = null;
        const validForm =
          imageArray.filter((image) => image != null).length !== 0;

        this.setState({
          imageAsFile: imageArray,
          initialImageChange: false,
          formIsValid: validForm,
        });
        break;
      }
    }
    // console.log(imageArray);
  };

  toggleModalHandler = () => {
    this.setState((prevState) => ({ showModal: !prevState.showModal }));
  };

  updateState = () => {
    const dataForm = { ...this.state.dataForm };
    const form = [
      "module",
      "textbook",
      "price",
      "deliveryMethod",
      "location",
      "description",
    ];
    for (let key in form) {
      const data = form[key];
      dataForm[data].value = this.props.editListing.postDetails[data];
    }
    const imageName = [];
    for (let key in this.props.editListing.imageURL) {
      this.props.editListing.imageURL[key] === null
        ? imageName.push(null)
        : imageName.push(this.props.editListing.imageURL[key].name);
    }
    this.setState({
      dataForm: dataForm,
      imageAsFile: imageName,
      initialEdit: false,
    });
  };

  render() {
    if (this.props.editListingLoading) {
      return <Spinner />;
    } else if (this.state.initialEdit) {
      //WILL GIVE WARNING IN CONSOLE!
      this.updateState();
    }

    // console.log(this.state.imageAsFile);

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
          change={(event) => this.inputChangedHandler(event, formElement)}
        />
      );
    });

    let count = 0;
    const displayImageList = this.state.imageAsFile.map((image) => {
      if (image === null) {
        return null;
      } else {
        count++;
        return (
          <div
            key={image}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ paddingRight: "10px", textAlign: "center" }}>
              {typeof image === "string" ? image : image.name}
            </p>
            <Button onClick={() => this.removeImageHandler(image)}>
              Remove
            </Button>
          </div>
        );
      }
    });

    let createNewPost = (
      <div className={classes.NewPost}>
        <h4>
          {this.props.uploadingPost ? "Submitting..." : "Edit Rental Details"}
        </h4>
        {this.props.uploadingPost ? (
          <Spinner />
        ) : (
          <React.Fragment>
            {form}
            <br />
            <div className={classes.ImageText}>{displayImageList}</div>
            <p style={{ color: "red" }}>
              {this.state.uploadImageError
                ? "Please select a maximum of 3 images"
                : null}
            </p>
            <div style={{ marginBottom: "10px" }}>
              <input
                type="file"
                accept=".png,.jpeg, .jpg"
                multiple
                style={{ width: "95px" }}
                onChange={this.handleImageAsFile}
                disabled={count >= 3}
              />
            </div>
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

    if (this.props.postUploaded) {
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
      <Modal show={this.props.postUploaded}>
        {"Successfully edited!"}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link to="/">
            <Button onClick={() => this.props.dispatchClearNewPostData()}>
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
	editListing: state.listing.expandedListing,
    editListingLoading: state.listing.expandedListingLoading,
    uploadingPost: state.newPost.uploadingPost,
    postUploaded: state.newPost.postUploaded,
    uploadingImage: state.newPost.uploadingImage,
    imageUploaded: state.newPost.imageUploaded,
    displayName: state.auth.displayName,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchSubmitPhoto: (imageAsFile, identifier) =>
      dispatch(actions.submitEditedPhoto(imageAsFile, identifier)),
    dispatchClearNewPostData: () => dispatch(actions.clearPostData()),
    dispatchEditPost: (editedPost, node) =>
      dispatch(actions.editPost(editedPost, node)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPost);
