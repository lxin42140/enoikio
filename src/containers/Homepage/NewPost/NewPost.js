import React, { Component } from 'react';
import classes from './NewPost.css';
import Input from './Input/Input';

class NewPost extends Component {

    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
    }

    state = {
        dataForm: {

            module: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Module Code'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            textbook: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Title of Textbook'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            price: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    placeholder: 'Rent Price (per month)'
                },
                value: '',
                validation: {
                    required: true,
                    // minLength: 6,
                    // maxLength: 6
                },
                valid: false,
                touched: false
            },
            location: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Pick-up location'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            // image: {
            //     elementType: 'image',
            //     elementConfig: {
            //         type: 'image',
            //     },
            //     value: '',
            //     validation: {
            //         required: true
            //     },
            //     valid: false,
            //     touched: false
            // },
            // deliveryMethod: {
            //     elementType: 'select',
            //     elementConfig: {
            //         options: [
            //             { value: 'fastest', displayValue: 'Fastest' },
            //             { value: 'cheapest', displayValue: 'Cheapest' }
            //         ]
            //     },
            //     value: 'fastest',
            //     validation: {},
            //     valid: true
            // }
        },
        image: null,
        formIsValid: false,
        loading: false
    }

    checkValidity(value, rules) {
        let isValid = true;
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }

        return isValid;
    }

    // orderHandler = (event) => {
    //     event.preventDefault();
    //     this.setState({ loading: true });
    //     const formData = {};
    //     for (let formElementIdentifier in this.state.dataForm) {
    //         formData[formElementIdentifier] = this.state.dataForm[formElementIdentifier].value;
    //     }
    //     const order = {
    //         ingredients: this.props.ingredients,
    //         price: this.props.price,
    //         orderData: formData
    //     }

    //     axios.post('/orders.json', order)
    //         .then(response => {
    //             this.setState({ loading: false });
    //             this.props.history.push('/');
    //             //console.log(response);
    //         })
    //         .catch(error => {
    //             this.setState({ loading: false });
    //             console.log(error);
    //         });
    // }

    inputChangedHandler = (event, inputIdentifier) => {
        //console.log(event.target.value);
        const updatedDataForm = {
            ...this.state.dataForm
        }
        const updatedFormElement = {
            ...updatedDataForm[inputIdentifier]
        }
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedDataForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for (let inputIdentifiers in updatedDataForm) {
            formIsValid = updatedDataForm[inputIdentifiers].valid && formIsValid;
        }
        this.setState({ dataForm: updatedDataForm, formIsValid: formIsValid });
    }

    fileChangeHandler = event => { 
        console.log('Test');
        console.log(event.target.files);
        // this.readFile(event);
        this.setState({ image: event.target.files[0] }); 
       
      }; 

    render() {
        const formElementsArray = [];
        for (let key in this.state.dataForm) {
            formElementsArray.push({
                id: key,
                config: this.state.dataForm[key]
            });
        }
        let form = (
            <form onSubmit={this.orderHandler} >
                {formElementsArray.map(formElement => {
                    return <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                })}
            </form>
        );
        // if (this.state.loading) {
        //     form = <Spinner />
        // }

        return (
            <div className={classes.NewPost}>
                <h4>Enter Rent details</h4>
                {form}
                <input type="file" onClick={this.fileChangeHandler} ref={this.fileInput} /> 
                <button onClick={this.onFileUpload}> 
                  Upload! 
                </button>
                <br />
                <button disabled={!this.state.formIsValid}>SUBMIT</button>
            </div>
        );
    }
}

export default NewPost;