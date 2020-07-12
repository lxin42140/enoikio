import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import {
  faTrash,
  faTimes,
  faCheck,
  faHome,
  faEdit,
  faFileUpload,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import classes from "./NewPost.css";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";
import Modal from "../../components/UI/Modal/Modal";
import profileImage from "../../assets/Images/chats/profile";
class NewPost extends Component {
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
      listingType: {
        elementType: "select",
        elementConfig: {
          options: [
            {
              value: "rent",
              displayValue: "Rent (unable to edit once submitted)",
            },
            {
              value: "sell",
              displayValue: "Sell (unable to edit once submitted)",
            },
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
        validation: {
          required: true,
          lowerBound: true,
        },
        valid: false,
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
        validation: {
          required: true,
        },
        valid: false,
      },
      description: {
        elementType: "textarea",
        elementConfig: {
          type: "text",
          placeholder: "Please enter any other information...",
        },
        value: "",
        validation: false,
        valid: true,
      },
    },
    imageAsFile: [],
    formIsValid: false,
    showModal: false,
    numberOfImages: 0,
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
      if (rules.lowerBound) {
        isValid = value >= 0 && isValid;
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

    switch (inputIdentifier) {
      case "deliveryMethod":
        if (event.target.value === "mail") {
          updatedDataForm.location.validation = false;
          updatedDataForm.location.valid = true;
        } else {
          updatedDataForm.location.validation = {
            required: true,
          };
          updatedDataForm.location.valid = this.checkValidity(
            updatedDataForm.location.value,
            updatedDataForm.location.validation
          );
        }
        break;
      case "listingType":
        if (event.target.value === "rent") {
          updatedDataForm.rentalPrice.validation = {
            required: true,
            lowerBound: true,
          };
          updatedDataForm.rentalPrice.valid = this.checkValidity(
            updatedDataForm.rentalPrice.value,
            updatedDataForm.rentalPrice.validation
          );
          updatedDataForm.sellingPrice.valid = true;
          updatedDataForm.sellingPrice.validation = false;
        } else {
          updatedDataForm.sellingPrice.validation = {
            required: true,
            lowerBound: true,
          };
          updatedDataForm.sellingPrice.valid = this.checkValidity(
            updatedDataForm.sellingPrice.value,
            updatedDataForm.sellingPrice.validation
          );
          updatedDataForm.rentalPrice.valid = true;
          updatedDataForm.rentalPrice.validation = false;
        }
        break;
      default:
        break;
    }

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
      if (
        !updatedDataForm[inputIdentifiers].valid ||
        this.state.imageAsFile.length === 0
      ) {
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

    let photoURL = this.props.photoURL;
    if (!photoURL) {
      photoURL = profileImage;
    }

    const postDetails = {
      formattedDisplayName: this.props.displayName.toLowerCase(),
      photoURL: photoURL,
      displayName: this.props.displayName,
      unique: unique,
      date: date,
      time: time,
      numberOfImages: this.state.numberOfImages,
      status: "available",
      lessee: "none",
      likedUsers: ["none"],
      postDetails: formData,
    };
    this.props.dispatchSubmitPost(postDetails, this.props.token);
    this.props.dispatchSubmitPhoto(this.state.imageAsFile, unique);
    this.setState({ showModal: false });
  };

  handleImageAsFile = (event) => {
    const images = event.target.files;

    let imageArray = [...this.state.imageAsFile];
    if (
      imageArray.filter((image) => image !== null).length + images.length >
      3
    ) {
      this.setState({ formIsValid: false });
    } else {
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
      });
    }
  };

  removeImageHandler = (imageName) => {
    let imageArray = [...this.state.imageAsFile];

    for (let image in imageArray) {
      if (imageArray[image] === imageName) {
        imageArray.splice(image, 1);
        break;
      }
    }
    const length = imageArray.length;
    if (length < 1) {
      this.setState({
        imageAsFile: imageArray,
        numberOfImages: length,
        formIsValid: false,
      });
    } else {
      this.setState({ imageAsFile: imageArray, numberOfImages: length });
    }
  };

  createNewFormHandler = () => {
    this.props.dispatchClearNewPostData();
    const refreshedForm = {
      ...this.state.dataForm,
    };
    for (let element in refreshedForm) {
      if (element === "listingType") {
        refreshedForm[element].value = "rent";
      } else if (element === "deliveryMethod") {
        refreshedForm[element].value = "meet-up";
      } else if (element === "module") {
        refreshedForm[element].value = "";
        refreshedForm[element].validated = true;
        refreshedForm[element].validationError = null;
        refreshedForm[element].moduleName = "";
      } else {
        refreshedForm[element].value = "";
      }

      if (refreshedForm[element].touched) {
        refreshedForm[element].touched = false;
      }
      if (refreshedForm[element].validation) {
        refreshedForm[element].valid = false;
      }
    }

    this.setState({
      dataForm: refreshedForm,
      imageAsFile: [],
      formIsValid: false,
      showModal: false,
      numberOfImages: 0,
    });
  };

  toggleModalHandler = () => {
    this.setState((prevState) => ({ showModal: !prevState.showModal }));
  };

  render() {
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

    const displayImageList = this.state.imageAsFile.map((image) => {
      return (
        <div
          key={image.name}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ paddingRight: "10px", textAlign: "center" }}>
            {
              <FontAwesomeIcon
                icon={faImage}
                style={{ paddingRight: "5px", color: "#f3a1a1" }}
              />
            }
            {image.name}
          </p>
          <Button onClick={() => this.removeImageHandler(image)}>
            {<FontAwesomeIcon icon={faTrash} style={{ paddingRight: "5px" }} />}
            Remove
          </Button>
        </div>
      );
    });

    let createNewPost = (
      <div className={classes.NewPost}>
        <h4>
          {this.props.uploadingImage || this.props.uploadingPost
            ? "Submitting..."
            : "Enter Rental Details"}
        </h4>
        {this.props.uploadingImage || this.props.uploadingPost ? (
          <Spinner />
        ) : (
          <React.Fragment>
            {form}
            <br />
            <div className={classes.ImageText}>{displayImageList}</div>
            <div style={{ marginBottom: "10px", color: "#f3a1a1" }}>
              {
                <FontAwesomeIcon
                  icon={faFileUpload}
                  style={{ paddingRight: "5px" }}
                />
              }
              <input
                type="file"
                accept=".png,.jpeg, .jpg"
                multiple
                style={{ width: "95px", color: "#f3a1a1" }}
                onChange={this.handleImageAsFile}
                disabled={this.state.numberOfImages >= 3}
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

    if (this.props.postUploaded && this.props.imageUploaded) {
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
            <span style={{ textAlign: "start" }}>
              {this.state.dataForm.description.value}
            </span>
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={this.toggleModalHandler}>
            {<FontAwesomeIcon icon={faTimes} style={{ paddingRight: "5px" }} />}
            Go back
          </Button>
          <Button btnType="Important" onClick={this.onSubmitHandler}>
            {<FontAwesomeIcon icon={faCheck} style={{ paddingRight: "5px" }} />}
            Submit
          </Button>
        </div>
      </Modal>
    );

    let successPost = (
      <Modal show={this.props.postUploaded && this.props.imageUploaded}>
        <p style={{ color: "green" }}>Successfully posted!</p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "20px",
          }}
        >
          <Link to="/" style={{ paddingRight: "10px" }}>
            <Button
              btnType="Important"
              onClick={() => this.props.dispatchClearNewPostData()}
            >
              {
                <FontAwesomeIcon
                  icon={faHome}
                  style={{ paddingRight: "5px" }}
                />
              }
              Home
            </Button>
          </Link>
          <Button onClick={this.createNewFormHandler}>
            {<FontAwesomeIcon icon={faEdit} style={{ paddingRight: "5px" }} />}
            New Post
          </Button>
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
    uploadingPost: state.newPost.uploadingPost,
    postUploaded: state.newPost.postUploaded,
    uploadingImage: state.newPost.uploadingImage,
    imageUploaded: state.newPost.imageUploaded,
    displayName: state.auth.displayName,
    photoURL: state.auth.photoURL,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchSubmitPost: (newPost) => dispatch(actions.submitNewPost(newPost)),
    dispatchSubmitPhoto: (imageAsFile, identifier) =>
      dispatch(actions.submitNewPhoto(imageAsFile, identifier)),
    dispatchClearNewPostData: () => dispatch(actions.clearPostData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewPost);
