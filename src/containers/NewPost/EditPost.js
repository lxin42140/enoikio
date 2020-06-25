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
      listingType: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "rent", displayValue: "Rent" },
            { value: "sell", displayValue: "Sell" },
          ],
        },
        value: "rent",
        validation: false,
        valid: true,
      },
      rentalPrice: {
        elementType: "input",
        elementConfig: {
          type: "number",
          placeholder: "Rent price (per month)",
        },
        value: "",
        validation: false,
        valid: true,
      },
      sellingPrice: {
        elementType: "input",
        elementConfig: {
          type: "number",
          placeholder: "Selling price",
        },
        value: "",
        validation: false,
        valid: true,
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
        validation: false,
        valid: true,
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
      },
    },
    imageAsFile: [],
    formIsValid: true,
    showModal: false,
    initialEdit: true,
  };

  componentWillUnmount() {
    this.props.dispatchClearExpandedListing();
  }

  componentDidMount() {
    if (this.state.initialEdit) {
      const dataForm = { ...this.state.dataForm };
      for (let key in dataForm) {
        switch (key) {
          case "deliveryMethod":
            dataForm[key].value = this.props.editListing.postDetails[key];
            if (this.props.editListing.postDetails[key] === "meet-up") {
              dataForm[
                "location"
              ].value = this.props.editListing.postDetails.location;
            }
            break;
          case "listingType":
            dataForm[key].value = this.props.editListing.postDetails[key];
            if (this.props.editListing.postDetails[key] === "rent") {
              dataForm[
                "rentalPrice"
              ].value = this.props.editListing.postDetails.price;
            } else {
              dataForm[
                "sellingPrice"
              ].value = this.props.editListing.postDetails.price;
            }
            break;
          case "rentalPrice":
          case "sellingPrice":
          case "location":
            break;
          default:
            dataForm[key].value = this.props.editListing.postDetails[key];
            dataForm[key].touched = true;
            dataForm[key].valid = true;
        }
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
      });
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
        this.state.imageAsFile.length === 0
      ) {
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
          formData[key] = this.state.dataForm[key].value.toLowerCase();
          break;
        case "deliveryMethod":
          formData[key] = this.state.dataForm[key].value;
          if (this.state.dataForm[key].value === "meet-up") {
            formData[
              "location"
            ] = this.state.dataForm.location.value.toLowerCase();
          }
          break;
        case "listingType":
          formData[key] = this.state.dataForm[key].value;
          if (this.state.dataForm[key].value === "rent") {
            formData["price"] = this.state.dataForm.rentalPrice.value;
          } else {
            formData["price"] = this.state.dataForm.sellingPrice.value;
          }
          break;
        case "rentalPrice":
        case "sellingPrice":
        case "location":
          break;
        default:
          formData[key] = this.state.dataForm[key].value;
      }
    }

    const postDetails = {
      ...this.props.editListing,
      postDetails: formData,
      numberOfImages: this.state.imageAsFile.length,
    };

    delete postDetails.key;
    delete postDetails.imageURL;

    if (!postDetails.comments) {
      delete postDetails.comments;
    }

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
      const numImages = imageArray.length;
      this.setState({
        imageAsFile: imageArray,
        numberOfImages: numImages,
        formIsValid: formIsValid,
        initialEdit: false,
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
          formIsValid: validForm,
          initialEdit: false,
        });
        break;
      }
    }
  };

  toggleModalHandler = () => {
    this.setState((prevState) => ({ showModal: !prevState.showModal }));
  };

  render() {
    if (this.props.editListingLoading) {
      return <Spinner />;
    }

    const formElementsArray = [];

    for (let key in this.state.dataForm) {
      if (
        (key === "location" &&
          this.state.dataForm.deliveryMethod.value === "mail") ||
        (key === "rentalPrice" &&
          this.state.dataForm.listingType.value === "sell") ||
        (key === "sellingPrice" &&
          this.state.dataForm.listingType.value === "rent")
      ) {
        continue;
      }
      formElementsArray.push({
        id: key,
        config: this.state.dataForm[key],
      });
    }

    let form = formElementsArray.map((formElement) => {
      return (
        <Input
          disabled={formElement.id === "listingType"}
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
              disabled={!this.state.formIsValid || this.state.initialEdit}
            >
              SUBMIT
            </Button>
            <Button
              onClick={() => {
                this.props.dispatchExpandedListing(
                  this.props.editListing.unique
                );
                this.props.history.goBack();
              }}
            >
              Cancel
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
        <p>
          <b>Module code: </b>
          {this.state.dataForm.module.value}
        </p>
        <p>
          <b>Textbook: </b>《{this.state.dataForm.textbook.value}》
        </p>
        <p>
          <b>Type: </b>
          {this.state.dataForm.listingType.value}
        </p>
        <p>
          <b>Price: </b>
          {this.state.dataForm.listingType.value === "rent"
            ? this.state.dataForm.rentalPrice.value
            : this.state.dataForm.sellingPrice.value}
        </p>
        <p>
          <b>Delivery method: </b>
          {this.state.dataForm.deliveryMethod.value}
        </p>
        {this.state.dataForm.deliveryMethod.value === "mail" ? null : (
          <p>
            <b>Location: </b>
            {this.state.dataForm.location.value}
          </p>
        )}
        {this.state.dataForm.description.value === "" ? null : (
          <p>
            <b>Description: </b>
            <br />
            {this.state.dataForm.description.value}
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={this.toggleModalHandler}>Go back</Button>
          <Button onClick={this.onSubmitHandler}>Submit</Button>
        </div>
      </Modal>
    );

    let successPost = (
      <Modal show={this.props.postUploaded}>
        Successfully edited!
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
    dispatchClearExpandedListing: () =>
      dispatch(actions.clearExpandedListing()),
    dispatchExpandedListing: (identifier) =>
      dispatch(actions.fetchExpandedListing(identifier)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPost);
