import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import {
  faDollarSign,
  faCheck,
  faTimes,
  faCalendarAlt,
  faGlassCheers,
  faExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as classes from "./Offer.css";
import Button from "../../../components/UI/Button/Button";
import { database } from "../../../firebase/firebase";
import Modal from "../../../components/UI/Modal/Modal";

class Offer extends Component {
  state = {
    priceOffer: "",
    startRental: "",
    endRental: "",
    interestedListing: "",
    offerType: "",
    fullChatUID: "",
    showPopUp: false,
    isListingOwner: false,
    errorMessage: "",
  };

  componentDidMount() {
    const offerMessages = this.props.fullChat.filter(
      (message) => message.type !== "NORMAL"
    );
    let lastOffer = offerMessages[offerMessages.length - 1];

    if (
      this.props.interestedListing &&
      (this.props.fullChat.length < 1 || offerMessages.length < 1)
    ) {
      // console.log("componentDidMount", "first");
      this.setState({
        isListingOwner:
          this.props.interestedListing.displayName === this.props.displayName,
        interestedListing: this.props.interestedListing,
        fullChatUID: this.props.fullChatUID,
        offerType: "FIRST_OFFER",
      });
    } else if (
      this.props.interestedListing &&
      lastOffer &&
      lastOffer.interestedListing.key !== this.props.interestedListing.key
    ) {
      // console.log("componentDidMount", "second");

      let offerType = "FIRST_OFFER";
      if (this.props.interestedListing.offerType) {
        offerType = this.props.interestedListing.offerType;
      }
      this.setState({
        isListingOwner:
          this.props.interestedListing.displayName === this.props.displayName,
        interestedListing: this.props.interestedListing,
        fullChatUID: this.props.fullChatUID,
        offerType: offerType,
      });
    } else if (lastOffer) {
      // console.log("componentDidMount", "third");

      this.setState({
        isListingOwner: this.isListingOwner(lastOffer),
        interestedListing: lastOffer.interestedListing,
        fullChatUID: this.props.fullChatUID,
        priceOffer: lastOffer.price,
        startRental: lastOffer.startRental,
        endRental: lastOffer.endRental,
        offerType: lastOffer.type,
      });
    }
  }

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
      // console.log("componentDidUpdate", "first");

      this.setState({
        isListingOwner: this.isListingOwner(lastOffer),
        interestedListing: lastOffer.interestedListing,
        priceOffer: lastOffer.price,
        startRental: lastOffer.startRental,
        endRental: lastOffer.endRental,
        offerType: lastOffer.type,
      });
    } else if (
      this.state.fullChatUID !== this.props.fullChatUID &&
      this.props.interestedListing &&
      (this.props.fullChat.length < 1 || offerMessages.length < 1)
    ) {
      // console.log("componentDidUpdate", "second");

      this.setState({
        isListingOwner:
          this.props.interestedListing.displayName === this.props.displayName,
        interestedListing: this.props.interestedListing,
        fullChatUID: this.props.fullChatUID,
        offerType: "FIRST_OFFER",
        priceOffer: "",
        startRental: "",
        endRental: "",
      });
    } else if (this.state.fullChatUID !== this.props.fullChatUID && lastOffer) {
      // console.log("componentDidUpdate", "third");

      this.setState({
        isListingOwner: this.isListingOwner(lastOffer),
        interestedListing: lastOffer.interestedListing,
        fullChatUID: this.props.fullChatUID,

        priceOffer: lastOffer.price,
        startRental: lastOffer.startRental,
        endRental: lastOffer.endRental,
        offerType: lastOffer.type,
      });
    } else if (this.state.fullChatUID !== this.props.fullChatUID) {
      // console.log("componentDidUpdate", "fourth");

      this.setState({
        priceOffer: "",
        startRental: "",
        endRental: "",
        interestedListing: "",
        offerType: "",
        fullChatUID: this.props.fullChatUID,
        showPopUp: false,
        isListingOwner: false,
      });
    }
  }

  isListingOwner = (lastOffer) => {
    let isListingOwner = false;
    if (lastOffer.interestedListing.displayName === this.props.displayName) {
      isListingOwner = true;
    }
    return isListingOwner;
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

    if (!startDateIsValid) {
      alert("Please double check start date format");
      return false;
    }

    let endDateIsValid = moment(
      this.state.endRental,
      dateFormat,
      true
    ).isValid();

    if (!endDateIsValid) {
      alert("Please double check end date format");
      return false;
    }

    let startRentalDate = Number(
      this.state.startRental.split("/").reverse().join("")
    );
    let endRentalDate = Number(
      this.state.endRental.split("/").reverse().join("")
    );
    let today = Number(moment().format("YYYYMMDD"));

    if (startRentalDate < today) {
      alert("Start rental date cannot be earlier than current date");
      return false;
    }

    if (endRentalDate < startRentalDate) {
      alert("Please enter a valid rental period");
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

  onConfirmOffer = (event) => {
    if (this.priceValidation()) {
      const interestedListing = Object.assign({}, this.state.interestedListing);

      let message;
      if (interestedListing.listingType === "rent") {
        if (this.dateValidation()) {
          message = {
            content:
              "Offer for《" +
              interestedListing.textbook +
              "》: $" +
              this.state.priceOffer +
              ". Rental start date: " +
              this.state.startRental +
              ". Rental end date:  " +
              this.state.endRental,
            type: "MADE_OFFER",
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
                showPopUp: false,
                offerType: "MADE_OFFER",
              });
            })
            .catch((error) => {
              let message;
              switch (error.getCode()) {
                case -24: //NETWORK_ERROR
                case -4: //DISCONNECTED
                  message =
                    "Oops, please check your network connection and try again!";
                  break;
                case -10: //UNAVAILABLE
                case -2: //OPERATION_FAILED
                  message =
                    "Oops, the service is currently unavailable. Please try again later!";
                  break;
                default:
                  message =
                    "Oops, something went wrong. Please try again later!";
              }
              this.setState({
                errorMessage: message,
              });
            });
        }
      } else {
        message = {
          content:
            "Offer for《" +
            interestedListing.textbook +
            "》: $" +
            this.state.priceOffer,
          interestedListing: interestedListing,
          type: "MADE_OFFER",
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
              showPopUp: false,
              offerType: "MADE_OFFER",
            });
          })
          .catch((error) => {
            let message;
            switch (error.getCode()) {
              case -24: //NETWORK_ERROR
              case -4: //DISCONNECTED
                message =
                  "Oops, please check your network connection and try again!";
                break;
              case -10: //UNAVAILABLE
              case -2: //OPERATION_FAILED
                message =
                  "Oops, the service is currently unavailable. Please try again later!";
                break;
              default:
                message = "Oops, something went wrong. Please try again later!";
            }
            this.setState({
              errorMessage: message,
            });
          });
      }
    }
  };

  onInterestedOffer = (event) => {
    const interestedListing = Object.assign({}, this.state.interestedListing);

    let message = {
      content: "I'm interested in《" + interestedListing.textbook + "》",
      type: "INTERESTED_OFFER",
      interestedListing: interestedListing,
      sender: this.props.displayName,
      price: "",
      startRental: "",
      endRental: "",
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
          offerType: "INTERESTED_OFFER",
        });
      })
      .catch((error) => {
        let message;
        switch (error.getCode()) {
          case -24: //NETWORK_ERROR
          case -4: //DISCONNECTED
            message =
              "Oops, please check your network connection and try again!";
            break;
          case -10: //UNAVAILABLE
          case -2: //OPERATION_FAILED
            message =
              "Oops, the service is currently unavailable. Please try again later!";
            break;
          default:
            message = "Oops, something went wrong. Please try again later!";
        }
        this.setState({
          errorMessage: message,
        });
      });
  };

  onCancelOffer = (event) => {
    const interestedListing = Object.assign({}, this.state.interestedListing);

    let message = {
      content: "Offer for《" + interestedListing.textbook + "》cancelled",
      type: "CANCELLED_OFFER",
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
          offerType: "CANCELLED_OFFER",
        });
      })
      .catch((error) => {
        let message;
        switch (error.getCode()) {
          case -24: //NETWORK_ERROR
          case -4: //DISCONNECTED
            message =
              "Oops, please check your network connection and try again!";
            break;
          case -10: //UNAVAILABLE
          case -2: //OPERATION_FAILED
            message =
              "Oops, the service is currently unavailable. Please try again later!";
            break;
          default:
            message = "Oops, something went wrong. Please try again later!";
        }
        this.setState({
          errorMessage: message,
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
      startRental: this.state.startRental,
      endRental: this.state.endRental,
      date: moment().format("DD/MM/YYYY"),
      time: moment().format("HH:mm:ss"),
    };

    const chatHistory = Object.assign([], this.props.fullChat);
    chatHistory.push(message);

    let status =
      "loaned out from " +
      this.state.startRental +
      " to " +
      this.state.endRental;

    let updates = {
      status: status,
      lessee: this.props.recipient,
    };

    if (this.state.interestedListing.listingType === "sell") {
      status = "sold";
    }

    if (this.state.interestedListing.listingType !== "rent") {
      updates = {
        status: status,
      };
    }

    database
      .ref()
      .child("listings")
      .child(this.state.interestedListing.key)
      .once("value", (snapShot) => {
        if (snapShot.exists()) {
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
            .child("listings")
            .child(this.state.interestedListing.key)
            .update(updates);
        } else {
          chatHistory.pop();
          message = {
            content: "Sorry, the listing has been deleted",
            sender: this.props.displayName,
            type: "NORMAL",
            date: moment().format("DD/MM/YYYY"),
            time: moment().format("HH:mm:ss"),
          };
          chatHistory.push(message);
          database
            .ref()
            .child("chats/" + this.props.fullChatUID)
            .update({
              chatHistory: chatHistory,
            });
        }
      })
      .catch((error) => {
        let message;
        switch (error.getCode()) {
          case -24: //NETWORK_ERROR
          case -4: //DISCONNECTED
            message =
              "Oops, please check your network connection and try again!";
            break;
          case -10: //UNAVAILABLE
          case -2: //OPERATION_FAILED
            message =
              "Oops, the service is currently unavailable. Please try again later!";
            break;
          default:
            message = "Oops, something went wrong. Please try again later!";
        }
        this.setState({
          errorMessage: message,
        });
      });
  };

  onRejectOffer = () => {
    let message = {
      content:
        "Offer for《" + this.state.interestedListing.textbook + "》rejected",
      type: "REJECTED_OFFER",
      interestedListing: this.state.interestedListing,
      sender: this.props.displayName,
      price: this.state.priceOffer,
      startRental: this.state.startRental,
      endRental: this.state.endRental,
      date: moment().format("DD/MM/YYYY"),
      time: moment().format("HH:mm:ss"),
    };

    const chatHistory = Object.assign([], this.props.fullChat);
    chatHistory.push(message);

    let newOffers = Object.assign(
      [],
      this.state.interestedListing.offers
    ).filter((offer) => offer.user !== this.props.recipient);

    database
      .ref()
      .child("listings")
      .child(this.state.interestedListing.key)
      .once("value", (snapShot) => {
        if (snapShot.exists()) {
          database
            .ref()
            .child("chats/" + this.props.fullChatUID)
            .update({
              chatHistory: chatHistory,
            })
            .then((res) => {
              this.setState({
                offerType: "REJECTED_OFFER",
                lessee: "none",
              });
            });

          database
            .ref()
            .child("listings")
            .child(this.state.interestedListing.key)
            .update({
              offers: newOffers,
              status: "available",
            });
        } else {
          chatHistory.pop();
          message = {
            content: "Sorry, the listing has been deleted",
            sender: this.props.displayName,
            type: "NORMAL",
            date: moment().format("DD/MM/YYYY"),
            time: moment().format("HH:mm:ss"),
          };
          chatHistory.push(message);
          database
            .ref()
            .child("chats/" + this.props.fullChatUID)
            .update({
              chatHistory: chatHistory,
            })
            .then((res) => {
              this.setState({
                lessee: "none",
              });
            });
        }
      })
      .catch((error) => {
        let message;
        switch (error.getCode()) {
          case -24: //NETWORK_ERROR
          case -4: //DISCONNECTED
            message =
              "Oops, please check your network connection and try again!";
            break;
          case -10: //UNAVAILABLE
          case -2: //OPERATION_FAILED
            message =
              "Oops, the service is currently unavailable. Please try again later!";
            break;
          default:
            message = "Oops, something went wrong. Please try again later!";
        }
        this.setState({
          errorMessage: message,
        });
      });
  };

  render() {
    if (this.state.interestedListing === "") {
      return null;
    }
    let minOffer =
      Math.round(
        ((Number(this.state.interestedListing.price) / 100) * 75 +
          Number.EPSILON) *
          100
      ) / 100;

    let offerPlaceHolder = "Enter offer (min $" + minOffer + ") here...";
    let offerPopUp = (
      <Modal show={this.state.showPopUp}>
        <div className={classes.Popup}>
          <br />
          <div style={{ display: "flex", alignItems: "center" }}>
            {
              <FontAwesomeIcon
                icon={faDollarSign}
                style={{ paddingRight: "5px", color: "#f3a1a1" }}
              />
            }
            <input
              type="number"
              className={classes.OfferInput}
              onChange={this.priceOfferOnChange}
              value={this.state.priceOffer}
              placeholder={offerPlaceHolder}
              style={{ marginTop: "1%" }}
            />
          </div>
          <br />
          {this.state.interestedListing.listingType === "rent" ? (
            <React.Fragment>
              <div style={{ display: "flex", alignItems: "center" }}>
                {
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    style={{ paddingRight: "5px", color: "#f3a1a1" }}
                  />
                }
                <input
                  type="text"
                  className={classes.OfferInput}
                  onChange={this.startRentalOnChange}
                  value={this.state.startRental}
                  placeholder="Start rental date: DD/MM/YYYY format"
                />
              </div>
              <br />
              <div style={{ display: "flex", alignItems: "center" }}>
                {
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    style={{ paddingRight: "5px", color: "#f3a1a1" }}
                  />
                }
                <input
                  type="text"
                  className={classes.OfferInput}
                  onChange={this.endRentalOnChange}
                  value={this.state.endRental}
                  placeholder="End rental date: DD/MM/YYYY format"
                />
              </div>
              <br />
            </React.Fragment>
          ) : null}
          <i style={{ fontSize: "small", paddingBottom: "5px" }}>
            Please note that rental duration should not exceed 12 months
          </i>
          <br />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ paddingRight: "3px" }}>
              <Button btnType="Important" onClick={this.onConfirmOffer}>
                {
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ paddingRight: "5px" }}
                  />
                }
                Submit Offer
              </Button>
            </span>
            <Button onClick={this.onClosePopUpHandler}>
              {
                <FontAwesomeIcon
                  icon={faTimes}
                  style={{ paddingRight: "5px" }}
                />
              }
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    );

    let buttons;

    if (this.state.isListingOwner) {
      switch (this.state.offerType) {
        case "MADE_OFFER":
          buttons = (
            <React.Fragment>
              <Button btnType="Important" onClick={this.onAcceptOffer}>
                {
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ paddingRight: "5px" }}
                  />
                }
                Accept offer
              </Button>
              <Button btnType="Important" onClick={this.onRejectOffer}>
                {
                  <FontAwesomeIcon
                    icon={faTimes}
                    style={{ paddingRight: "5px" }}
                  />
                }
                Reject offer
              </Button>
            </React.Fragment>
          );
          break;
        case "CANCELLED_OFFER":
          buttons = (
            <p
              className={classes.promptMessage}
              style={{ margin: "5px", color: "red" }}
            >
              {
                <FontAwesomeIcon
                  icon={faTimes}
                  style={{ paddingRight: "5px" }}
                />
              }
              No offers made
            </p>
          );
          break;
        case "INTERESTED_OFFER":
          buttons = (
            <p
              className={classes.promptMessage}
              style={{ margin: "5px", color: "#f3a1a1" }}
            >
              {
                <FontAwesomeIcon
                  icon={faExclamation}
                  style={{ paddingRight: "5px" }}
                />
              }
              Indicated interest
            </p>
          );
          break;
        case "ACCEPTED_OFFER":
          buttons = (
            <React.Fragment>
              <p
                className={classes.promptMessage}
                style={{ margin: "5px", color: "green" }}
              >
                {
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ paddingRight: "5px" }}
                  />
                }
                Accepted offer
              </p>
              <Button btnType="Important" onClick={this.onRejectOffer}>
                {
                  <FontAwesomeIcon
                    icon={faTimes}
                    style={{ paddingRight: "5px" }}
                  />
                }
                Reject offer
              </Button>
            </React.Fragment>
          );
          break;
        case "REJECTED_OFFER":
          buttons = (
            <p
              className={classes.promptMessage}
              style={{ margin: "5px", color: "red" }}
            >
              {
                <FontAwesomeIcon
                  icon={faTimes}
                  style={{ paddingRight: "5px" }}
                />
              }
              Rejected offer
            </p>
          );
          break;
        case "COMPLETED_OFFER":
          buttons = (
            <p
              className={classes.promptMessage}
              style={{ margin: "5px", color: "#f3a1a1" }}
            >
              {
                <FontAwesomeIcon
                  icon={faGlassCheers}
                  style={{ paddingRight: "5px" }}
                />
              }
              Rental completed
            </p>
          );
          break;
        default:
          break;
      }
    } else {
      switch (this.state.offerType) {
        case "MADE_OFFER":
          buttons = (
            <Button btnType="Important" onClick={this.onCancelOffer}>
              {
                <FontAwesomeIcon
                  icon={faTimes}
                  style={{ paddingRight: "5px" }}
                />
              }
              Cancel offer
            </Button>
          );
          break;
        case "ACCEPTED_OFFER":
          buttons = (
            <p
              className={classes.promptMessage}
              style={{ margin: "5px", color: "green" }}
            >
              {
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ paddingRight: "5px" }}
                />
              }
              Accepted offer
            </p>
          );
          break;
        case "CANCELLED_OFFER":
          buttons = (
            <React.Fragment>
              <p
                className={classes.promptMessage}
                style={{ margin: "5px", color: "red" }}
              >
                {
                  <FontAwesomeIcon
                    icon={faTimes}
                    style={{ paddingRight: "5px" }}
                  />
                }
                Cancelled offer
              </p>
              <Button btnType="Important" onClick={this.onShowPopUpHandler}>
                {
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    style={{ paddingRight: "5px" }}
                  />
                }
                Make offer
              </Button>
            </React.Fragment>
          );
          break;
        case "REJECTED_OFFER":
          buttons = (
            <React.Fragment>
              <p
                className={classes.promptMessage}
                style={{ margin: "5px", color: "red" }}
              >
                {
                  <FontAwesomeIcon
                    icon={faTimes}
                    style={{ paddingRight: "5px" }}
                  />
                }
                Offer rejected
              </p>
              <Button btnType="Important" onClick={this.onShowPopUpHandler}>
                {
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    style={{ paddingRight: "5px" }}
                  />
                }
                Make another offer
              </Button>
            </React.Fragment>
          );
          break;
        case "COMPLETED_OFFER":
          buttons = (
            <React.Fragment>
              <p
                className={classes.promptMessage}
                style={{ margin: "5px", color: "#f3a1a1" }}
              >
                {
                  <FontAwesomeIcon
                    icon={faGlassCheers}
                    style={{ paddingRight: "5px" }}
                  />
                }
                Rental completed
              </p>
              <Button btnType="Important" onClick={this.onShowPopUpHandler}>
                {
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    style={{ paddingRight: "5px" }}
                  />
                }
                Make another offer
              </Button>
            </React.Fragment>
          );
          break;
        case "FIRST_OFFER":
          buttons = (
            <React.Fragment>
              <Button btnType="Important" onClick={this.onShowPopUpHandler}>
                {
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    style={{ paddingRight: "5px" }}
                  />
                }
                Make offer
              </Button>
              <Button onClick={this.onInterestedOffer}>
                <span style={{ fontSize: "small" }}>
                  {
                    <FontAwesomeIcon
                      icon={faExclamation}
                      style={{ paddingRight: "5px" }}
                    />
                  }
                  I'm interested
                </span>
              </Button>
            </React.Fragment>
          );
          break;
        case "INTERESTED_OFFER":
          buttons = (
            <Button btnType="Important" onClick={this.onShowPopUpHandler}>
              {
                <FontAwesomeIcon
                  icon={faDollarSign}
                  style={{ paddingRight: "5px" }}
                />
              }
              Make offer
            </Button>
          );
          break;
        default:
          break;
      }
    }

    return this.state.errorMessage ? (
      <div className={classes.InterestedListing}>
        <p style={{ color: "red", fontSize: "small" }}>
          {this.state.errorMessage}
        </p>
      </div>
    ) : (
      <React.Fragment>
        <div className={classes.InterestedListing}>
          <div style={{ margin: "16px" }}>
            <img
              src={this.state.interestedListing.url}
              alt="listing"
              className={classes.image}
            />
          </div>
          <div className={classes.InterestedListingDetails}>
            <p style={{ margin: "0", marginBottom: "-15px" }}>
              《{this.state.interestedListing.textbook}》
            </p>
            <p>
              <span>
                <b>$ {this.state.interestedListing.price}</b>
                {this.state.interestedListing.listingType === "rent"
                  ? "/ month"
                  : null}
              </span>
            </p>
          </div>
          <div className={classes.Buttons}>{buttons}</div>
        </div>
        {offerPopUp}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    interestedListing: state.listing.interestedListing,
    displayName: state.auth.displayName,
    recipient: state.chat.recipient,
  };
};

export default connect(mapStateToProps)(Offer);
