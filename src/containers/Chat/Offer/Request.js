import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

import * as classes from "./Offer.css";
import Button from "../../../components/UI/Button/Button";
import { database } from "../../../firebase/firebase";
import Modal from "../../../components/UI/Modal/Modal";

class Request extends Component {
  state = {
    priceOffer: "",
    startRental: "",
    endRental: "",
    interestedListing: "",
    offerType: "",
    fullChatUID: "",
    showPopUp: false,
    showConfirmRequestPopUp: false,
    isRequestOwner: false,
  };

  componentDidUpdate() {
    const offerMessages = this.props.fullChat.filter(
      (message) => message.type !== "NORMAL"
    );
    let lastOffer = offerMessages[offerMessages.length - 1];
    if (
      this.state.fullChatUID === this.props.fullChatUID &&
      this.state.offerType !== "FIRST_OFFER" &&
      lastOffer &&
      this.state.offerType !== lastOffer.type
    ) {
      this.setState({
        isRequestOwner: this.isRequestOwner(lastOffer),
        interestedListing: lastOffer.interestedListing,
        priceOffer: lastOffer.price,
        startRental: lastOffer.startRental,
        endRental: lastOffer.endRental,
        offerType: lastOffer.type,
      });
    } else if (
      this.state.fullChatUID !== this.props.fullChatUID &&
      this.props.resolveRequest &&
      (this.props.fullChat.length < 1 || offerMessages.length < 1)
    ) {
      this.setState({
        isRequestOwner:
          this.props.resolveRequest.displayName === this.props.displayName,
        interestedListing: this.props.resolveRequest,
        fullChatUID: this.props.fullChatUID,
        offerType: "FIRST_OFFER",
        priceOffer: "",
        startRental: "",
        endRental: "",
      });
    } else if (this.state.fullChatUID !== this.props.fullChatUID && lastOffer) {
      this.setState({
        isRequestOwner: this.isRequestOwner(lastOffer),
        interestedListing: lastOffer.interestedListing,
        fullChatUID: this.props.fullChatUID,

        priceOffer: lastOffer.price,
        startRental: lastOffer.startRental,
        endRental: lastOffer.endRental,
        offerType: lastOffer.type,
      });
    } else if (this.state.fullChatUID !== this.props.fullChatUID) {
      this.setState({
        priceOffer: "",
        startRental: "",
        endRental: "",
        interestedListing: "",
        offerType: "",
        fullChatUID: this.props.fullChatUID,
        showPopUp: false,
        isRequestOwner: false,
      });
    }
  }

  componentDidMount() {
    const offerMessages = this.props.fullChat.filter(
      (message) => message.type !== "NORMAL"
    );
    let lastOffer = offerMessages[offerMessages.length - 1];
    if (
      this.props.resolveRequest &&
      (this.props.fullChat.length < 1 || offerMessages.length < 1)
    ) {
      this.setState({
        isRequestOwner:
          this.props.resolveRequest.displayName === this.props.displayName,
        interestedListing: this.props.resolveRequest,
        fullChatUID: this.props.fullChatUID,
        offerType: "FIRST_OFFER",
      });
    } else if (
      this.props.resolveRequest &&
      lastOffer &&
      lastOffer.interestedListing.key !== this.props.resolveRequest.key
    ) {
      this.setState({
        isRequestOwner: this.isRequestOwner(lastOffer),
        interestedListing: this.props.resolveRequest,
        fullChatUID: this.props.fullChatUID,
        offerType: "FIRST_OFFER",
      });
    } else if (lastOffer) {
      this.setState({
        isRequestOwner: this.isRequestOwner(lastOffer),
        interestedListing: lastOffer.interestedListing,
        fullChatUID: this.props.fullChatUID,
        priceOffer: lastOffer.price,
        startRental: lastOffer.startRental,
        endRental: lastOffer.endRental,
        offerType: lastOffer.type,
      });
    }
  }

  isRequestOwner = (lastOffer) => {
    let isRequestOwner = false;
    if (lastOffer.interestedListing.displayName === this.props.displayName) {
      isRequestOwner = true;
    }
    return isRequestOwner;
  };

  priceOfferOnChange = (event) => {
    this.setState({
      priceOffer: event.target.value,
    });
  };

  startRentalOnChange = (event) => {
    this.setState({
      startRental: event.target.value,
    });
  };

  endRentalOnChange = (event) => {
    this.setState({
      endRental: event.target.value,
    });
  };

