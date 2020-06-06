import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import classes from "./ExpandedListing.css";
import { storage } from "../../../firebase/firebase";
import * as actions from "../../../store/actions/index";
import Button from "../../../components/UI/Button/Button";
import Spinner from '../../../components/UI/Spinner/Spinner';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

class ExpandedListing extends Component {
  state = {
    loading: true,
    listing: null,
    image: [],
    imageIndex: 0,
    error: false,
  };

  componentDidMount() {
    //Something wrong here. Will get error when reloading expanded listing
    // let expandedListing;
    if (this.state.listing === null) {
      this.setState({listing: this.props.listing})
    }

    // Something also wrong here. Order of pictures always different due to async code?
    let imageArray = [];
    if (this.state.image.length === 0) {
      storage
        .ref()
        .child(`listingPictures/${this.props.listing[10]}`)
        .listAll()
        .then(result => {
          result.items.forEach(image => {
            image.getDownloadURL().then(url => {
              imageArray.push(url);
            })
          })
        })
        .then(this.setState({image: imageArray}))
        .then(this.setState({loading: false}))
        .catch(error => {
          console.log(error);
        }) 
        //This will result in different order of pictures everytime
        // this.setState({image: imageArray, loading: false})
    }
  }

  prevImageHandler = () => {
    this.setState(prevState => {
      return { imageIndex: prevState.imageIndex - 1 }
    });
  }

  nextImageHandler = () => {
    this.setState(prevState => {
      return { imageIndex: prevState.imageIndex + 1 }
    });
  }

  render() {

    if (this.state.loading) {
      return <Spinner />
    }

    const singleImage = <img
      src={this.state.image[this.state.imageIndex]}
      alt={this.state.error ? "Unable to load image" : "Loading image..."}
      className={classes.Image} /> 

    const image = this.state.image.length === 1 ?
      singleImage :
      <div className={classes.Images}>
        <button 
          onClick={this.prevImageHandler} 
          disabled={this.state.imageIndex === 0}
          className={classes.ImageButton}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              />
        </button>
        {singleImage}
        <button 
          onClick={this.nextImageHandler}
          disabled={this.state.imageIndex === this.state.image.length - 1}
          className={classes.ImageButton}>
            <FontAwesomeIcon
              icon={faChevronRight}
              />
        </button>
      </div>;

    const text = (
      <React.Fragment>
        <div className={classes.Text}>
          <div>
            <h1>
              {this.state.listing[6]}:《{this.state.listing[8]}》
            </h1>
          </div>

          <div>
            <ul className={classes.Description}>
              <li>Price: ${this.state.listing[7]} / month</li>
              <li>Delivery method: {this.state.listing[3]}</li>
              <li>Location: {this.state.listing[5]}</li>
              <li>
                <br />
                Description: <br /> {this.state.listing[4]}
              </li>
              <br />
              <li>Posted by: {this.state.listing[1]}</li>
            </ul>
          </div>
          <div className={classes.Button}>
            <Link to="/chats">
              <Button
                onClick={() =>
                  this.props.dispatchGoToChat(this.state.listing[1])
                }
              >
                Chat
              </Button>
            </Link>
            <Button>Rent Now</Button>
          </div>
        </div>
        <div>
          <Link to="/">
            <FontAwesomeIcon
              icon={faWindowClose}
              style={{
                float: "right",
                paddingLeft: "10px",
                color: "#ff5138",
              }} />
          </Link>
        </div>
      </React.Fragment>
    );

    return (
      <div className={classes.ExpandedListing}>
        <div className={classes.Left}>{image}</div>
        <div className={classes.Right}>{text}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listing: state.listing.expandedListingDetail,
    
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchGoToChat: (displayName) =>
      dispatch(actions.goToChat(displayName)),
      dispatchFetchAllListings: () => dispatch(actions.fetchAllListings()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpandedListing);