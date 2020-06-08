import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from "../Listings.css";
import Listing from '../Listing/Listing';

class LikedListing extends Component {

    render() {
        const listings = 
            this.props.listings.filter(listing => {
                for (let user in listing.likedUsers) {
                    if (listing.likedUsers[user] === this.props.displayName) {
                        return true;
                    }
                }
                return false;
            }).map((listing) => {
                return (
                <Listing
                    history={this.props.history}
                    key={listing.unique}
                    identifier={listing.unique} 
                    userId={listing.displayName}
                    status={listing.status}
                    deliveryMethod={listing.postDetails.deliveryMethod}
                    location={listing.postDetails.location}
                    module={listing.postDetails.module}
                    price={listing.postDetails.price}
                    textbook={listing.postDetails.textbook}
                    numImages={listing.numberOfImages}
                    node={listing.key}
                    likedUsers={listing.likedUsers}
                />
                );
            })
        return <div className={classes.Listings}>{listings}</div>;
    }
}

const mapStateToProps = (state) => {
    return {
        listings: state.listing.listings,
        displayName: state.auth.displayName
    }
}

export default connect(mapStateToProps)(LikedListing);