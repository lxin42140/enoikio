import React, { Component } from "react";
import classes from "./NewPost.css";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";

const fileInput = React.createRef();

class NewPost extends Component {

    // data = {
    //     username:
    //     module:
    //     textbook:
    //     image: 
    //     delivery method:
    //     location:
    //     rentPrice:
    //     image: 
    //     ratings:

    //     date posted:??
    // }

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
            { value: "meetup", displayValue: "Meet up" },
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
    image: null,
    formIsValid: false,
    loading: false,
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
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
    if (!updatedFormElement.valid) {
      updatedFormElement.valid = this.checkValidity(
        updatedFormElement.value,
        updatedFormElement.validation
      );
    }
    updatedFormElement.touched = true;
    updatedDataForm[inputIdentifier] = updatedFormElement;

    let formIsValid = true;
    for (let inputIdentifiers in updatedDataForm) {
      formIsValid = updatedDataForm[inputIdentifiers].valid && formIsValid;
    }
    this.setState({ dataForm: updatedDataForm, formIsValid: formIsValid });
  };

  fileChangeHandler = (event) => {
    this.setState({ image: event.target.files[0] });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.dataForm) {
      formElementsArray.push({
        id: key,
        config: this.state.dataForm[key],
      });
    }
    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map((formElement) => {
          return (
            <Input
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              invalid={!formElement.config.valid}
              shouldValidate={formElement.config.validation}
              touched={formElement.config.touched}
              change={(event) =>
                this.inputChangedHandler(event, formElement.id)
              }
            />
          );
        })}
      </form>
    );

    return (
      <div className={classes.NewPost}>
        <h4>Enter Rental Details</h4>
        {form}
        <input 
          type="file"
          accept="image/*" 
          onClick={this.fileChangeHandler} 
          ref={fileInput} />
        <Button onClick={this.onFileUpload}>Upload!</Button>
        <br />
        <br />
        <Button btnType="Important" disabled={!this.state.formIsValid}>
          SUBMIT
        </Button>
      </div>
    );
  }
}

export default NewPost;