  onShowPopUpHandler = (event) => {
    this.setState({
      showPopUp: true,
    });
  };

  onClosePopUpHandler = (event) => {
    this.setState({
      showPopUp: false,
      priceOffer: "",
      startRental: "",
      endRental: "",
    });
  };

  /**
   * Date validation requirement:
   * 1) Rental start date must be equivalent to or later than the date of which the user made the rental offer
   * 2) Rental end date must be later than the rental start date
   * 3) Total duration of rental cannot exceed one year i.e. 365 days
   */
  dateValidation = () => {
    const dateFormat = "DD/MM/YYYY";
    let startDateIsValid = moment(
      this.state.startRental,
      dateFormat,
      true
    ).isValid();
    let endDateIsValid = moment(
      this.state.endRental,
      dateFormat,
      true
    ).isValid();

    let startRentalDate = Number(this.state.startRental.split("/").join(""));
    let endRentalDate = Number(this.state.endRental.split("/").join(""));
    let today = Number(moment().format("DDMMYYYY"));

    if (startRentalDate < today) {
      startDateIsValid = false;
    }

    if (!startDateIsValid) {
      alert("Please enter a valid start date");
      return false;
    }

    if (endRentalDate < startRentalDate) {
      alert("Please enter a valid rental period");
      return false;
    }

    if (!endDateIsValid) {
      alert("Please enter a valid end date");
      return false;
    }

    if (endDateIsValid && startDateIsValid) {
      const date1 = new Date(this.state.startRental);
      const date2 = new Date(this.state.endRental);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 365) {
        startDateIsValid = false;
        endDateIsValid = false;
        alert("Rental duration cannot exceed one year");
        return false;
      }
    }
    return true;
  };

  /**
   * Price validation:
   * 1) No-non zero price
   * 2) price offered by user must be within 25% of the listing price
   */
  priceValidation = () => {
    if (this.state.priceOffer === "") {
      alert("Please enter a valid price");
      return false;
    }
    const offerPrice = Number(this.state.priceOffer);
    if (offerPrice <= 0) {
      alert("Please enter a valid price");
      return false;
    }
    const listingPrice = Number(this.state.interestedListing.price);
    if (offerPrice < listingPrice) {
      if (((listingPrice - offerPrice) / listingPrice) * 100 > 25) {
        alert("Please enter a higher offer");
        return false;
      }
    }
    return true;
  };

  initialOffer = (event) => {
    if (this.priceValidation()) {
      const interestedListing = Object.assign({}, this.state.interestedListing);

      let message;
      message = {
        content:
          "Offer for《" +
          interestedListing.textbook +
          "》: $" +
          this.state.priceOffer,
        type: "MADE_OFFER",
        interestedListing: interestedListing,
        sender: this.props.displayName,
        price: this.state.priceOffer,
        date: moment().format("DD/MM/YYYY"),
        time: moment().format("HH:mm:ss"),
      };
      const chatHistory = Object.assign([], this.props.fullChat);
      chatHistory.push(message);
      database
        .ref()
        .child("chats/" + this.props.fullChatUID)
        .update({
          chatHistory: chatHistory,
        })
        .then((res) => {
          this.setState({
            showPopUp: false,
            offerType: "MADE_OFFER",
          });
        });
    }
  };

  confirmDetails = (event) => {
    if (this.priceValidation()) {
      const interestedListing = Object.assign({}, this.state.interestedListing);

      let message;
      if (interestedListing.requestType === "rent") {
        if (this.dateValidation()) {
          message = {
            content:
              "Offer for《" +
              interestedListing.textbook +
              "》: $" +
              this.state.priceOffer +
              ". Rental duration: from " +
              this.state.startRental +
              " to " +
              this.state.endRental,
            type: "CONFIRM_OFFER",
            interestedListing: interestedListing,
            sender: this.props.displayName,
            price: this.state.priceOffer,
            startRental: this.state.startRental,
            endRental: this.state.endRental,
            date: moment().format("DD/MM/YYYY"),
            time: moment().format("HH:mm:ss"),
          };
          const chatHistory = Object.assign([], this.props.fullChat);
          chatHistory.push(message);
          database
            .ref()
            .child("chats/" + this.props.fullChatUID)
            .update({
              chatHistory: chatHistory,
            })
            .then((res) => {
              this.setState({
                showConfirmRequestPopUp: false,
                offerType: "CONFIRM_OFFER",
              });
            });
        }
      } else {
        message = {
          content:
            "Offer for《" +
            interestedListing.textBook +
            "》: $" +
            this.state.priceOffer,
          interestedListing: interestedListing,
          type: "CONFIRM_OFFER",
          sender: this.props.displayName,
          price: this.state.priceOffer ? this.state.priceOffer : null,
          startRental: this.state.startRental ? this.state.startRental : null,
          endRental: this.state.endRental ? this.state.endRental : null,
          date: moment().format("DD/MM/YYYY"),
          time: moment().format("HH:mm:ss"),
        };
        const chatHistory = Object.assign([], this.props.fullChat);
        chatHistory.push(message);
        database
          .ref()
          .child("chats/" + this.props.fullChatUID)
          .update({
            chatHistory: chatHistory,
          })
          .then((res) => {
            this.setState({
              showConfirmRequestPopUp: false,
              offerType: "CONFIRM_OFFER",
            });
          });
      }
    }
  };

  onCancelOffer = (event) => {
    const interestedListing = Object.assign({}, this.state.interestedListing);

    let message = {
      content: "Offer for《" + interestedListing.textbook + "》cancelled",
      type: "CANCELLED_OFFER",
      interestedListing: interestedListing,
      sender: this.props.displayName,
      price: this.state.priceOffer ? this.state.priceOffer : null,
      startRental: this.state.startRental ? this.state.startRental : null,
      endRental: this.state.endRental ? this.state.endRental : null,
      date: moment().format("DD/MM/YYYY"),
      time: moment().format("HH:mm:ss"),
    };

    const chatHistory = Object.assign([], this.props.fullChat);
    chatHistory.push(message);

    database
      .ref()
      .child("chats/" + this.props.fullChatUID)
      .update({
        chatHistory: chatHistory,
      })
      .then((res) => {
        this.setState({
          offerType: "CANCELLED_OFFER",
        });
      });
  };

  onAcceptOffer = () => {
    let message = {
      content:
        "Offer for《" + this.state.interestedListing.textbook + "》accepted",
      type: "ACCEPTED_OFFER",
      interestedListing: this.state.interestedListing,
      sender: this.props.displayName,
      price: this.state.priceOffer,
      startRental: this.state.startRental ? this.state.startRental : null,
      endRental: this.state.endRental ? this.state.endRental : null,
      date: moment().format("DD/MM/YYYY"),
      time: moment().format("HH:mm:ss"),
    };

    const chatHistory = Object.assign([], this.props.fullChat);
    chatHistory.push(message);
    database
      .ref()
      .child("chats/" + this.props.fullChatUID)
      .update({
        chatHistory: chatHistory,
      })
      .then((res) => {
        this.setState({
          offerType: "ACCEPTED_OFFER",
        });
      });

    database
      .ref()
      .child("requests")
      .child(this.state.interestedListing.key)
      .remove()
  };

  onRejectOffer = () => {
    let message = {
      content:
        "Offer for《" + this.state.interestedListing.textbook + "》rejected",
      type: "REJECTED_OFFER",
      interestedListing: this.state.interestedListing,
      sender: this.props.displayName,
      price: this.state.priceOffer ? this.state.priceOffer : "",
      startRental: this.state.startRental ? this.state.startRental : "",
      endRental: this.state.endRental ? this.state.endRental : "",
      date: moment().format("DD/MM/YYYY"),
      time: moment().format("HH:mm:ss"),
    };

    const chatHistory = Object.assign([], this.props.fullChat);
    chatHistory.push(message);
    database
      .ref()
      .child("chats/" + this.props.fullChatUID)
      .update({
        chatHistory: chatHistory,
      })
      .then((res) => {
        this.setState({
          offerType: "REJECTED_OFFER",
        });
      });
  };

  showConfirmRequestPopUp = () => {
    this.setState({ showConfirmRequestPopUp: true });
  }

  closeConfirmRequestPopUpHandler = () => {
    this.setState({
      showConfirmRequestPopUp: false,
      priceOffer: "",
      startRental: "",
      endRental: "",
    });
  }

  render() {
    if (this.state.interestedListing === "") {
      return null;
    }

    let offerPopUp = (
      <Modal show={this.state.showPopUp}>
        <div className={classes.Popup}>
          <br />
          <input
            type="number"
            className={classes.OfferInput}
            onChange={this.priceOfferOnChange}
            value={this.state.priceOffer}
            placeholder="Enter offer here..."
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button btnType="Important" onClick={this.initialOffer}>
              Submit Offer
            </Button>
            <Button onClick={this.onClosePopUpHandler}>Cancel</Button>
          </div>
        </div>
      </Modal>
    );

    let confirmRequestPopUp = (
      <Modal show={this.state.showConfirmRequestPopUp}>
        <div className={classes.Popup}>
          <br />
          <input
            type="number"
            className={classes.OfferInput}
            onChange={this.priceOfferOnChange}
            value={this.state.priceOffer}
            placeholder="Enter offer here..."
          />
          <br />
          {this.state.interestedListing.listingType === "rent" ? (
            <React.Fragment>
              <input
                type="text"
                className={classes.OfferInput}
                onChange={this.startRentalOnChange}
                value={this.state.startRental}
                placeholder="From DD/MM/YYYY"
              />
              <br />
              <input
                type="text"
                className={classes.OfferInput}
                onChange={this.endRentalOnChange}
                value={this.state.endRental}
                placeholder="To DD/MM/YYYY"
              />
              <br />
            </React.Fragment>
          ) : null}

          < div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button btnType="Important" onClick={this.confirmDetails}>
              Submit Offer
            </Button>
            <Button onClick={this.closeConfirmRequestPopUpHandler}>Cancel</Button>
          </div>
        </div>
      </Modal >
    );

    let buttons;

    if (this.state.isRequestOwner) {
      switch (this.state.offerType) {
        case "MADE_OFFER":
          buttons = (
            <React.Fragment>
              <Button btnType="Important" onClick={this.showConfirmRequestPopUp}>
                Accept offer
              </Button>
              <Button btnType="Important" onClick={this.onRejectOffer}>
                Reject offer
              </Button>
            </React.Fragment>
          );
          break;
        case "CANCELLED_OFFER":
          buttons = <p style={{ margin: "5px" }}>No offers made</p>;
          break;
        case "ACCEPTED_OFFER":
          buttons = <p style={{ margin: "5px" }}>Offer accepted</p>;
          break;
        case "CONFIRM_OFFER":
          buttons = <p style={{ margin: "5px" }}>Waiting for reply...</p>;
          break;
        case "REJECTED_OFFER":
          buttons = <p style={{ margin: "5px" }}>Offer rejected</p>;
          break;
        default:
          break;
      }
    } else {
      switch (this.state.offerType) {
        case "MADE_OFFER":
          buttons = (
            <Button btnType="Important" onClick={this.onCancelOffer}>
              Cancel offer
            </Button>
          );
          break;
        case "CONFIRM_OFFER":
          buttons = (
            <React.Fragment>
              <Button btnType="Important" onClick={this.onAcceptOffer}>
                Accept offer
            </Button>
              <Button btnType="Important" onClick={this.onRejectOffer}>
                Reject offer
            </Button>
            </React.Fragment>
          );
          break;
        case "ACCEPTED_OFFER":
          buttons = <p style={{ margin: "5px" }}>Accepted offer</p>;
          break;
        case "CANCELLED_OFFER":
          buttons = (
            <React.Fragment>
              <p style={{ margin: "5px" }}>Cancelled offer</p>
              <Button btnType="Important" onClick={this.onShowPopUpHandler}>
                Make offer
              </Button>
            </React.Fragment>
          );
          break;
        case "REJECTED_OFFER":
          buttons = (
            <React.Fragment>
              <p style={{ margin: "5px" }}>Rejected Offer</p>
              <Button btnType="Important" onClick={this.onShowPopUpHandler}>
                Make another offer
              </Button>
            </React.Fragment>
          );
          break;
        case "FIRST_OFFER":
          buttons = (
            <React.Fragment>
              <Button btnType="Important" onClick={this.onShowPopUpHandler}>
                Make offer
              </Button>
            </React.Fragment>
          );
          break;
        default:
          break;
      }
    }

    return (
      <React.Fragment>
        <div className={classes.InterestedListing}>
          <div className={classes.RequestDetails}>
            <ul>
              <li>Module: {this.state.interestedListing.module}</li>
              <li>textbook: 《{this.state.interestedListing.textbook}》</li>
            </ul>
          </div>
          <div className={classes.Buttons}>{buttons}</div>
        </div>
        {offerPopUp}
        {confirmRequestPopUp}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    resolveRequest: state.request.resolve,
    displayName: state.auth.displayName,
    recipient: state.chat.recipient,
  };
};

export default connect(mapStateToProps)(Request);