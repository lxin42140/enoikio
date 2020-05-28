import React from 'react';
import Modal from '../Modal';
import Button from '../../Button/Button';
import { Link } from 'react-router-dom';
import classes from './Notification.css';

const notification = (props) => {

    const redirect = () => {
        return <Link to="/" exact />;
    }

    let buttonType;
    let contentStyle = null;

    switch (props.type) {
        case 'ListingSummary':
            buttonType = (
                <React.Fragment>
                    <Button onClick={props.modalClosed}>Go back</Button>
                    <Button onClick={props.submit}>Submit</Button>
                </React.Fragment>
            );
            break;
        case 'ListingSuccess':
            //How to make the onClick go back to homepage "/"?
            buttonType = (
                <React.Fragment>
                    <Button onClick={redirect}>Home page</Button>
                    <Button onClick={props.newForm}>Submit new listing</Button>
                </React.Fragment>
            );
            contentStyle = classes.ListingSuccess;
            break;
        case 'ListingFail':
            buttonType = <Button btnType="Important" onClick={props.modalClosed}>Go Back</Button>
            break;
        default:
            buttonType = null;
    }

    return (
        <Modal show={props.showModal}>
            <div className={contentStyle}>{props.children}</div>
            <div className={classes.Button}>{buttonType}</div>            
        </Modal>
    );
};

export default notification;